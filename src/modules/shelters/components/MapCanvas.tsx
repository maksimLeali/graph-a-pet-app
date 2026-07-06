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
	onTapBox: (key: string) => void;
	onDragShape: (key: string, dxMap: number, dyMap: number) => void;
};

type View = { scale: number; tx: number; ty: number };
const TAP_THRESHOLD = 8;
const MIN_SCALE = 0.15;
const MAX_SCALE = 8;

export const MapCanvas: React.FC<Props> = ({
	mapWidth,
	mapHeight,
	shapes,
	selectedKey,
	editMode,
	onSelectShape,
	onTapBox,
	onDragShape,
}) => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>({ scale: 1, tx: 0, ty: 0 });
	const viewRef = useRef(view);
	viewRef.current = view;

	const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
	const gesture = useRef<{
		mode: "none" | "pan" | "drag" | "pinch";
		dragKey?: string;
		startDist?: number;
		startScale?: number;
		moved: number;
		lastMid?: { x: number; y: number };
	}>({ mode: "none", moved: 0 });

	// fit map to container width on mount / map change
	useEffect(() => {
		const el = wrapRef.current;
		if (!el || !mapWidth || !mapHeight) return;
		const rect = el.getBoundingClientRect();
		const scale = Math.min(rect.width / mapWidth, rect.height / mapHeight) * 0.92;
		const tx = (rect.width - mapWidth * scale) / 2;
		const ty = (rect.height - mapHeight * scale) / 2;
		setView({ scale, tx, ty });
	}, [mapWidth, mapHeight]);

	const rel = (e: React.PointerEvent) => {
		const r = wrapRef.current!.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	};

	const toMap = (sx: number, sy: number) => {
		const v = viewRef.current;
		return { x: (sx - v.tx) / v.scale, y: (sy - v.ty) / v.scale };
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

	const onPointerDown = (e: React.PointerEvent) => {
		(e.target as Element).setPointerCapture?.(e.pointerId);
		const p = rel(e);
		pointers.current.set(e.pointerId, p);
		const g = gesture.current;
		g.moved = 0;
		if (pointers.current.size === 2) {
			const [a, b] = [...pointers.current.values()];
			g.mode = "pinch";
			g.startDist = Math.hypot(a.x - b.x, a.y - b.y);
			g.startScale = viewRef.current.scale;
			g.lastMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			return;
		}
		const hit = hitTest(p.x, p.y);
		if (editMode && hit && hit.key === selectedKey) {
			g.mode = "drag";
			g.dragKey = hit.key;
		} else {
			g.mode = "pan";
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

		if (g.mode === "pinch" && pointers.current.size === 2) {
			const [a, b] = [...pointers.current.values()];
			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			setView((v) => {
				const target = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, (g.startScale! * dist) / (g.startDist || 1))
				);
				// zoom around midpoint
				const k = target / v.scale;
				let tx = mid.x - (mid.x - v.tx) * k;
				let ty = mid.y - (mid.y - v.ty) * k;
				// pan with midpoint movement
				if (g.lastMid) {
					tx += mid.x - g.lastMid.x;
					ty += mid.y - g.lastMid.y;
				}
				g.lastMid = mid;
				return { scale: target, tx, ty };
			});
			return;
		}

		if (g.mode === "drag" && g.dragKey) {
			const s = viewRef.current.scale;
			onDragShape(g.dragKey, dx / s, dy / s);
			return;
		}

		if (g.mode === "pan") {
			setView((v) => ({ ...v, tx: v.tx + dx, ty: v.ty + dy }));
		}
	};

	const onPointerUp = (e: React.PointerEvent) => {
		const p = rel(e);
		const g = gesture.current;
		pointers.current.delete(e.pointerId);
		if (pointers.current.size === 0) {
			if (g.moved < TAP_THRESHOLD && g.mode !== "pinch") {
				const hit = hitTest(p.x, p.y);
				if (hit && hit.kind === "box" && !editMode) onTapBox(hit.key);
				else onSelectShape(hit ? hit.key : null);
			}
			g.mode = "none";
			g.dragKey = undefined;
		}
	};

	return (
		<Wrap ref={wrapRef}>
			<svg
				width="100%"
				height="100%"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				style={{ touchAction: "none", display: "block" }}
			>
				<g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
					<rect
						x={0}
						y={0}
						width={mapWidth}
						height={mapHeight}
						fill="none"
						stroke="rgba(0,0,0,0.15)"
						strokeWidth={1 / view.scale}
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
										fontSize={Math.max(
											8,
											Math.min(s.width, s.height) * 0.28
										)}
										fontWeight={700}
										style={{ pointerEvents: "none" }}
									>
										{s.label}
									</text>
								)}
								{s.sub && (
									<text
										x={cx}
										y={cy + Math.min(s.width, s.height) * 0.32}
										textAnchor="middle"
										dominantBaseline="central"
										fill={s.textColor || "#111"}
										fontSize={Math.max(
											7,
											Math.min(s.width, s.height) * 0.2
										)}
										style={{ pointerEvents: "none" }}
									>
										{s.sub}
									</text>
								)}
							</g>
						);
					})}
				</g>
			</svg>
		</Wrap>
	);
};

const Wrap = styled.div`
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
`;
