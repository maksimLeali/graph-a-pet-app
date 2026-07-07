import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { AreaType, MapElementType, RoleLevel, UserRole } from "@types";
import { MapCanvas, CanvasShape } from "../components/MapCanvas";
import { AssignPetsModal, PickablePet } from "../components/AssignPetsModal";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapLazyQuery } from "../operations/__generated__/getShelterMap.generated";
import { useCreateShelterMapMutation } from "../operations/__generated__/createShelterMap.generated";
import { useSaveShelterMapLayoutMutation } from "../operations/__generated__/saveShelterMapLayout.generated";
import { useUpdateShelterMapMutation } from "../operations/__generated__/updateShelterMap.generated";
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";
import { useAssignPetToBoxMutation } from "../operations/__generated__/assignPetToBox.generated";
import { useReleasePetFromBoxMutation } from "../operations/__generated__/releasePetFromBox.generated";
import { FullShelterMapFragment } from "../operations/__generated__/FullShelterMap.generated";

type LArea = {
	key: string;
	id?: string;
	name: string;
	area_type: AreaType;
	x: number;
	y: number;
	width: number;
	height: number;
	color?: string | null;
};
type LBox = {
	key: string;
	id?: string;
	area_id?: string | null;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	capacity: number;
	status?: string;
	is_out_of_service: boolean;
	occupants: { occId: string; shelterPetId: string; name: string }[];
};
type LElement = {
	key: string;
	id?: string;
	element_type: MapElementType;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	color?: string | null;
	label?: string | null;
};

const STATUS_FILL: Record<string, string> = {
	FREE: "#2dd36f",
	OCCUPIED: "#ffc409",
	FULL: "#ff8a34",
	OUT_OF_SERVICE: "#92949c",
};

let tmpCounter = 0;
const tmpKey = (p: string) => `tmp_${p}_${Date.now()}_${tmpCounter++}`;
const isTmp = (k: string) => k.startsWith("tmp_");

export const ShelterMapEditor: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage, user } = useUserContext();

	const [mapId, setMapId] = useState<string | null>(null);
	const [areas, setAreas] = useState<LArea[]>([]);
	const [boxes, setBoxes] = useState<LBox[]>([]);
	const [elements, setElements] = useState<LElement[]>([]);
	const [dims, setDims] = useState({ width: 20, height: 20 });
	const savedDims = useRef({ width: 20, height: 20 });
	const deleted = useRef({ areas: [] as string[], boxes: [] as string[], elements: [] as string[] });
	const [editMode, setEditMode] = useState(false);
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	const [assignBoxKey, setAssignBoxKey] = useState<string | null>(null);
	// resize mode (long-press): il props sheet resta a linguetta finché non lo apro
	const [resizeModeKey, setResizeModeKey] = useState<string | null>(null);
	const [propsPeekOpen, setPropsPeekOpen] = useState(false);
	const [clipboard, setClipboard] = useState<
		| { kind: "box"; data: LBox }
		| { kind: "area"; data: LArea }
		| { kind: "element"; data: LElement }
		| null
	>(null);
	const initializedFor = useRef<string | null>(null);

	const { data: mapsData, loading: mapsLoading } = useListShelterMapsQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 20,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});

	const [loadMap, { data: mapData }] = useGetShelterMapLazyQuery({
		fetchPolicy: "network-only",
	});
	const [createMap, { loading: creating }] = useCreateShelterMapMutation();
	const [saveLayout, { loading: saving }] = useSaveShelterMapLayoutMutation();
	const [updateMap, { loading: updatingMap }] = useUpdateShelterMapMutation();
	const [assignPet] = useAssignPetToBoxMutation();
	const [releasePet] = useReleasePetFromBoxMutation();
	const { openModal, closeModal } = useModal();

	const { data: petsData } = useListShelterPetsMinQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});
	const shelterPets = (petsData?.listShelterPets?.items ?? []).filter(
		(p): p is NonNullable<typeof p> => !!p
	);

	// ruolo dell'utente su questo shelter → permessi
	const { data: rolesData } = useListShelterRolesMinQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});
	const myRole = (rolesData?.listShelterRoles?.items ?? []).find(
		(r) => r?.user?.id === user.id
	)?.role;
	const isAdmin = user.role === UserRole.Admin;
	// edit mappa: solo owner/manager (+admin)
	const canEdit =
		isAdmin || myRole === RoleLevel.Owner || myRole === RoleLevel.Manager;
	// assegnazione cani: owner/manager/staff (+admin)
	const canAssign = canEdit || myRole === RoleLevel.Staff;

	useEffect(() => {
		setPage({ name: t("shelters.tabs.map") });
	}, []);

	// when map shrinks, clamp all shapes inside the new bounds
	useEffect(() => {
		const clamp = <
			T extends { x: number; y: number; width: number; height: number }
		>(
			s: T
		): T => {
			const nw = Math.max(1, Math.min(s.width, dims.width));
			const nh = Math.max(1, Math.min(s.height, dims.height));
			const nx = Math.max(0, Math.min(s.x, dims.width - nw));
			const ny = Math.max(0, Math.min(s.y, dims.height - nh));
			if (nw === s.width && nh === s.height && nx === s.x && ny === s.y)
				return s;
			return { ...s, x: nx, y: ny, width: nw, height: nh };
		};
		setBoxes((arr) => arr.map(clamp));
		setAreas((arr) => arr.map(clamp));
		setElements((arr) => arr.map(clamp));
	}, [dims.width, dims.height]);

	// pick first map
	const maps = (mapsData?.listShelterMaps?.items ?? []).filter(
		(m): m is NonNullable<typeof m> => !!m
	);
	useEffect(() => {
		if (!mapId && maps.length > 0) {
			setMapId(maps[0].id);
			loadMap({ variables: { id: maps[0].id } });
		}
	}, [maps, mapId]);

	// hydrate local state from fetched map
	const fetchedMap = mapData?.getShelterMap?.map;
	const hydrate = (m: FullShelterMapFragment) => {
		setDims({ width: m.width, height: m.height });
		savedDims.current = { width: m.width, height: m.height };
		setAreas(
			(m.areas ?? []).map((a) => ({
				key: a.id,
				id: a.id,
				name: a.name,
				area_type: a.area_type,
				x: a.x,
				y: a.y,
				width: a.width,
				height: a.height,
				color: a.color,
			}))
		);
		setBoxes(
			(m.boxes ?? []).map((b) => ({
				key: b.id,
				id: b.id,
				area_id: b.area?.id ?? null,
				label: b.label,
				x: b.x,
				y: b.y,
				width: b.width,
				height: b.height,
				rotation: b.rotation,
				capacity: b.capacity,
				status: b.status,
				is_out_of_service: b.is_out_of_service,
				occupants: (b.occupancy_history?.items ?? [])
					.filter((o) => o && !o.exited_at)
					.map((o) => ({
						occId: o!.id,
						shelterPetId: o!.shelter_pet?.id ?? "",
						name: o!.shelter_pet?.pet?.name ?? "-",
					})),
			}))
		);
		setElements(
			(m.elements ?? []).map((e) => ({
				key: e.id,
				id: e.id,
				element_type: e.element_type,
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height,
				rotation: e.rotation,
				color: e.color,
				label: e.label,
			}))
		);
		deleted.current = { areas: [], boxes: [], elements: [] };
	};
	useEffect(() => {
		if (fetchedMap && initializedFor.current !== fetchedMap.id) {
			initializedFor.current = fetchedMap.id;
			hydrate(fetchedMap);
		}
	}, [fetchedMap]);

	const shapes = useMemo<CanvasShape[]>(() => {
		const out: CanvasShape[] = [];
		for (const a of areas)
			out.push({
				key: a.key,
				kind: "area",
				x: a.x,
				y: a.y,
				width: a.width,
				height: a.height,
				fill: a.color || "rgba(120,120,120,0.15)",
				stroke: "rgba(0,0,0,0.25)",
				strokeWidth: 1,
				label: a.name,
				textColor: "rgba(0,0,0,0.55)",
			});
		for (const e of elements)
			out.push({
				key: e.key,
				kind: "element",
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height,
				rotation: e.rotation,
				fill: e.color || "#8d8d8d",
				stroke: "rgba(0,0,0,0.3)",
				strokeWidth: 1,
				label: e.label || undefined,
				textColor: "#fff",
			});
		for (const b of boxes) {
			const status = b.is_out_of_service ? "OUT_OF_SERVICE" : b.status || "FREE";
			out.push({
				key: b.key,
				kind: "box",
				x: b.x,
				y: b.y,
				width: b.width,
				height: b.height,
				rotation: b.rotation,
				fill: STATUS_FILL[status] || STATUS_FILL.FREE,
				stroke: "rgba(0,0,0,0.35)",
				strokeWidth: 1,
				label: b.label,
				sub: b.capacity > 1 ? `${b.occupants.length}/${b.capacity}` : undefined,
				textColor: "#1c1c1c",
			});
		}
		return out;
	}, [areas, boxes, elements]);

	const dragShape = (key: string, dx: number, dy: number) => {
		const upd = <
			T extends { key: string; x: number; y: number; width: number; height: number }
		>(
			arr: T[]
		) =>
			arr.map((s) =>
				s.key === key
					? { ...s, ...clampToMap(s.x + dx, s.y + dy, s.width, s.height) }
					: s
			);
		if (boxes.some((b) => b.key === key)) setBoxes(upd);
		else if (areas.some((a) => a.key === key)) setAreas(upd);
		else setElements(upd);
	};

	const moveShape = (key: string, x: number, y: number) => {
		const upd = <
			T extends { key: string; x: number; y: number; width: number; height: number }
		>(
			arr: T[]
		) =>
			arr.map((s) =>
				s.key === key ? { ...s, ...clampToMap(x, y, s.width, s.height) } : s
			);
		if (boxes.some((b) => b.key === key)) setBoxes(upd);
		else if (areas.some((a) => a.key === key)) setAreas(upd);
		else setElements(upd);
	};

	const resizeShape = (
		key: string,
		next: { x: number; y: number; width: number; height: number }
	) => {
		const clamped = clampToMap(next.x, next.y, next.width, next.height);
		const upd = <
			T extends { key: string; x: number; y: number; width: number; height: number }
		>(
			arr: T[]
		) => arr.map((s) => (s.key === key ? { ...s, ...clamped } : s));
		if (boxes.some((b) => b.key === key)) setBoxes(upd);
		else if (areas.some((a) => a.key === key)) setAreas(upd);
		else setElements(upd);
	};

	const updateSelectedSize = (patch: { width?: number; height?: number }) => {
		if (!selectedKey) return;
		const apply = <
			T extends { key: string; x: number; y: number; width: number; height: number }
		>(
			arr: T[]
		) =>
			arr.map((s) => {
				if (s.key !== selectedKey) return s;
				const nw = Math.max(1, patch.width ?? s.width);
				const nh = Math.max(1, patch.height ?? s.height);
				return { ...s, ...clampToMap(s.x, s.y, nw, nh) };
			});
		if (boxes.some((b) => b.key === selectedKey)) setBoxes(apply);
		else if (areas.some((a) => a.key === selectedKey)) setAreas(apply);
		else setElements(apply);
	};

	const clampToMap = (
		x: number,
		y: number,
		w: number,
		h: number
	): { x: number; y: number; width: number; height: number } => {
		const nw = Math.max(1, Math.min(w, dims.width));
		const nh = Math.max(1, Math.min(h, dims.height));
		const nx = Math.max(0, Math.min(x, dims.width - nw));
		const ny = Math.max(0, Math.min(y, dims.height - nh));
		return { x: nx, y: ny, width: nw, height: nh };
	};

	const addBox = () => {
		const k = tmpKey("box");
		setBoxes((b) => [
			...b,
			{
				key: k,
				label: `Box ${b.length + 1}`,
				x: dims.width / 2 - 3,
				y: dims.height / 2 - 3,
				width: 6,
				height: 6,
				rotation: 0,
				capacity: 1,
				status: "FREE",
				is_out_of_service: false,
				occupants: [],
			},
		]);
		setSelectedKey(k);
	};
	const addArea = () => {
		const k = tmpKey("area");
		setAreas((a) => [
			...a,
			{
				key: k,
				name: "Area",
				area_type: AreaType.Kennel,
				x: dims.width / 2 - 6,
				y: dims.height / 2 - 6,
				width: 12,
				height: 12,
				color: "#4CAF5033",
			},
		]);
		setSelectedKey(k);
	};
	const addElement = () => {
		const k = tmpKey("el");
		setElements((e) => [
			...e,
			{
				key: k,
				element_type: MapElementType.Wall,
				x: dims.width / 2 - 4,
				y: dims.height / 2 - 0.5,
				width: 8,
				height: 1,
				rotation: 0,
				color: "#5b5b5b",
			},
		]);
		setSelectedKey(k);
	};

	const deleteSelected = () => {
		if (!selectedKey) return;
		const key = selectedKey;
		const drop = (id?: string, bucket?: string[]) => {
			if (id && !isTmp(key) && bucket) bucket.push(id);
		};
		const b = boxes.find((x) => x.key === key);
		if (b) {
			drop(b.id, deleted.current.boxes);
			setBoxes((arr) => arr.filter((x) => x.key !== key));
		}
		const a = areas.find((x) => x.key === key);
		if (a) {
			drop(a.id, deleted.current.areas);
			setAreas((arr) => arr.filter((x) => x.key !== key));
		}
		const e = elements.find((x) => x.key === key);
		if (e) {
			drop(e.id, deleted.current.elements);
			setElements((arr) => arr.filter((x) => x.key !== key));
		}
		setSelectedKey(null);
	};

	const getSelected = ():
		| { kind: "box"; data: LBox }
		| { kind: "area"; data: LArea }
		| { kind: "element"; data: LElement }
		| null => {
		if (!selectedKey) return null;
		const b = boxes.find((x) => x.key === selectedKey);
		if (b) return { kind: "box", data: b };
		const a = areas.find((x) => x.key === selectedKey);
		if (a) return { kind: "area", data: a };
		const e = elements.find((x) => x.key === selectedKey);
		if (e) return { kind: "element", data: e };
		return null;
	};

	const onCopy = () => {
		const sel = getSelected();
		if (!sel) return;
		setClipboard(sel);
		toast.success(t("shelters.map.copied") ?? "Copied");
	};

	const onCut = () => {
		const sel = getSelected();
		if (!sel) return;
		setClipboard(sel);
		deleteSelected();
	};

	const onPaste = () => {
		if (!clipboard) return;
		const OFFSET = 1;
		if (clipboard.kind === "box") {
			const src = clipboard.data;
			const pos = clampToMap(
				src.x + OFFSET,
				src.y + OFFSET,
				src.width,
				src.height
			);
			const k = tmpKey("box");
			setBoxes((arr) => [
				...arr,
				{
					...src,
					key: k,
					id: undefined,
					x: pos.x,
					y: pos.y,
					width: pos.width,
					height: pos.height,
					occupants: [],
					status: "FREE",
					is_out_of_service: false,
				},
			]);
			setSelectedKey(k);
		} else if (clipboard.kind === "area") {
			const src = clipboard.data;
			const pos = clampToMap(
				src.x + OFFSET,
				src.y + OFFSET,
				src.width,
				src.height
			);
			const k = tmpKey("area");
			setAreas((arr) => [
				...arr,
				{
					...src,
					key: k,
					id: undefined,
					x: pos.x,
					y: pos.y,
					width: pos.width,
					height: pos.height,
				},
			]);
			setSelectedKey(k);
		} else {
			const src = clipboard.data;
			const pos = clampToMap(
				src.x + OFFSET,
				src.y + OFFSET,
				src.width,
				src.height
			);
			const k = tmpKey("el");
			setElements((arr) => [
				...arr,
				{
					...src,
					key: k,
					id: undefined,
					x: pos.x,
					y: pos.y,
					width: pos.width,
					height: pos.height,
				},
			]);
			setSelectedKey(k);
		}
	};

	// area che contiene il centro del box; la più piccola se annidate.
	// ritorna id reale o null (box fuori da ogni area). Se l'area contenitrice
	// è nuova (tmp, ancora senza id) mantiene l'area_id precedente del box.
	const areaIdForBox = (b: LBox): string | null => {
		const cx = b.x + b.width / 2;
		const cy = b.y + b.height / 2;
		let best: LArea | null = null;
		for (const a of areas) {
			if (
				cx >= a.x &&
				cx <= a.x + a.width &&
				cy >= a.y &&
				cy <= a.y + a.height
			) {
				if (!best || a.width * a.height < best.width * best.height)
					best = a;
			}
		}
		if (!best) return null;
		if (isTmp(best.key)) return b.area_id ?? null;
		return best.id ?? null;
	};

	const onSave = async () => {
		if (!mapId) return;
		// persist map dims first if changed
		if (
			dims.width !== savedDims.current.width ||
			dims.height !== savedDims.current.height
		) {
			const upd = await updateMap({
				variables: {
					id: mapId,
					data: { width: dims.width, height: dims.height },
				},
			});
			if (!upd.data?.updateShelterMap?.success) {
				toast.error(
					upd.data?.updateShelterMap?.error?.message ??
						t("messages.errors.fetch")
				);
				return;
			}
		}
		const res = await saveLayout({
			variables: {
				map_id: mapId,
				data: {
					areas: areas.map((a) => ({
						id: isTmp(a.key) ? undefined : a.id,
						name: a.name,
						area_type: a.area_type,
						x: a.x,
						y: a.y,
						width: a.width,
						height: a.height,
						color: a.color,
					})),
					boxes: boxes.map((b) => ({
						id: isTmp(b.key) ? undefined : b.id,
						// ricalcolo l'area dalla posizione: sempre inviato (id o null)
						// così spostando un box tra/fuori aree si aggiorna a DB
						area_id: areaIdForBox(b),
						label: b.label,
						x: b.x,
						y: b.y,
						width: b.width,
						height: b.height,
						rotation: b.rotation,
						capacity: b.capacity,
					})),
					elements: elements.map((e) => ({
						id: isTmp(e.key) ? undefined : e.id,
						element_type: e.element_type,
						x: e.x,
						y: e.y,
						width: e.width,
						height: e.height,
						rotation: e.rotation,
						color: e.color,
						label: e.label,
					})),
					deleted_area_ids: deleted.current.areas,
					deleted_box_ids: deleted.current.boxes,
					deleted_element_ids: deleted.current.elements,
				},
			},
		});
		const m = res.data?.saveShelterMapLayout?.map;
		if (!res.data?.saveShelterMapLayout?.success || !m) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		hydrate(m);
		setEditMode(false);
		setSelectedKey(null);
		toast.success(t("shelters.map.saved_ok"));
	};

	const refreshMap = () => mapId && loadMap({ variables: { id: mapId } });

	const doRelease = async (occId: string) => {
		const res = await releasePet({ variables: { occupancy_id: occId } });
		if (!res.data?.releasePetFromBox?.success) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.map.released_ok"));
		setAssignBoxKey(null);
		refreshMap();
	};

	// assegna in blocco i pet selezionati nella modale
	const doAssignMany = async (boxRealId: string, shelterPetIds: string[]) => {
		const results = await Promise.all(
			shelterPetIds.map((spId) =>
				assignPet({
					variables: { box_id: boxRealId, shelter_pet_id: spId },
				})
			)
		);
		const ok = results.every((r) => r.data?.assignPetToBox?.success);
		if (!ok) {
			toast.error(t("messages.errors.fetch"));
		} else {
			toast.success(t("shelters.map.assigned_ok"));
		}
		setAssignBoxKey(null);
		refreshMap();
	};

	// apre la modale di scelta pet per un box (view mode)
	const openAssignModal = (box: LBox) => {
		const remaining = box.capacity - box.occupants.length;
		const occupantIds = new Set(box.occupants.map((o) => o.shelterPetId));
		const pickable: PickablePet[] = shelterPets
			.filter((sp) => !occupantIds.has(sp.id))
			.map((sp) => ({
				id: sp.id,
				name: sp.pet?.name ?? "-",
				pictureId: sp.pet?.main_picture?.id,
				borderColor: sp.pet?.main_picture?.main_color?.color,
			}));
		const selection = { current: [] as string[] };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				if (!box.id || selection.current.length === 0) {
					closeModal();
					return;
				}
				await doAssignMany(box.id, selection.current);
				closeModal();
			},
			children: (
				<AssignPetsModal
					pets={pickable}
					max={remaining}
					onChange={(ids) => (selection.current = ids)}
				/>
			),
		});
	};

	// --- no map yet ---
	if (!mapsLoading && maps.length === 0 && !mapId) {
		// solo owner/manager può crearla; gli altri vedono solo un messaggio
		if (!canEdit) {
			return (
				<IonContent>
					<NoMap>{t("shelters.map.no_map")}</NoMap>
				</IonContent>
			);
		}
		return (
			<IonContent>
				<CreateMap
					loading={creating}
					onCreate={async (name, w, h) => {
						const res = await createMap({
							variables: {
								data: { shelter_id: id, name, width: w, height: h },
							},
						});
						const m = res.data?.createShelterMap?.map;
						if (!m) {
							toast.error(t("messages.errors.fetch"));
							return;
						}
						setMapId(m.id);
						initializedFor.current = m.id;
						hydrate(m);
					}}
				/>
			</IonContent>
		);
	}

	const selBox = boxes.find((b) => b.key === selectedKey);
	const selArea = areas.find((a) => a.key === selectedKey);
	const selEl = elements.find((e) => e.key === selectedKey);
	const assignBox = boxes.find((b) => b.key === assignBoxKey);

	return (
		<IonContent>
			<Bar>
				<Title>{fetchedMap?.name ?? t("shelters.tabs.map")}</Title>
				{canEdit && (
					<BarBtn
						className={editMode ? "on" : ""}
						onClick={() => {
							setEditMode((v) => !v);
							setSelectedKey(null);
						}}
					>
						<Icon name={editMode ? "eyeOutline" : "createOutline"} color="light" size="18px" />
						<span>{editMode ? t("shelters.map.view") : t("shelters.map.edit")}</span>
					</BarBtn>
				)}
			</Bar>

			{dims.width > 0 && (
				<MapCanvas
					mapWidth={dims.width}
					mapHeight={dims.height}
					shapes={shapes}
					selectedKey={selectedKey}
					editMode={editMode}
					onSelectShape={setSelectedKey}
					onResizeModeChange={(k) => {
						setResizeModeKey(k);
						setPropsPeekOpen(false);
					}}
					onTapBox={(k) => canAssign && setAssignBoxKey(k)}
					onDragShape={dragShape}
					onMoveShape={moveShape}
					onResizeShape={resizeShape}
					hasClipboard={!!clipboard}
					onCopy={onCopy}
					onCut={onCut}
					onPaste={onPaste}
				/>
			)}

			<Legend>
				<L $c={STATUS_FILL.FREE}>{t("shelters.map.free")}</L>
				<L $c={STATUS_FILL.OCCUPIED}>{t("shelters.map.occupied")}</L>
				<L $c={STATUS_FILL.FULL}>{t("shelters.map.full")}</L>
				<L $c={STATUS_FILL.OUT_OF_SERVICE}>{t("shelters.map.oos")}</L>
			</Legend>

			{editMode && (
				<EditDock>
					<Toolbar>
						<ToolBtn onClick={addBox}>
							<Icon name="cube" color="primary" size="22px" />
							<span>{t("shelters.map.add_box")}</span>
						</ToolBtn>
						<ToolBtn onClick={addArea}>
							<Icon name="square" color="primary" size="22px" />
							<span>{t("shelters.map.add_area")}</span>
						</ToolBtn>
						<ToolBtn onClick={addElement}>
							<Icon name="remove" color="primary" size="22px" />
							<span>{t("shelters.map.add_element")}</span>
						</ToolBtn>
						<ToolBtn
							className="primary"
							onClick={onSave}
							disabled={saving || updatingMap}
						>
							<Icon name="save" color="light" size="22px" />
							<span>{t("shelters.map.save")}</span>
						</ToolBtn>
					</Toolbar>
					<MapSettings>
						<Field>
							<label>{t("shelters.map.width")} (m)</label>
							<input
								type="number"
								min={1}
								step={0.5}
								value={Number(dims.width.toFixed(2))}
								onChange={(e) =>
									setDims((d) => ({
										...d,
										width: Math.max(1, parseFloat(e.target.value) || 1),
									}))
								}
							/>
						</Field>
						<Field>
							<label>{t("shelters.map.height")} (m)</label>
							<input
								type="number"
								min={1}
								step={0.5}
								value={Number(dims.height.toFixed(2))}
								onChange={(e) =>
									setDims((d) => ({
										...d,
										height: Math.max(1, parseFloat(e.target.value) || 1),
									}))
								}
							/>
						</Field>
					</MapSettings>
				</EditDock>
			)}
			{editMode && <DockSpacer />}

			{/* props sheet: in resize (long-press) resta a linguetta finché non lo apro */}
			{editMode &&
				selectedKey &&
				(selBox || selArea || selEl) &&
				resizeModeKey === selectedKey &&
				!propsPeekOpen && (
					<PropsPeek onClick={() => setPropsPeekOpen(true)}>
						<PeekGrip />
					</PropsPeek>
				)}

			{/* edit props sheet */}
			{editMode &&
				selectedKey &&
				(selBox || selArea || selEl) &&
				(resizeModeKey !== selectedKey || propsPeekOpen) && (
				<Sheet>
					<SheetHead>
						<b>{t("shelters.map.properties")}</b>
						{resizeModeKey === selectedKey ? (
							<Icon
								name="chevronDownOutline"
								color="medium"
								onClick={() => setPropsPeekOpen(false)}
							/>
						) : (
							<Icon name="close" color="medium" onClick={() => setSelectedKey(null)} />
						)}
					</SheetHead>
					{(selBox || selArea || selEl) && (
						<Row2>
							<Field>
								<label>{t("shelters.map.width")} (m)</label>
								<input
									type="number"
									min={1}
									step={0.5}
									value={Number(
										((selBox || selArea || selEl)!.width).toFixed(2)
									)}
									onChange={(e) =>
										updateSelectedSize({
											width: parseFloat(e.target.value) || 1,
										})
									}
								/>
							</Field>
							<Field>
								<label>{t("shelters.map.height")} (m)</label>
								<input
									type="number"
									min={1}
									step={0.5}
									value={Number(
										((selBox || selArea || selEl)!.height).toFixed(2)
									)}
									onChange={(e) =>
										updateSelectedSize({
											height: parseFloat(e.target.value) || 1,
										})
									}
								/>
							</Field>
						</Row2>
					)}
					{selBox && (
						<>
							<Field>
								<label>{t("shelters.map.label")}</label>
								<input
									value={selBox.label}
									onChange={(e) =>
										setBoxes((arr) =>
											arr.map((b) =>
												b.key === selBox.key
													? { ...b, label: e.target.value }
													: b
											)
										)
									}
								/>
							</Field>
							<Field>
								<label>{t("shelters.map.capacity")}</label>
								<input
									type="number"
									min={1}
									value={selBox.capacity}
									onChange={(e) =>
										setBoxes((arr) =>
											arr.map((b) =>
												b.key === selBox.key
													? {
															...b,
															capacity: Math.max(
																1,
																parseInt(e.target.value) || 1
															),
													  }
													: b
											)
										)
									}
								/>
							</Field>
						</>
					)}
					{selArea && (
						<>
							<Field>
								<label>{t("shelters.map.name")}</label>
								<input
									value={selArea.name}
									onChange={(e) =>
										setAreas((arr) =>
											arr.map((a) =>
												a.key === selArea.key
													? { ...a, name: e.target.value }
													: a
											)
										)
									}
								/>
							</Field>
							<Field>
								<label>{t("shelters.map.color")}</label>
								<input
									type="color"
									value={(selArea.color || "#4caf50").slice(0, 7)}
									onChange={(e) =>
										setAreas((arr) =>
											arr.map((a) =>
												a.key === selArea.key
													? { ...a, color: `${e.target.value}55` }
													: a
											)
										)
									}
								/>
							</Field>
						</>
					)}
					<DangerBtn onClick={deleteSelected}>
						<Icon name="trashOutline" color="light" size="18px" />
						<span>{t("actions.delete")}</span>
					</DangerBtn>
				</Sheet>
			)}

			{/* assignment sheet (view mode) */}
			{!editMode && assignBox && (
				<Sheet>
					<SheetHead>
						<b>{assignBox.label}</b>
						<Icon name="close" color="medium" onClick={() => setAssignBoxKey(null)} />
					</SheetHead>

					{assignBox.occupants.length > 0 && (
						<OccList>
							{assignBox.occupants.map((o) => (
								<OccRow key={o.occId}>
									<span>{o.name}</span>
									<SmallBtn $c="danger" onClick={() => doRelease(o.occId)}>
										{t("shelters.map.release")}
									</SmallBtn>
								</OccRow>
							))}
						</OccList>
					)}

					{isTmp(assignBox.key) ? (
						<Hint>{t("shelters.map.save_first")}</Hint>
					) : assignBox.occupants.length >= assignBox.capacity ? (
						<Hint>{t("shelters.map.box_full")}</Hint>
					) : (
						<AssignBtn onClick={() => openAssignModal(assignBox)}>
							<Icon name="add" color="light" />
							<span>{t("shelters.map.assign_pet")}</span>
						</AssignBtn>
					)}
				</Sheet>
			)}
		</IonContent>
	);
};

// --- create map form ---
const CreateMap: React.FC<{
	loading: boolean;
	onCreate: (name: string, w: number, h: number) => void;
}> = ({ loading, onCreate }) => {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [w, setW] = useState("20");
	const [h, setH] = useState("20");
	return (
		<CreateWrap>
			<Icon name="mapOutline" color="primary" size="48px" />
			<h3>{t("shelters.map.no_map")}</h3>
			<Field>
				<label>{t("shelters.map.name")}</label>
				<input value={name} onChange={(e) => setName(e.target.value)} />
			</Field>
			<Row2>
				<Field>
					<label>{t("shelters.map.width")} (m)</label>
					<input type="number" value={w} onChange={(e) => setW(e.target.value)} />
				</Field>
				<Field>
					<label>{t("shelters.map.height")} (m)</label>
					<input type="number" value={h} onChange={(e) => setH(e.target.value)} />
				</Field>
			</Row2>
			<CreateBtn
				disabled={loading || !name.trim()}
				onClick={() =>
					onCreate(name.trim(), parseFloat(w) || 20, parseFloat(h) || 20)
				}
			>
				{t("shelters.map.create")}
			</CreateBtn>
		</CreateWrap>
	);
};

const Bar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(1.5)} 12px ${$uw(1)};
`;
const Title = styled.h2`
	margin: 0;
	font-size: 1.4rem;
	color: ${$color("primary")};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
const BarBtn = styled.button`
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.75)} ${$uw(1.25)};
	min-height: 44px;
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.3rem;
	font-weight: 700;
	cursor: pointer;
	&.on {
		background: ${$color("warning")};
	}
`;
const Legend = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(1.5)};
	padding: ${$uw(1)} 12px;
`;
const L = styled.span<{ $c: string }>`
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
	font-size: 1.2rem;
	color: ${$color("medium")};
	&::before {
		content: "";
		width: 12px;
		height: 12px;
		border-radius: 3px;
		background: ${({ $c }) => $c};
	}
`;
const Toolbar = styled.div`
	display: flex;
	gap: ${$uw(0.75)};
	padding: ${$uw(1)} 12px;
`;
const MapSettings = styled.div`
	display: flex;
	gap: ${$uw(0.75)};
	padding: 0 12px ${$uw(1)};
	justify-content: space-between;
	> div {
		width: 45%;
	}
`;
const EditDock = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: ${$uw(6)};
	z-index: 40;
	max-width: var(--max-width);
	margin: 0 auto;
	background: ${$color("background")};
	border-top: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
`;
const DockSpacer = styled.div`
	height: ${$uw(20)};
`;
const ToolBtn = styled.button`
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.25)};
	min-height: 56px;
	padding: ${$uw(0.75)} ${$uw(0.5)};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	border-radius: 12px;
	background: ${$color("background")};
	color: ${$color("primary")};
	font-size: 1.1rem;
	font-weight: 700;
	cursor: pointer;
	&.primary {
		background: ${$color("primary")};
		color: ${$color("light")};
		border-color: ${$color("primary")};
	}
	&:disabled {
		opacity: 0.5;
	}
`;
const Sheet = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
	max-width: var(--max-width);
	margin: 0 auto;
	background: ${$color("background")};
	border-radius: 18px 18px 0 0;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
	padding: ${$uw(1.5)} ${$uw(1.5)} ${$uw(7)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
	max-height: 60vh;
	overflow-y: auto;
`;
const PropsPeek = styled.button`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
	max-width: var(--max-width);
	margin: 0 auto;
	width: 100%;
	border: none;
	background: ${$color("background")};
	border-radius: 18px 18px 0 0;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
	padding: ${$uw(0.75)} 0 ${$uw(1)};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`;
const PeekGrip = styled.span`
	width: ${$uw(6)};
	height: 5px;
	border-radius: 999px;
	background: ${$color("medium")};
	opacity: 0.6;
`;
const SheetHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	> b {
		font-size: 1.3rem;
	}
	> .icon-wrapper {
		width: ${$uw(2.5)};
		height: ${$uw(2.5)};
	}
`;
const SheetSub = styled.span`
	font-size: 1.3rem;
	font-weight: 700;
	color: ${$color("medium")};
`;
const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
	> label {
		font-size: 1.3rem;
		font-weight: 600;
		color: ${$color("medium")};
	}
	> input {
		min-height: 44px;
		padding: 0 ${$uw(1)};
		border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
		border-radius: 10px;
		background: ${$color("background")};
		color: ${$color("dark")};
		font-size: 1.6rem;
	}
`;
const Row2 = styled.div`
	display: flex;
	gap: ${$uw(1)};
	justify-content: space-between;
	> div {
		width: 45%;
	}
`;
const DangerBtn = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.5)};
	min-height: 44px;
	border: none;
	border-radius: 10px;
	background: ${$color("danger")};
	color: ${$color("light")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
`;
const OccList = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
`;
const OccRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 10px;
	background: rgba(var(--ion-color-primary-rgb), 0.08);
	> span {
		font-size: 1.5rem;
		font-weight: 600;
	}
`;
const SmallBtn = styled.button<{ $c: string }>`
	min-height: 36px;
	padding: 0 ${$uw(1)};
	border: none;
	border-radius: 999px;
	background: ${({ $c }) => $color($c)};
	color: ${$color("light")};
	font-size: 1.2rem;
	font-weight: 700;
	cursor: pointer;
`;
const AssignBtn = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.75)};
	width: 100%;
	min-height: 44px;
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.5rem;
	font-weight: 700;
	cursor: pointer;
	transition: transform 0.15s ease;
	> .icon {
		width: ${$uw(1.75)};
		height: ${$uw(1.75)};
	}
	&:active {
		transform: scale(0.98);
	}
`;
const Hint = styled.p`
	margin: 0;
	font-size: 1.3rem;
	color: ${$color("medium")};
	text-align: center;
`;
const NoMap = styled.div`
	width: 100%;
	padding: ${$uw(6)} ${$uw(2)};
	box-sizing: border-box;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.7rem;
`;
const CreateWrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(2)};
	align-items: stretch;
	padding: ${$uw(5)} ${$uw(2)};
	> h3 {
		margin: 0;
		text-align: center;
		color: ${$color("primary")};
	}
	> .icon-wrapper {
		align-self: center;
	}
`;
const CreateBtn = styled.button`
	min-height: 48px;
	border: none;
	border-radius: 12px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.6rem;
	font-weight: 700;
	cursor: pointer;
	&:disabled {
		opacity: 0.5;
	}
`;
