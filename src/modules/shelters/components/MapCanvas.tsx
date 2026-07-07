import { Icon } from "@components";
import { $uw } from "@theme";
import { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";

export type CanvasShape = {
	key: string;
	kind: "area" | "box" | "element";
	x: number;
	y: number;
	width: number;
	height: number;
	rotation?: number;
	fill: string;
	stroke: string;
	strokeWidth: number;
	label?: string;
	sub?: string;
	textColor?: string;
};

type Props = {
	mapWidth: number;
	mapHeight: number;
	shapes: CanvasShape[]; // draw order: areas, elements, boxes
	selectedKey?: string | null;
	editMode: boolean;
	onSelectShape: (key: string | null) => void;
	// notifica ingresso/uscita dalla modalità resize (long-press)
	onResizeModeChange?: (key: string | null) => void;
	onTapBox: (key: string) => void;
	onDragShape: (key: string, dxMap: number, dyMap: number) => void;
	onMoveShape?: (key: string, xMap: number, yMap: number) => void;
	onResizeShape: (
		key: string,
		next: { x: number; y: number; width: number; height: number }
	) => void;
	hasClipboard?: boolean;
	onCopy?: () => void;
	onCut?: () => void;
	onPaste?: () => void;
};

type View = { scale: number; tx: number; ty: number; rot: number };

// rotate vector (x,y) by deg (SVG/screen: clockwise positive)
const rotVec = (x: number, y: number, deg: number) => {
	const r = (deg * Math.PI) / 180;
	const c = Math.cos(r);
	const s = Math.sin(r);
	return { x: x * c - y * s, y: x * s + y * c };
};
const TAP_THRESHOLD = 8;
const MIN_SCALE = 0.15;
const MAX_SCALE = 8;
const LONG_PRESS_MS = 450;
const HANDLE_SIZE_PX = 12;
const HANDLE_HIT_PX = 18;
const MIN_DIM = 1;
const DEFAULT_ZOOM_PCT = 80;
const ZOOM_MIN_PCT = 25;
const ZOOM_MAX_PCT = 400;
const SNAP_PX = 8;

type HandleName = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: HandleName[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const HANDLE_SIGNS: Record<HandleName, { dw: -1 | 0 | 1; dh: -1 | 0 | 1 }> = {
	nw: { dw: -1, dh: -1 },
	n: { dw: 0, dh: -1 },
	ne: { dw: 1, dh: -1 },
	e: { dw: 1, dh: 0 },
	se: { dw: 1, dh: 1 },
	s: { dw: 0, dh: 1 },
	sw: { dw: -1, dh: 1 },
	w: { dw: -1, dh: 0 },
};
const HANDLE_CURSOR: Record<HandleName, string> = {
	nw: "nwse-resize",
	n: "ns-resize",
	ne: "nesw-resize",
	e: "ew-resize",
	se: "nwse-resize",
	s: "ns-resize",
	sw: "nesw-resize",
	w: "ew-resize",
};

const handleLocalPos = (s: CanvasShape, h: HandleName) => {
	const { dw, dh } = HANDLE_SIGNS[h];
	const cx = s.x + s.width / 2;
	const cy = s.y + s.height / 2;
	return { x: cx + (dw * s.width) / 2, y: cy + (dh * s.height) / 2 };
};

// world (map units) → local (un-rotated around shape center)
const worldToLocal = (
	mx: number,
	my: number,
	cx: number,
	cy: number,
	rotDeg: number
) => {
	if (!rotDeg) return { x: mx, y: my };
	const rad = (-rotDeg * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	const dx = mx - cx;
	const dy = my - cy;
	return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
};

// snap-to-edges: given a raw target position for the dragged shape, find the
// smallest x/y offset that aligns one of its edges (left/center/right) with an
// edge of another shape or the map bounds, within the given threshold.
const computeSnap = (
	x: number,
	y: number,
	w: number,
	h: number,
	key: string,
	shapes: CanvasShape[],
	mapW: number,
	mapH: number,
	threshold: number
): { dx: number; dy: number; vGuides: number[]; hGuides: number[] } => {
	const xEdges = [x, x + w / 2, x + w];
	const yEdges = [y, y + h / 2, y + h];
	const xCands: number[] = [0, mapW / 2, mapW];
	const yCands: number[] = [0, mapH / 2, mapH];
	for (const s of shapes) {
		if (s.key === key) continue;
		xCands.push(s.x, s.x + s.width / 2, s.x + s.width);
		yCands.push(s.y, s.y + s.height / 2, s.y + s.height);
	}
	let bestDx: number | null = null;
	let bestVGuide: number | null = null;
	for (const e of xEdges) {
		for (const c of xCands) {
			const d = c - e;
			if (
				Math.abs(d) < threshold &&
				(bestDx === null || Math.abs(d) < Math.abs(bestDx))
			) {
				bestDx = d;
				bestVGuide = c;
			}
		}
	}
	let bestDy: number | null = null;
	let bestHGuide: number | null = null;
	for (const e of yEdges) {
		for (const c of yCands) {
			const d = c - e;
			if (
				Math.abs(d) < threshold &&
				(bestDy === null || Math.abs(d) < Math.abs(bestDy))
			) {
				bestDy = d;
				bestHGuide = c;
			}
		}
	}
	return {
		dx: bestDx ?? 0,
		dy: bestDy ?? 0,
		vGuides: bestVGuide !== null ? [bestVGuide] : [],
		hGuides: bestHGuide !== null ? [bestHGuide] : [],
	};
};

export const MapCanvas: React.FC<Props> = ({
	mapWidth,
	mapHeight,
	shapes,
	selectedKey,
	editMode,
	onSelectShape,
	onResizeModeChange,
	onTapBox,
	onDragShape,
	onMoveShape,
	onResizeShape,
	hasClipboard,
	onCopy,
	onCut,
	onPaste,
}) => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>({ scale: 1, tx: 0, ty: 0, rot: 0 });
	const viewRef = useRef(view);
	viewRef.current = view;
	// container size (px) for rotation center
	const [size, setSize] = useState({ w: 0, h: 0 });
	const centerNow = () => {
		const r = wrapRef.current?.getBoundingClientRect();
		return { x: (r?.width ?? 0) / 2, y: (r?.height ?? 0) / 2 };
	};

	const fitScaleRef = useRef<number>(1);
	const [zoomOpen, setZoomOpen] = useState(false);

	const [resizeKey, setResizeKey] = useState<string | null>(null);
	const resizeKeyRef = useRef<string | null>(null);
	resizeKeyRef.current = resizeKey;

	// notifica il parent quando entro/esco dalla modalità resize
	useEffect(() => {
		onResizeModeChange?.(resizeKey);
	}, [resizeKey]);

	// exit resize mode if selection cleared or changed to another shape
	useEffect(() => {
		if (!selectedKey || (resizeKey && selectedKey !== resizeKey)) {
			setResizeKey(null);
		}
	}, [selectedKey]);
	// exit resize mode if we leave edit mode
	useEffect(() => {
		if (!editMode) setResizeKey(null);
	}, [editMode]);

	const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
	const gesture = useRef<{
		mode: "none" | "pan" | "drag" | "pinch" | "resize";
		dragKey?: string;
		startDist?: number;
		startScale?: number;
		startAngle?: number; // rad, between 2 pointers at pinch start
		startRot?: number; // view rotation at pinch start
		moved: number;
		lastMid?: { x: number; y: number };
		longPressTimer?: number;
		dragStartBounds?: { x: number; y: number; width: number; height: number };
		dragStartPointer?: { x: number; y: number };
		resizeShapeKey?: string;
		resizeHandle?: HandleName;
		resizeStart?: {
			x: number;
			y: number;
			width: number;
			height: number;
			rotation: number;
		};
		resizeStartPointer?: { x: number; y: number };
	}>({ mode: "none", moved: 0 });

	// last snap lines shown while dragging (in map units, screen render just uses view.scale)
	const [snapLines, setSnapLines] = useState<{
		v: number[]; // x positions of vertical guides
		h: number[]; // y positions of horizontal guides
	}>({ v: [], h: [] });

	const clearLongPress = () => {
		if (gesture.current.longPressTimer !== undefined) {
			clearTimeout(gesture.current.longPressTimer);
			gesture.current.longPressTimer = undefined;
		}
	};

	// fit map to container width on mount / map change
	useEffect(() => {
		const el = wrapRef.current;
		if (!el || !mapWidth || !mapHeight) return;
		const rect = el.getBoundingClientRect();
		setSize({ w: rect.width, h: rect.height });
		const fit = Math.min(rect.width / mapWidth, rect.height / mapHeight);
		fitScaleRef.current = fit;
		const scale = fit * (DEFAULT_ZOOM_PCT / 100);
		const tx = (rect.width - mapWidth * scale) / 2;
		const ty = (rect.height - mapHeight * scale) / 2;
		setView({ scale, tx, ty, rot: 0 });
	}, [mapWidth, mapHeight]);

	const zoomPercent = Math.round(
		(view.scale / (fitScaleRef.current || 1)) * 100
	);

	const applyZoomPercent = (pct: number) => {
		const el = wrapRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		setView((v) => {
			const target = Math.min(
				MAX_SCALE,
				Math.max(MIN_SCALE, fitScaleRef.current * (pct / 100))
			);
			const k = target / v.scale;
			return {
				...v,
				scale: target,
				tx: cx - (cx - v.tx) * k,
				ty: cy - (cy - v.ty) * k,
			};
		});
	};

	// wheel zoom around cursor (native listener so preventDefault works)
	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return;
		const onWheelNative = (e: WheelEvent) => {
			e.preventDefault();
			const rect = el.getBoundingClientRect();
			const px = e.clientX - rect.left;
			const py = e.clientY - rect.top;
			// normalize delta across deltaMode (pixel / line / page)
			const unit =
				e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? rect.height : 1;
			const dy = e.deltaY * unit;
			const zoomFactor = Math.exp(-dy * 0.0015);
			setView((v) => {
				const target = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, v.scale * zoomFactor)
				);
				const k = target / v.scale;
				return {
					...v,
					scale: target,
					tx: px - (px - v.tx) * k,
					ty: py - (py - v.ty) * k,
				};
			});
		};
		el.addEventListener("wheel", onWheelNative, { passive: false });
		return () => el.removeEventListener("wheel", onWheelNative);
	}, []);

	const rel = (e: React.PointerEvent) => {
		const r = wrapRef.current!.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	};

	const toMap = (sx: number, sy: number) => {
		const v = viewRef.current;
		const c = centerNow();
		// invert: screen = C + Rot(rot)*(scale*p + t - C)  →  p = (Rot(-rot)*(screen-C) + C - t)/scale
		const u = rotVec(sx - c.x, sy - c.y, -v.rot);
		return {
			x: (u.x + c.x - v.tx) / v.scale,
			y: (u.y + c.y - v.ty) / v.scale,
		};
	};

	const hitTest = useCallback(
		(sx: number, sy: number): CanvasShape | null => {
			const p = toMap(sx, sy);
			// boxes on top, then elements, then areas
			const order = [...shapes].reverse();
			for (const s of order) {
				if (
					p.x >= s.x &&
					p.x <= s.x + s.width &&
					p.y >= s.y &&
					p.y <= s.y + s.height
				)
					return s;
			}
			return null;
		},
		[shapes]
	);

	const handleHitTest = useCallback(
		(sx: number, sy: number): { handle: HandleName; shape: CanvasShape } | null => {
			const rk = resizeKeyRef.current;
			if (!rk) return null;
			const shape = shapes.find((s) => s.key === rk);
			if (!shape) return null;
			const scale = viewRef.current.scale;
			const wp = toMap(sx, sy);
			const cx = shape.x + shape.width / 2;
			const cy = shape.y + shape.height / 2;
			const lp = worldToLocal(wp.x, wp.y, cx, cy, shape.rotation || 0);
			const rHit = HANDLE_HIT_PX / scale;
			for (const h of HANDLES) {
				const pos = handleLocalPos(shape, h);
				if (Math.abs(lp.x - pos.x) < rHit && Math.abs(lp.y - pos.y) < rHit) {
					return { handle: h, shape };
				}
			}
			return null;
		},
		[shapes]
	);

	const onPointerDown = (e: React.PointerEvent) => {
		(e.target as Element).setPointerCapture?.(e.pointerId);
		const p = rel(e);
		pointers.current.set(e.pointerId, p);
		const g = gesture.current;
		g.moved = 0;
		clearLongPress();
		if (pointers.current.size === 2) {
			const [a, b] = [...pointers.current.values()];
			g.mode = "pinch";
			g.startDist = Math.hypot(a.x - b.x, a.y - b.y);
			g.startScale = viewRef.current.scale;
			g.startAngle = Math.atan2(b.y - a.y, b.x - a.x);
			g.startRot = viewRef.current.rot;
			g.lastMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			return;
		}
		// resize handle first
		if (resizeKeyRef.current) {
			const hh = handleHitTest(p.x, p.y);
			if (hh) {
				g.mode = "resize";
				g.resizeShapeKey = hh.shape.key;
				g.resizeHandle = hh.handle;
				g.resizeStart = {
					x: hh.shape.x,
					y: hh.shape.y,
					width: hh.shape.width,
					height: hh.shape.height,
					rotation: hh.shape.rotation || 0,
				};
				g.resizeStartPointer = { x: p.x, y: p.y };
				return;
			}
		}
		const hit = hitTest(p.x, p.y);
		if (editMode && hit && hit.key === selectedKey) {
			g.mode = "drag";
			g.dragKey = hit.key;
			g.dragStartBounds = {
				x: hit.x,
				y: hit.y,
				width: hit.width,
				height: hit.height,
			};
			g.dragStartPointer = { x: p.x, y: p.y };
		} else {
			g.mode = "pan";
		}
		// long-press to enter resize mode on a shape
		if (editMode && hit) {
			const hitKey = hit.key;
			const pAtDown = { x: p.x, y: p.y };
			g.longPressTimer = window.setTimeout(() => {
				g.longPressTimer = undefined;
				if (
					g.moved < TAP_THRESHOLD &&
					g.mode !== "pinch" &&
					g.mode !== "resize"
				) {
					setResizeKey(hitKey);
					onSelectShape(hitKey);
					g.mode = "drag";
					g.dragKey = hitKey;
					g.dragStartBounds = {
						x: hit.x,
						y: hit.y,
						width: hit.width,
						height: hit.height,
					};
					g.dragStartPointer = pAtDown;
				}
			}, LONG_PRESS_MS) as unknown as number;
		}
	};

	const onPointerMove = (e: React.PointerEvent) => {
		if (!pointers.current.has(e.pointerId)) return;
		const p = rel(e);
		const prev = pointers.current.get(e.pointerId)!;
		const dx = p.x - prev.x;
		const dy = p.y - prev.y;
		pointers.current.set(e.pointerId, p);
		const g = gesture.current;
		g.moved += Math.abs(dx) + Math.abs(dy);
		if (g.moved > TAP_THRESHOLD) clearLongPress();

		if (g.mode === "pinch" && pointers.current.size === 2) {
			const [a, b] = [...pointers.current.values()];
			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			const ang = Math.atan2(b.y - a.y, b.x - a.x);
			const rot =
				(g.startRot ?? 0) +
				((ang - (g.startAngle ?? ang)) * 180) / Math.PI;
			setView((v) => {
				const target = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, (g.startScale! * dist) / (g.startDist || 1))
				);
				const k = target / v.scale;
				let tx = mid.x - (mid.x - v.tx) * k;
				let ty = mid.y - (mid.y - v.ty) * k;
				if (g.lastMid) {
					tx += mid.x - g.lastMid.x;
					ty += mid.y - g.lastMid.y;
				}
				g.lastMid = mid;
				return { scale: target, tx, ty, rot };
			});
			return;
		}

		if (
			g.mode === "resize" &&
			g.resizeShapeKey &&
			g.resizeHandle &&
			g.resizeStart &&
			g.resizeStartPointer
		) {
			const scale = viewRef.current.scale;
			const totalDxS = p.x - g.resizeStartPointer.x;
			const totalDyS = p.y - g.resizeStartPointer.y;
			const shapeRot = g.resizeStart.rotation;
			// screen→shape-local uses shape rotation + current view rotation
			const rad = (-(shapeRot + viewRef.current.rot) * Math.PI) / 180;
			const cos = Math.cos(rad);
			const sin = Math.sin(rad);
			const mDx = (totalDxS * cos - totalDyS * sin) / scale;
			const mDy = (totalDxS * sin + totalDyS * cos) / scale;
			const { dw, dh } = HANDLE_SIGNS[g.resizeHandle];
			const newW = Math.max(MIN_DIM, g.resizeStart.width + dw * mDx);
			const newH = Math.max(MIN_DIM, g.resizeStart.height + dh * mDy);
			const appliedDW = newW - g.resizeStart.width;
			const appliedDH = newH - g.resizeStart.height;
			// center shift in local (unrotated) space, so anchor edge stays fixed
			const dAnchorLX = dw !== 0 ? (dw * appliedDW) / 2 : 0;
			const dAnchorLY = dh !== 0 ? (dh * appliedDH) / 2 : 0;
			// local→map-world uses ONLY shape rotation (box coords live in map space)
			const rrad = (shapeRot * Math.PI) / 180;
			const rcos = Math.cos(rrad);
			const rsin = Math.sin(rrad);
			const dCwX = dAnchorLX * rcos - dAnchorLY * rsin;
			const dCwY = dAnchorLX * rsin + dAnchorLY * rcos;
			const oldCx = g.resizeStart.x + g.resizeStart.width / 2;
			const oldCy = g.resizeStart.y + g.resizeStart.height / 2;
			const newCx = oldCx + dCwX;
			const newCy = oldCy + dCwY;
			onResizeShape(g.resizeShapeKey, {
				x: newCx - newW / 2,
				y: newCy - newH / 2,
				width: newW,
				height: newH,
			});
			return;
		}

		if (g.mode === "drag" && g.dragKey) {
			const s = viewRef.current.scale;
			const rot = viewRef.current.rot;
			if (onMoveShape && g.dragStartBounds && g.dragStartPointer) {
				// convert screen delta to map delta accounting for view rotation
				const dm = rotVec(
					p.x - g.dragStartPointer.x,
					p.y - g.dragStartPointer.y,
					-rot
				);
				const rawX = g.dragStartBounds.x + dm.x / s;
				const rawY = g.dragStartBounds.y + dm.y / s;
				const w = g.dragStartBounds.width;
				const h = g.dragStartBounds.height;
				const snap = computeSnap(
					rawX,
					rawY,
					w,
					h,
					g.dragKey,
					shapes,
					mapWidth,
					mapHeight,
					SNAP_PX / s
				);
				onMoveShape(g.dragKey, rawX + snap.dx, rawY + snap.dy);
				setSnapLines({ v: snap.vGuides, h: snap.hGuides });
			} else {
				const dm = rotVec(dx, dy, -rot);
				onDragShape(g.dragKey, dm.x / s, dm.y / s);
			}
			return;
		}

		if (g.mode === "pan") {
			// move map with finger even when view is rotated
			const dm = rotVec(dx, dy, -viewRef.current.rot);
			setView((v) => ({ ...v, tx: v.tx + dm.x, ty: v.ty + dm.y }));
		}
	};

	const onPointerUp = (e: React.PointerEvent) => {
		const p = rel(e);
		const g = gesture.current;
		pointers.current.delete(e.pointerId);
		clearLongPress();
		if (pointers.current.size === 0) {
			if (
				g.moved < TAP_THRESHOLD &&
				g.mode !== "pinch" &&
				g.mode !== "resize"
			) {
				const hit = hitTest(p.x, p.y);
				if (hit && hit.kind === "box" && !editMode) onTapBox(hit.key);
				else {
					onSelectShape(hit ? hit.key : null);
					if (!hit) setResizeKey(null);
				}
			}
			g.mode = "none";
			g.dragKey = undefined;
			g.dragStartBounds = undefined;
			g.dragStartPointer = undefined;
			g.resizeShapeKey = undefined;
			g.resizeHandle = undefined;
			g.resizeStart = undefined;
			g.resizeStartPointer = undefined;
			if (snapLines.v.length || snapLines.h.length)
				setSnapLines({ v: [], h: [] });
		}
	};

	const resizeShapeObj = resizeKey ? shapes.find((s) => s.key === resizeKey) : null;

	return (
		<Wrap className="mapEditor" ref={wrapRef}>
			<svg
				width="100%"
				height="100%"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				style={{ touchAction: "none", display: "block" }}
			>
				<g
					transform={
						`translate(${size.w / 2} ${size.h / 2}) rotate(${view.rot}) ` +
						`translate(${-size.w / 2} ${-size.h / 2}) ` +
						`translate(${view.tx} ${view.ty}) scale(${view.scale})`
					}
				>
					<rect
						x={0}
						y={0}
						width={mapWidth}
						height={mapHeight}
						fill="#dfe4ea"
						stroke="rgba(0,0,0,0.35)"
						strokeWidth={1.5 / view.scale}
					/>
					{shapes.map((s) => {
						const cx = s.x + s.width / 2;
						const cy = s.y + s.height / 2;
						const sel = s.key === selectedKey;
						const rx = s.kind === "box" ? 2 : 0;
						return (
							<g
								key={s.key}
								transform={
									s.rotation
										? `rotate(${s.rotation} ${cx} ${cy})`
										: undefined
								}
							>
								<rect
									x={s.x}
									y={s.y}
									width={s.width}
									height={s.height}
									rx={rx}
									fill={s.fill}
									stroke={sel ? "#111" : s.stroke}
									strokeWidth={
										(sel ? s.strokeWidth + 2 : s.strokeWidth) /
										view.scale
									}
									strokeDasharray={
										sel ? `${6 / view.scale} ${4 / view.scale}` : undefined
									}
								/>
								{s.label && (
									<text
										x={cx}
										y={cy}
										textAnchor="middle"
										dominantBaseline="central"
										fill={s.textColor || "#111"}
										fontSize={10 / view.scale}
										fontWeight={700}
										style={{ pointerEvents: "none" }}
									>
										{s.label}
									</text>
								)}
								{s.sub && (
									<text
										x={cx}
										y={cy + 10 / view.scale}
										textAnchor="middle"
										dominantBaseline="central"
										fill={s.textColor || "#111"}
										fontSize={10 / view.scale}
										style={{ pointerEvents: "none" }}
									>
										{s.sub}
									</text>
								)}
							</g>
						);
					})}
					{resizeShapeObj && (
						<g
							transform={
								resizeShapeObj.rotation
									? `rotate(${resizeShapeObj.rotation} ${
											resizeShapeObj.x + resizeShapeObj.width / 2
									  } ${resizeShapeObj.y + resizeShapeObj.height / 2})`
									: undefined
							}
						>
							<rect
								x={resizeShapeObj.x}
								y={resizeShapeObj.y}
								width={resizeShapeObj.width}
								height={resizeShapeObj.height}
								fill="none"
								stroke="#0a84ff"
								strokeWidth={2 / view.scale}
								strokeDasharray={`${4 / view.scale} ${3 / view.scale}`}
								pointerEvents="none"
							/>
							{HANDLES.map((h) => {
								const pos = handleLocalPos(resizeShapeObj, h);
								const size = HANDLE_SIZE_PX / view.scale;
								return (
									<rect
										key={h}
										x={pos.x - size / 2}
										y={pos.y - size / 2}
										width={size}
										height={size}
										fill="#fff"
										stroke="#0a84ff"
										strokeWidth={1.5 / view.scale}
										style={{ cursor: HANDLE_CURSOR[h] }}
									/>
								);
							})}
						</g>
					)}
					{snapLines.v.map((vx, i) => (
						<line
							key={`sv-${i}`}
							x1={vx}
							y1={0}
							x2={vx}
							y2={mapHeight}
							stroke="#ff4d94"
							strokeWidth={1 / view.scale}
							strokeDasharray={`${3 / view.scale} ${3 / view.scale}`}
							pointerEvents="none"
						/>
					))}
					{snapLines.h.map((hy, i) => (
						<line
							key={`sh-${i}`}
							x1={0}
							y1={hy}
							x2={mapWidth}
							y2={hy}
							stroke="#ff4d94"
							strokeWidth={1 / view.scale}
							strokeDasharray={`${3 / view.scale} ${3 / view.scale}`}
							pointerEvents="none"
						/>
					))}
				</g>
			</svg>
			<ZoomBtn
				type="button"
				aria-label="Zoom"
				onClick={(e) => {
					e.stopPropagation();
					setZoomOpen((v) => !v);
				}}
				onPointerDown={(e) => e.stopPropagation()}
			>
				<Icon name="search" color="primary" size="20px" />
			</ZoomBtn>
			{Math.round(view.rot) % 360 !== 0 && (
				<RotBtn
					type="button"
					aria-label="Reset rotation"
					onClick={(e) => {
						e.stopPropagation();
						setView((v) => ({ ...v, rot: 0 }));
					}}
					onPointerDown={(e) => e.stopPropagation()}
				>
					<Icon name="refreshOutline" color="primary" size="18px" />
				</RotBtn>
			)}
			{editMode && (onCopy || onCut || onPaste) && (
				<ActionStack>
					{onCopy && (
						<ActionBtn
							type="button"
							aria-label="Copy"
							disabled={!selectedKey}
							onClick={(e) => {
								e.stopPropagation();
								onCopy();
							}}
							onPointerDown={(e) => e.stopPropagation()}
						>
							<Icon
								name="copyOutline"
								color={selectedKey ? "primary" : "medium"}
								size="18px"
							/>
						</ActionBtn>
					)}
					{onCut && (
						<ActionBtn
							type="button"
							aria-label="Cut"
							disabled={!selectedKey}
							onClick={(e) => {
								e.stopPropagation();
								onCut();
							}}
							onPointerDown={(e) => e.stopPropagation()}
						>
							<Icon
								name="cutOutline"
								color={selectedKey ? "primary" : "medium"}
								size="18px"
							/>
						</ActionBtn>
					)}
					{onPaste && (
						<ActionBtn
							type="button"
							aria-label="Paste"
							disabled={!hasClipboard}
							onClick={(e) => {
								e.stopPropagation();
								onPaste();
							}}
							onPointerDown={(e) => e.stopPropagation()}
						>
							<Icon
								name="clipboardOutline"
								color={hasClipboard ? "primary" : "medium"}
								size="18px"
							/>
						</ActionBtn>
					)}
				</ActionStack>
			)}
			{zoomOpen && (
				<ZoomPanel
					onPointerDown={(e) => e.stopPropagation()}
					onClick={(e) => e.stopPropagation()}
				>
					<ZoomLabel>{zoomPercent}%</ZoomLabel>
					<input
						type="range"
						min={ZOOM_MIN_PCT}
						max={ZOOM_MAX_PCT}
						step={5}
						value={Math.min(
							ZOOM_MAX_PCT,
							Math.max(ZOOM_MIN_PCT, zoomPercent)
						)}
						onChange={(e) => applyZoomPercent(parseInt(e.target.value))}
					/>
					<ZoomReset
						type="button"
						onClick={() => applyZoomPercent(DEFAULT_ZOOM_PCT)}
					>
						{DEFAULT_ZOOM_PCT}%
					</ZoomReset>
				</ZoomPanel>
			)}
		</Wrap>
	);
};

const Wrap = styled.div`
	position: relative;
	width: 100%;
	height: 62vh;
	background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.03) 0,
			rgba(0, 0, 0, 0.03) 1px,
			transparent 1px,
			transparent 24px
		),
		repeating-linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.03) 0,
			rgba(0, 0, 0, 0.03) 1px,
			transparent 1px,
			transparent 24px
		);
	overflow: hidden;
	touch-action: none;
	border-bottom: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	text {
		font-size: ${$uw(0.3)};
	}
`;

const ZoomBtn = styled.button`
	position: absolute;
	top: 8px;
	right: 8px;
	z-index: 20;
	width: 40px;
	height: 40px;
	border-radius: 999px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	background: #fff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
	cursor: pointer;
	padding: 0;
`;

const RotBtn = styled.button`
	position: absolute;
	bottom: 8px;
	right: 8px;
	z-index: 20;
	width: 40px;
	height: 40px;
	border-radius: 999px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	background: #fff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
	cursor: pointer;
	padding: 0;
`;

const ActionStack = styled.div`
	position: absolute;
	top: 56px;
	right: 8px;
	z-index: 20;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const ActionBtn = styled.button`
	width: 36px;
	height: 36px;
	border-radius: 999px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	background: #fff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
	cursor: pointer;
	padding: 0;
	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
`;

const ZoomPanel = styled.div`
	position: absolute;
	top: 8px;
	right: 56px;
	z-index: 20;
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	padding: 10px 12px;
	display: flex;
	align-items: center;
	gap: 10px;
	> input[type="range"] {
		width: 180px;
	}
`;

const ZoomLabel = styled.span`
	font-size: 12px;
	font-weight: 700;
	color: rgba(0, 0, 0, 0.7);
	min-width: 40px;
`;

const ZoomReset = styled.button`
	border: 1px solid rgba(0, 0, 0, 0.15);
	background: #f5f5f5;
	border-radius: 6px;
	padding: 4px 8px;
	font-size: 11px;
	font-weight: 700;
	color: rgba(0, 0, 0, 0.7);
	cursor: pointer;
`;
