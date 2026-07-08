import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { AreaType, MapElementType, RoleLevel, UserRole } from "@types";
import { MapCanvas, CanvasShape } from "../components/MapCanvas";
import { AssignPetsModal, PickablePet } from "../components/AssignPetsModal";
import { FindPetModal, LocatablePet } from "../components/FindPetModal";
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

type LZone = {
    key: string;
    id?: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string | null;
};
type LArea = {
    key: string;
    id?: string;
    zone_id?: string | null;
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
    zone_id?: string | null;
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
    FREE: "#ffb74d", // arancio chiaro — libero
    OCCUPIED: "#81c784", // verde chiaro — occupato
    FULL: "#2e7d32", // verde scuro — pieno
    OUT_OF_SERVICE: "#e53935", // rosso — fuori servizio
};

let tmpCounter = 0;
const tmpKey = (p: string) => `tmp_${p}_${Date.now()}_${tmpCounter++}`;
const isTmp = (k: string) => k.startsWith("tmp_");
// uuid client-side per zone nuove: usato sia come key sia come id, così box/area
// possono referenziarne lo zone_id nello stesso batch saveShelterMapLayout
const genId = (): string =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `zid_${Date.now()}_${tmpCounter++}_${Math.random().toString(36).slice(2)}`;

// naming per copia/incolla: se il nome finisce con un numero -> incrementa
// (saltando gli esistenti), altrimenti aggiunge " 1", " 2", ...
const nextName = (name: string, existing: string[]): string => {
    const set = new Set(existing);
    const m = name.match(/^(.*?)\s*(\d+)$/);
    const base = ((m ? m[1] : name).trim() || name.trim() || "1");
    let n = m ? parseInt(m[2], 10) + 1 : 1;
    let candidate = `${base} ${n}`;
    while (set.has(candidate)) {
        n++;
        candidate = `${base} ${n}`;
    }
    return candidate;
};

export const ShelterMapEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { t } = useTranslation();
    const { setPage, user } = useUserContext();

    const [mapId, setMapId] = useState<string | null>(null);
    const [zones, setZones] = useState<LZone[]>([]);
    const [areas, setAreas] = useState<LArea[]>([]);
    const [boxes, setBoxes] = useState<LBox[]>([]);
    const [elements, setElements] = useState<LElement[]>([]);
    const [dims, setDims] = useState({ width: 20, height: 20 });
    const savedDims = useRef({ width: 20, height: 20 });
    const deleted = useRef({
        zones: [] as string[],
        areas: [] as string[],
        boxes: [] as string[],
        elements: [] as string[],
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    // zona attiva: box/area nuovi ci finiscono dentro (vincolo zone_id NOT NULL)
    const [activeZoneKey, setActiveZoneKey] = useState<string | null>(null);
    // "seleziona tutto" (default ON): spostando zona/area muove anche i contenuti;
    // OFF → muove solo la singola entità selezionata
    const [selectAll, setSelectAll] = useState(true);
    // stato draft (modifiche non salvate, solo lato UI)
    const [dirty, setDirty] = useState(false);
    const snapshotRef = useRef("");
    const rebaselineRef = useRef(false);
    const [assignBoxKey, setAssignBoxKey] = useState<string | null>(null);
    // box da far lampeggiare quando localizzo un pet dalla ricerca
    const [pulseKey, setPulseKey] = useState<string | null>(null);
    const [pulsePicId, setPulsePicId] = useState<string | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const lastTapRef = useRef<{ key: string; time: number } | null>(null);
    // resize mode (long-press): il props sheet resta a linguetta finché non lo apro
    const [resizeModeKey, setResizeModeKey] = useState<string | null>(null);
    const [propsPeekOpen, setPropsPeekOpen] = useState(false);
    const [clipboard, setClipboard] = useState<
        | { kind: "box"; data: LBox }
        | { kind: "area"; data: LArea }
        | { kind: "zone"; data: LZone }
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
        (p): p is NonNullable<typeof p> => !!p,
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
        (r) => r?.user?.id === user.id,
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
            T extends { x: number; y: number; width: number; height: number },
        >(
            s: T,
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
        setZones((arr) => arr.map(clamp));
        setElements((arr) => arr.map(clamp));
    }, [dims.width, dims.height]);

    // pick first map
    const maps = (mapsData?.listShelterMaps?.items ?? []).filter(
        (m): m is NonNullable<typeof m> => !!m,
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
        setZones(
            (m.zones ?? []).map((z) => ({
                key: z.id,
                id: z.id,
                name: z.name,
                x: z.x,
                y: z.y,
                width: z.width,
                height: z.height,
                color: z.color,
            })),
        );
        setAreas(
            (m.areas ?? []).map((a) => ({
                key: a.id,
                id: a.id,
                zone_id: a.zone?.id ?? null,
                name: a.name,
                area_type: a.area_type,
                x: a.x,
                y: a.y,
                width: a.width,
                height: a.height,
                color: a.color,
            })),
        );
        setBoxes(
            (m.boxes ?? []).map((b) => ({
                key: b.id,
                id: b.id,
                zone_id: b.zone?.id ?? null,
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
            })),
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
            })),
        );
        deleted.current = { zones: [], areas: [], boxes: [], elements: [] };
        // prossimo passaggio dell'effetto dirty ricalcola la baseline (stato pulito)
        rebaselineRef.current = true;
    };

    // firma serializzata del layout: confronto con la baseline per stato dirty.
    // esclude campi volatili (status/occupanti); include tutto ciò che si salva.
    const serialize = () =>
        JSON.stringify({
            dims,
            del: deleted.current,
            zones: zones.map((z) => [
                z.id,
                z.name,
                z.x,
                z.y,
                z.width,
                z.height,
                z.color,
            ]),
            areas: areas.map((a) => [
                a.key,
                a.id,
                a.zone_id,
                a.name,
                a.area_type,
                a.x,
                a.y,
                a.width,
                a.height,
                a.color,
            ]),
            boxes: boxes.map((b) => [
                b.key,
                b.id,
                b.zone_id,
                b.area_id,
                b.label,
                b.x,
                b.y,
                b.width,
                b.height,
                b.rotation,
                b.capacity,
            ]),
            elements: elements.map((e) => [
                e.key,
                e.id,
                e.element_type,
                e.x,
                e.y,
                e.width,
                e.height,
                e.rotation,
                e.color,
                e.label,
            ]),
        });
    useEffect(() => {
        if (fetchedMap && initializedFor.current !== fetchedMap.id) {
            initializedFor.current = fetchedMap.id;
            hydrate(fetchedMap);
        }
    }, [fetchedMap]);

    // stato dirty: confronto la firma corrente con la baseline (post load/save).
    // il primo giro dopo hydrate ribasa senza segnare dirty (evita falsi positivi
    // dell'effetto di clamp che rigenera gli array senza cambi reali).
    useEffect(() => {
        const cur = serialize();
        if (rebaselineRef.current) {
            rebaselineRef.current = false;
            snapshotRef.current = cur;
            setDirty(false);
            return;
        }
        setDirty(cur !== snapshotRef.current);
    }, [zones, areas, boxes, elements, dims]);

    // blocco navigazione react-router mentre draft: modale di conferma custom.
    // block che ritorna false = transizione annullata senza confirm nativo.
    useEffect(() => {
        if (!dirty) return;
        const unblock = history.block((location) => {
            openModal({
                onClose: closeModal,
                onCancel: closeModal,
                onConfirm: () => {
                    closeModal();
                    unblock();
                    history.push(
                        `${location.pathname}${location.search}${location.hash}`,
                    );
                },
                children: (
                    <ConfirmLeave>
                        <h3>{t("shelters.map.unsaved_title")}</h3>
                        <p>{t("shelters.map.unsaved_msg")}</p>
                    </ConfirmLeave>
                ),
            });
            return false;
        });
        return () => unblock();
    }, [dirty, history]);

    // refresh/chiusura tab del browser mentre draft
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);


    const shapes = useMemo<CanvasShape[]>(() => {
        const out: CanvasShape[] = [];
        for (const z of zones)
            out.push({
                key: z.key,
                kind: "zone",
                x: z.x,
                y: z.y,
                width: Math.max(1, z.width),
                height: Math.max(1, z.height),
                fill: z.color || "rgba(63,81,181,0.08)",
                stroke:
                    z.key === activeZoneKey
                        ? "rgba(63,81,181,0.9)"
                        : "rgba(63,81,181,0.5)",
                strokeWidth: z.key === activeZoneKey ? 3 : 2,
                label: z.name,
                textColor: "rgba(40,53,147,0.75)",
            });
        for (const a of areas)
            out.push({
                key: a.key,
                kind: "area",
                x: a.x,
                y: a.y,
                width: Math.max(1, a.width),
                height: Math.max(1, a.height),
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
                width: Math.max(1, e.width),
                height: Math.max(1, e.height),
                rotation: e.rotation,
                fill: e.color || "#8d8d8d",
                stroke: "rgba(0,0,0,0.3)",
                strokeWidth: 1,
                label: e.label || undefined,
                textColor: "#fff",
            });
        for (const b of boxes) {
            const status = b.is_out_of_service
                ? "OUT_OF_SERVICE"
                : b.status || "FREE";
            out.push({
                key: b.key,
                kind: "box",
                x: b.x,
                y: b.y,
                width: Math.max(1, b.width),
                height: Math.max(1, b.height),
                rotation: b.rotation,
                fill: STATUS_FILL[status] || STATUS_FILL.FREE,
                stroke: "rgba(0,0,0,0.35)",
                strokeWidth: 1,
                label: b.label,
                sub:
                    b.capacity > 1
                        ? `${b.occupants.length}/${b.capacity}`
                        : undefined,
                textColor: "#1c1c1c",
            });
        }
        return out;
    }, [zones, areas, boxes, elements, activeZoneKey]);

    type RectShape = {
        key: string;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    const findShape = (key: string): RectShape | undefined =>
        boxes.find((b) => b.key === key) ||
        areas.find((a) => a.key === key) ||
        zones.find((z) => z.key === key) ||
        elements.find((e) => e.key === key);

    // il centro di s cade dentro il rettangolo r
    const centerIn = (s: RectShape, r: RectShape): boolean => {
        const cx = s.x + s.width / 2;
        const cy = s.y + s.height / 2;
        return (
            cx >= r.x && cx <= r.x + r.width && cy >= r.y && cy <= r.y + r.height
        );
    };

    // insieme di key da spostare insieme al primary. Con "seleziona tutto" (default
    // ON): zona → sé + aree/box contenuti; area → sé + box contenuti. OFF o
    // box/element → solo il primary.
    const keysToMove = (key: string): Set<string> => {
        if (!selectAll) return new Set([key]);
        const z = zones.find((s) => s.key === key);
        if (z) {
            const ks = new Set([key]);
            areas.forEach((a) => centerIn(a, z) && ks.add(a.key));
            boxes.forEach((b) => centerIn(b, z) && ks.add(b.key));
            return ks;
        }
        const a = areas.find((s) => s.key === key);
        if (a) {
            const ks = new Set([key]);
            boxes.forEach((b) => centerIn(b, a) && ks.add(b.key));
            return ks;
        }
        return new Set([key]);
    };

    // trasla tutte le key dell'insieme dello stesso delta (delta già clampato sul
    // primary, i figli seguono senza riclampare per non deformare il gruppo)
    const translateKeys = (keys: Set<string>, dx: number, dy: number) => {
        if (dx === 0 && dy === 0) return;
        const mv = <T extends RectShape>(arr: T[]) =>
            arr.map((s) =>
                keys.has(s.key) ? { ...s, x: s.x + dx, y: s.y + dy } : s,
            );
        setBoxes(mv);
        setAreas(mv);
        setZones(mv);
        setElements(mv);
    };

    const dragShape = (key: string, dx: number, dy: number) => {
        const primary = findShape(key);
        if (!primary) return;
        const np = clampToMap(
            primary.x + dx,
            primary.y + dy,
            primary.width,
            primary.height,
        );
        translateKeys(keysToMove(key), np.x - primary.x, np.y - primary.y);
    };

    const moveShape = (key: string, x: number, y: number) => {
        const primary = findShape(key);
        if (!primary) return;
        const np = clampToMap(x, y, primary.width, primary.height);
        translateKeys(keysToMove(key), np.x - primary.x, np.y - primary.y);
    };

    const resizeShape = (
        key: string,
        next: { x: number; y: number; width: number; height: number },
    ) => {
        // libero fino al save: nessun vincolo zona↔box in edit (solo il canvas)
        const clamped = clampToMap(next.x, next.y, next.width, next.height);
        const upd = <
            T extends {
                key: string;
                x: number;
                y: number;
                width: number;
                height: number;
            },
        >(
            arr: T[],
        ) => arr.map((s) => (s.key === key ? { ...s, ...clamped } : s));
        if (boxes.some((b) => b.key === key)) setBoxes(upd);
        else if (areas.some((a) => a.key === key)) setAreas(upd);
        else if (zones.some((z) => z.key === key)) setZones(upd);
        else setElements(upd);
    };

    const updateSelectedSize = (patch: { width?: number; height?: number }) => {
        if (!selectedKey) return;
        const apply = <
            T extends {
                key: string;
                x: number;
                y: number;
                width: number;
                height: number;
            },
        >(
            arr: T[],
        ) =>
            arr.map((s) => {
                if (s.key !== selectedKey) return s;
                const nw = Math.max(0, patch.width ?? s.width);
                const nh = Math.max(0, patch.height ?? s.height);
                // libero fino al save: nessun vincolo zona↔box in edit
                return { ...s, ...clampToMap(s.x, s.y, nw, nh, 0) };
            });
        if (boxes.some((b) => b.key === selectedKey)) setBoxes(apply);
        else if (areas.some((a) => a.key === selectedKey)) setAreas(apply);
        else if (zones.some((z) => z.key === selectedKey)) setZones(apply);
        else setElements(apply);
    };

    const clampToMap = (
        x: number,
        y: number,
        w: number,
        h: number,
        minSize = 1,
    ): { x: number; y: number; width: number; height: number } => {
        const nw = Math.max(minSize, Math.min(w, dims.width));
        const nh = Math.max(minSize, Math.min(h, dims.height));
        const nx = Math.max(0, Math.min(x, dims.width - nw));
        const ny = Math.max(0, Math.min(y, dims.height - nh));
        return { x: nx, y: ny, width: nw, height: nh };
    };

    // zona che contiene il centro del rettangolo; la più piccola se annidate
    const zoneAt = (
        x: number,
        y: number,
        w: number,
        h: number,
    ): LZone | null => {
        const cx = x + w / 2;
        const cy = y + h / 2;
        let best: LZone | null = null;
        for (const z of zones) {
            if (
                cx >= z.x &&
                cx <= z.x + z.width &&
                cy >= z.y &&
                cy <= z.y + z.height
            ) {
                if (!best || z.width * z.height < best.width * best.height)
                    best = z;
            }
        }
        return best;
    };

    // dimensioni minime mappa: deve contenere tutte le zone come predisposte
    const minMapDims = (): { width: number; height: number } => ({
        width: Math.max(1, ...zones.map((z) => z.x + z.width)),
        height: Math.max(1, ...zones.map((z) => z.y + z.height)),
    });

    // zona in cui inserire un nuovo box/area: attiva se valida, altrimenti
    // quella al centro mappa, altrimenti la prima. null se non ci sono zone.
    const targetZone = (): LZone | null => {
        const active = zones.find((z) => z.key === activeZoneKey);
        if (active) return active;
        return zoneAt(0, 0, dims.width, dims.height) ?? zones[0] ?? null;
    };

    const addZone = () => {
        const zid = genId();
        setZones((z) => [
            ...z,
            {
                key: zid,
                id: zid,
                name: nextName("Zona", z.map((x) => x.name)),
                x: dims.width / 2 - 8,
                y: dims.height / 2 - 8,
                width: 16,
                height: 16,
                color: "rgba(63,81,181,0.08)",
            },
        ]);
        setSelectedKey(zid);
        setActiveZoneKey(zid);
    };

    const addBox = () => {
        const z = targetZone();
        if (!z) {
            toast.error(t("shelters.map.need_zone"));
            return;
        }
        setActiveZoneKey(z.key);
        const k = tmpKey("box");
        const cx = z.x + z.width / 2 - 3;
        const cy = z.y + z.height / 2 - 3;
        setBoxes((b) => [
            ...b,
            {
                key: k,
                zone_id: z.id,
                label: nextName("Box", b.map((x) => x.label)),
                ...clampToMap(cx, cy, 6, 6),
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
        const z = targetZone();
        if (!z) {
            toast.error(t("shelters.map.need_zone"));
            return;
        }
        setActiveZoneKey(z.key);
        const k = tmpKey("area");
        const cx = z.x + z.width / 2 - 6;
        const cy = z.y + z.height / 2 - 6;
        setAreas((a) => [
            ...a,
            {
                key: k,
                zone_id: z.id,
                name: nextName("Area", a.map((x) => x.name)),
                area_type: AreaType.Kennel,
                ...clampToMap(cx, cy, 12, 12),
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
        const z = zones.find((x) => x.key === key);
        if (z) {
            // cancellando la zona spariscono anche box/aree contenuti (CASCADE lato
            // DB). Locale: rimuovo i figli per contenimento e ne accodo gli id reali.
            const childOf = (s: {
                x: number;
                y: number;
                width: number;
                height: number;
            }) => zoneAt(s.x, s.y, s.width, s.height)?.key === key;
            setBoxes((arr) =>
                arr.filter((b) => {
                    if (!childOf(b)) return true;
                    if (b.id && !isTmp(b.key))
                        deleted.current.boxes.push(b.id);
                    return false;
                }),
            );
            setAreas((arr) =>
                arr.filter((a) => {
                    if (!childOf(a)) return true;
                    if (a.id && !isTmp(a.key))
                        deleted.current.areas.push(a.id);
                    return false;
                }),
            );
            if (z.id) deleted.current.zones.push(z.id);
            setZones((arr) => arr.filter((x) => x.key !== key));
            if (activeZoneKey === key) setActiveZoneKey(null);
        }
        setSelectedKey(null);
    };

    const getSelected = ():
        | { kind: "box"; data: LBox }
        | { kind: "area"; data: LArea }
        | { kind: "zone"; data: LZone }
        | { kind: "element"; data: LElement }
        | null => {
        if (!selectedKey) return null;
        const b = boxes.find((x) => x.key === selectedKey);
        if (b) return { kind: "box", data: b };
        const a = areas.find((x) => x.key === selectedKey);
        if (a) return { kind: "area", data: a };
        const z = zones.find((x) => x.key === selectedKey);
        if (z) return { kind: "zone", data: z };
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
                src.height,
            );
            const k = tmpKey("box");
            // zone_id: se la copia cade in una zona usa quella, altrimenti eredita
            const zid = zoneIdForRect(pos, src.zone_id);
            setBoxes((arr) => [
                ...arr,
                {
                    ...src,
                    key: k,
                    id: undefined,
                    zone_id: zid,
                    label: nextName(
                        src.label,
                        arr.map((b) => b.label),
                    ),
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
                src.height,
            );
            const k = tmpKey("area");
            const zid = zoneIdForRect(pos, src.zone_id);
            setAreas((arr) => [
                ...arr,
                {
                    ...src,
                    key: k,
                    id: undefined,
                    zone_id: zid,
                    name: nextName(
                        src.name,
                        arr.map((a) => a.name),
                    ),
                    x: pos.x,
                    y: pos.y,
                    width: pos.width,
                    height: pos.height,
                },
            ]);
            setSelectedKey(k);
        } else if (clipboard.kind === "zone") {
            const src = clipboard.data;
            const pos = clampToMap(
                src.x + OFFSET,
                src.y + OFFSET,
                src.width,
                src.height,
            );
            const zid = genId();
            setZones((arr) => [
                ...arr,
                {
                    ...src,
                    key: zid,
                    id: zid,
                    name: nextName(
                        src.name,
                        arr.map((z) => z.name),
                    ),
                    x: pos.x,
                    y: pos.y,
                    width: pos.width,
                    height: pos.height,
                },
            ]);
            setSelectedKey(zid);
            setActiveZoneKey(zid);
        } else {
            const src = clipboard.data;
            const pos = clampToMap(
                src.x + OFFSET,
                src.y + OFFSET,
                src.width,
                src.height,
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

    // zone_id (NOT NULL) da geometria; fallback allo zone_id memorizzato
    // (zone hanno sempre id reale/client-uuid, nessun caso tmp da gestire)
    const zoneIdForRect = (
        s: { x: number; y: number; width: number; height: number },
        stored?: string | null,
    ): string | null => {
        const z = zoneAt(s.x, s.y, s.width, s.height);
        return z?.id ?? stored ?? null;
    };

    const handleSelectShape = (key: string | null) => {
        if (!key) {
            setSelectedKey(null);
            setSheetOpen(false);
            lastTapRef.current = null;
            return;
        }
        // selezionando una zona diventa la zona attiva (nuovi box/aree ci finiscono)
        if (zones.some((z) => z.key === key)) setActiveZoneKey(key);
        const now = Date.now();
        const last = lastTapRef.current;
        if (last && last.key === key && now - last.time < 350) {
            // double tap: open sheet
            setSelectedKey(key);
            setSheetOpen(true);
            lastTapRef.current = null;
        } else {
            // single tap: just select
            setSelectedKey(key);
            setSheetOpen(false);
            lastTapRef.current = { key, time: now };
        }
    };

    const onSave = async () => {
        if (!mapId) return;
        // zone_id NOT NULL: ricalcolo da geometria, poi verifico che nessun
        // box/area resti senza zona prima di inviare
        const boxZone = boxes.map((b) => ({
            b,
            zid: zoneIdForRect(b, b.zone_id),
        }));
        const areaZone = areas.map((a) => ({
            a,
            zid: zoneIdForRect(a, a.zone_id),
        }));
        if (
            boxZone.some((x) => !x.zid) ||
            areaZone.some((x) => !x.zid)
        ) {
            toast.error(t("shelters.map.need_zone"));
            return;
        }
        // normalizzazione al save (in edit tutto libero): ogni zona cresce per
        // contenere i box che le competono; la mappa cresce per contenere tutto.
        const grownZones = zones.map((z) => {
            const kids = boxZone
                .filter((x) => x.zid === z.id)
                .map((x) => x.b);
            if (kids.length === 0) return z;
            const minX = Math.min(z.x, ...kids.map((b) => b.x));
            const minY = Math.min(z.y, ...kids.map((b) => b.y));
            const maxX = Math.max(
                z.x + z.width,
                ...kids.map((b) => b.x + b.width),
            );
            const maxY = Math.max(
                z.y + z.height,
                ...kids.map((b) => b.y + b.height),
            );
            return {
                ...z,
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
            };
        });
        const right = (s: RectShape) => s.x + s.width;
        const bottom = (s: RectShape) => s.y + s.height;
        const allShapes: RectShape[] = [
            ...grownZones,
            ...areas,
            ...boxes,
            ...elements,
        ];
        const finalW = Math.max(dims.width, 1, ...allShapes.map(right));
        const finalH = Math.max(dims.height, 1, ...allShapes.map(bottom));
        // persist map dims first if changed
        if (
            finalW !== savedDims.current.width ||
            finalH !== savedDims.current.height
        ) {
            const upd = await updateMap({
                variables: {
                    id: mapId,
                    data: { width: finalW, height: finalH },
                },
            });
            if (!upd.data?.updateShelterMap?.success) {
                toast.error(
                    upd.data?.updateShelterMap?.error?.message ??
                        t("messages.errors.fetch"),
                );
                return;
            }
        }
        const res = await saveLayout({
            variables: {
                map_id: mapId,
                data: {
                    zones: grownZones.map((z) => ({
                        // id sempre inviato: il backend fa upsert (insert se nuovo)
                        id: z.id,
                        name: z.name,
                        x: z.x,
                        y: z.y,
                        width: z.width,
                        height: z.height,
                        color: z.color,
                    })),
                    areas: areaZone.map(({ a, zid }) => ({
                        id: isTmp(a.key) ? undefined : a.id,
                        zone_id: zid!,
                        name: a.name,
                        area_type: a.area_type,
                        x: a.x,
                        y: a.y,
                        width: a.width,
                        height: a.height,
                        color: a.color,
                    })),
                    boxes: boxZone.map(({ b, zid }) => ({
                        id: isTmp(b.key) ? undefined : b.id,
                        zone_id: zid!,
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
                    deleted_zone_ids: deleted.current.zones,
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

    // refetch + re-hydrate: l'effect di hydrate è guardato per id (non riscatta
    // sullo stesso map), quindi qui idrato a mano coi dati freschi (occupanti).
    const refreshMap = async () => {
        if (!mapId) return;
        const res = await loadMap({ variables: { id: mapId } });
        const m = res.data?.getShelterMap?.map;
        if (m) hydrate(m);
    };

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
                }),
            ),
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
        // pet già assegnati a QUALSIASI box: non devono comparire nella scelta
        const assignedIds = new Set(
            boxes.flatMap((b) => b.occupants.map((o) => o.shelterPetId)),
        );
        const pickable: PickablePet[] = shelterPets
            .filter((sp) => !assignedIds.has(sp.id))
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

    // apre la modale ricerca/localizzazione pet (view mode)
    const openFindModal = () => {
        // pet -> box in cui è tenuto (se assegnato)
        const petBox = new Map<string, { key: string; label: string }>();
        boxes.forEach((b) =>
            b.occupants.forEach((o) =>
                petBox.set(o.shelterPetId, {
                    key: b.key,
                    label: b.label ?? "",
                }),
            ),
        );
        const locatable: LocatablePet[] = shelterPets.map((sp) => {
            const bx = petBox.get(sp.id);
            return {
                id: sp.id,
                name: sp.pet?.name ?? "-",
                pictureId: sp.pet?.main_picture?.id,
                borderColor: sp.pet?.main_picture?.main_color?.color,
                boxKey: bx?.key ?? null,
                boxLabel: bx?.label ?? null,
            };
        });
        openModal({
            onClose: closeModal,
            onCancel: closeModal,
            children: (
                <FindPetModal
                    pets={locatable}
                    hideAlreadyInBox={false}
                    onPick={(p) => {
                        closeModal();
                        if (p.boxKey) {
                            setPulseKey(p.boxKey);
                            setPulsePicId(p.pictureId ?? null);
                            setTimeout(() => {
                                setPulseKey(null);
                                setPulsePicId(null);
                            }, 1600);
                        } else {
                            toast(t("shelters.map.pet_not_assigned"), {
                                icon: "⚠️",
                            });
                        }
                    }}
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
                                data: {
                                    shelter_id: id,
                                    name,
                                    width: w,
                                    height: h,
                                },
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
    const selZone = zones.find((z) => z.key === selectedKey);
    const selEl = elements.find((e) => e.key === selectedKey);
    const selAny = selBox || selArea || selZone || selEl;
    const assignBox = boxes.find((b) => b.key === assignBoxKey);

    return (
        <IonContent>
            <Bar>
                <Title>{fetchedMap?.name ?? t("shelters.tabs.map")}</Title>
                {dirty && <DraftChip>{t("shelters.map.draft")}</DraftChip>}
                {canEdit && (
                    <BarBtn
                        className={editMode ? "on" : ""}
                        onClick={() => {
                            setEditMode((v) => !v);
                            setSelectedKey(null);
                        }}
                    >
                        <Icon
                            name={editMode ? "eyeOutline" : "createOutline"}
                            color="light"
                            size="18px"
                        />
                        <span>
                            {editMode
                                ? t("shelters.map.view")
                                : t("shelters.map.edit")}
                        </span>
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
                    onSelectShape={handleSelectShape}
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
                    selectAll={selectAll}
                    onToggleSelectAll={() => setSelectAll((v) => !v)}
                    onFindPet={openFindModal}
                    pulseKey={pulseKey}
                    pulsePictureId={pulsePicId}
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
                        <ToolBtn onClick={addZone}>
                            <Icon name="grid" color="primary" size="22px" />
                            <span>{t("shelters.map.add_zone")}</span>
                        </ToolBtn>
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
                                key={`mw-${dims.width}`}
                                type="number"
                                step={0.5}
                                defaultValue={Number(dims.width.toFixed(2))}
                                onBlur={(e) =>
                                    setDims((d) => ({
                                        ...d,
                                        width: Math.max(
                                            minMapDims().width,
                                            parseFloat(e.target.value) || 1,
                                        ),
                                    }))
                                }
                            />
                        </Field>
                        <Field>
                            <label>{t("shelters.map.height")} (m)</label>
                            <input
                                key={`mh-${dims.height}`}
                                type="number"
                                step={0.5}
                                defaultValue={Number(dims.height.toFixed(2))}
                                onBlur={(e) =>
                                    setDims((d) => ({
                                        ...d,
                                        height: Math.max(
                                            minMapDims().height,
                                            parseFloat(e.target.value) || 1,
                                        ),
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
                selAny &&
                resizeModeKey === selectedKey &&
                !propsPeekOpen && (
                    <PropsPeek onClick={() => setPropsPeekOpen(true)}>
                        <PeekGrip />
                    </PropsPeek>
                )}

            {/* edit props sheet */}
            {editMode &&
                selectedKey &&
                selAny &&
                ((sheetOpen && resizeModeKey !== selectedKey) ||
                    propsPeekOpen) && (
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
                                <Icon
                                    name="close"
                                    color="medium"
                                    onClick={() => {
                                        setSelectedKey(null);
                                        setSheetOpen(false);
                                    }}
                                />
                            )}
                        </SheetHead>
                        {selAny && (
                            <Row2>
                                <Field>
                                    <label>{t("shelters.map.width")} (m)</label>
                                    <input
                                        key={`sw-${selectedKey}`}
                                        type="number"
                                        step={0.5}
                                        defaultValue={Number(
                                            selAny.width.toFixed(2),
                                        )}
                                        onBlur={(e) =>
                                            updateSelectedSize({
                                                width: Math.max(
                                                    1,
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 1,
                                                ),
                                            })
                                        }
                                    />
                                </Field>
                                <Field>
                                    <label>
                                        {t("shelters.map.height")} (m)
                                    </label>
                                    <input
                                        key={`sh-${selectedKey}`}
                                        type="number"
                                        step={0.5}
                                        defaultValue={Number(
                                            selAny.height.toFixed(2),
                                        )}
                                        onBlur={(e) =>
                                            updateSelectedSize({
                                                height: Math.max(
                                                    1,
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 1,
                                                ),
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
                                                        ? {
                                                              ...b,
                                                              label: e.target
                                                                  .value,
                                                          }
                                                        : b,
                                                ),
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
                                                              capacity:
                                                                  Math.max(
                                                                      1,
                                                                      parseInt(
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      ) || 1,
                                                                  ),
                                                          }
                                                        : b,
                                                ),
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
                                                        ? {
                                                              ...a,
                                                              name: e.target
                                                                  .value,
                                                          }
                                                        : a,
                                                ),
                                            )
                                        }
                                    />
                                </Field>
                                <Field>
                                    <label>{t("shelters.map.color")}</label>
                                    <input
                                        type="color"
                                        value={(
                                            selArea.color || "#4caf50"
                                        ).slice(0, 7)}
                                        onChange={(e) =>
                                            setAreas((arr) =>
                                                arr.map((a) =>
                                                    a.key === selArea.key
                                                        ? {
                                                              ...a,
                                                              color: `${e.target.value}55`,
                                                          }
                                                        : a,
                                                ),
                                            )
                                        }
                                    />
                                </Field>
                            </>
                        )}
                        {selZone && (
                            <>
                                <Field>
                                    <label>{t("shelters.map.zone_name")}</label>
                                    <input
                                        value={selZone.name}
                                        onChange={(e) =>
                                            setZones((arr) =>
                                                arr.map((z) =>
                                                    z.key === selZone.key
                                                        ? {
                                                              ...z,
                                                              name: e.target
                                                                  .value,
                                                          }
                                                        : z,
                                                ),
                                            )
                                        }
                                    />
                                </Field>
                                <Field>
                                    <label>{t("shelters.map.color")}</label>
                                    <input
                                        type="color"
                                        value={(() => {
                                            const c = selZone.color || "#3f51b5";
                                            return c.startsWith("#")
                                                ? c.slice(0, 7)
                                                : "#3f51b5";
                                        })()}
                                        onChange={(e) =>
                                            setZones((arr) =>
                                                arr.map((z) =>
                                                    z.key === selZone.key
                                                        ? {
                                                              ...z,
                                                              color: `${e.target.value}22`,
                                                          }
                                                        : z,
                                                ),
                                            )
                                        }
                                    />
                                </Field>
                            </>
                        )}
                        <DangerBtn onClick={deleteSelected}>
                            <Icon
                                name="trashOutline"
                                color="light"
                                size="18px"
                            />
                            <span>{t("actions.delete")}</span>
                        </DangerBtn>
                    </Sheet>
                )}

            {/* assignment sheet (view mode) */}
            {!editMode && assignBox && (
                <Sheet>
                    <SheetHead>
                        <b>{assignBox.label}</b>
                        <Icon
                            name="close"
                            color="medium"
                            onClick={() => setAssignBoxKey(null)}
                        />
                    </SheetHead>

                    {assignBox.occupants.length > 0 && (
                        <OccList>
                            {assignBox.occupants.map((o) => (
                                <OccRow key={o.occId}>
                                    <span>{o.name}</span>
                                    <SmallBtn
                                        $c="danger"
                                        onClick={() => doRelease(o.occId)}
                                    >
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
                    <input
                        type="number"
                        value={w}
                        onChange={(e) => setW(e.target.value)}
                    />
                </Field>
                <Field>
                    <label>{t("shelters.map.height")} (m)</label>
                    <input
                        type="number"
                        value={h}
                        onChange={(e) => setH(e.target.value)}
                    />
                </Field>
            </Row2>
            <CreateBtn
                disabled={loading || !name.trim()}
                onClick={() =>
                    onCreate(
                        name.trim(),
                        parseFloat(w) || 20,
                        parseFloat(h) || 20,
                    )
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
const DraftChip = styled.span`
    flex: 0 0 auto;
    margin-right: auto;
    padding: ${$uw(0.25)} ${$uw(0.9)};
    border-radius: 999px;
    background: ${$color("warning")};
    color: ${$color("light")};
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;
const ConfirmLeave = styled.div`
    padding: 0 ${$uw(2)} ${$uw(1)};
    > h3 {
        margin: 0 0 ${$uw(1)};
        color: ${$color("primary")};
        font-size: 1.6rem;
    }
    > p {
        margin: 0;
        color: ${$color("medium")};
        font-size: 1.4rem;
    }
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
