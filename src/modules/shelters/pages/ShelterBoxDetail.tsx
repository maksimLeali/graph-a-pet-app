import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon } from "@components";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";
import { AssignPetsModal, PickablePet } from "../components/AssignPetsModal";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapQuery } from "../operations/__generated__/getShelterMap.generated";
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";
import { useAssignPetToBoxMutation } from "../operations/__generated__/assignPetToBox.generated";
import { useReleasePetFromBoxMutation } from "../operations/__generated__/releasePetFromBox.generated";

const STATUS_COLOR: Record<string, string> = {
	AVAILABLE: "#ffb74d",
	OCCUPIED: "#81c784",
	FULL: "#2e7d32",
	NEEDS_CLEANING: "#ffd54f",
	OOS: "#9e9e9e",
};
const statusLabelKey: Record<string, I18NKey> = {
	AVAILABLE: "shelters.map.available",
	OCCUPIED: "shelters.map.occupied",
	FULL: "shelters.map.full",
	NEEDS_CLEANING: "shelters.map.needs_cleaning",
	OOS: "shelters.map.oos",
};

export const ShelterBoxDetail: React.FC = () => {
	const { id, boxId } = useParams<{ id: string; boxId: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const history = useHistory();

	const { data: mapsData } = useListShelterMapsQuery({
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
	const mapId = (mapsData?.listShelterMaps?.items ?? []).filter(Boolean)[0]?.id;

	const { data: mapData, refetch } = useGetShelterMapQuery({
		skip: !mapId,
		fetchPolicy: "cache-and-network",
		variables: { id: mapId as string },
	});

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

	const [assignPet] = useAssignPetToBoxMutation();
	const [releasePet] = useReleasePetFromBoxMutation();

	const map = mapData?.getShelterMap?.map;
	const boxes = (map?.boxes ?? []).filter(
		(b): b is NonNullable<typeof b> => !!b
	);
	const areas = (map?.areas ?? []).filter(
		(a): a is NonNullable<typeof a> => !!a
	);
	const current = boxes.find((b) => b.id === boxId);

	// area del box + box della stessa area (solo quelli)
	const currentArea = areas.find((a) => a.id === current?.area?.id);
	const areaBoxes = current?.area?.id
		? boxes.filter((b) => b.area?.id === current.area?.id)
		: current
		? [current]
		: [];

	// viewBox: zoom sull'area (o sul box se senza area) con un po' di padding
	const bounds = currentArea
		? {
				x: currentArea.x,
				y: currentArea.y,
				w: currentArea.width,
				h: currentArea.height,
		  }
		: current
		? { x: current.x, y: current.y, w: current.width, h: current.height }
		: { x: 0, y: 0, w: map?.width ?? 100, h: map?.height ?? 100 };
	const pad = Math.max(bounds.w, bounds.h) * 0.08 || 4;
	const viewBox = `${bounds.x - pad} ${bounds.y - pad} ${bounds.w + pad * 2} ${
		bounds.h + pad * 2
	}`;

	const activeItems = (b: (typeof boxes)[number]) =>
		(b.occupancy_history?.items ?? []).filter((o) => o && !o.exited_at);

	const occupants = current
		? activeItems(current).map((o) => ({
				occId: o!.id,
				name: o!.shelter_pet?.pet?.name ?? "-",
		  }))
		: [];

	const capacity = current?.capacity ?? 0;
	const status = !current
		? "AVAILABLE"
		: current.is_out_of_service
		? "OOS"
		: occupants.length >= capacity
		? "FULL"
		: occupants.length > 0
		? "OCCUPIED"
		: "AVAILABLE";

	useEffect(() => {
		setPage({ name: current?.label || t("shelters.boxes.title") });
	}, [current?.label]);

	const askOpenMap = () => {
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: () => {
				closeModal();
				history.push(`/shelters/detail/${id}/map`);
			},
			children: <ModalMsg>{t("shelters.boxes.open_map_q")}</ModalMsg>,
		});
	};

	const doRelease = async (occId: string) => {
		const res = await releasePet({ variables: { occupancy_id: occId } });
		if (!res.data?.releasePetFromBox?.success) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.map.released_ok"));
		refetch();
	};

	const openAssign = () => {
		if (!current) return;
		const remaining = capacity - occupants.length;
		const assignedIds = new Set<string>();
		boxes.forEach((b) =>
			activeItems(b).forEach((o) => {
				if (o?.shelter_pet?.id) assignedIds.add(o.shelter_pet.id);
			})
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
				if (selection.current.length === 0) {
					closeModal();
					return;
				}
				const results = await Promise.all(
					selection.current.map((spId) =>
						assignPet({
							variables: {
								box_id: current.id,
								shelter_pet_id: spId,
							},
						})
					)
				);
				const ok = results.every(
					(r) => r.data?.assignPetToBox?.success
				);
				toast[ok ? "success" : "error"](
					ok
						? t("shelters.map.assigned_ok")
						: t("messages.errors.fetch")
				);
				closeModal();
				refetch();
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

	if (!current) {
		return (
			<IonContent>
				<Empty>{t("shelters.boxes.empty")}</Empty>
			</IonContent>
		);
	}

	return (
		<IonContent>
			<Canvas role="button" tabIndex={0} onClick={askOpenMap}>
				<svg
					viewBox={viewBox}
					width="100%"
					preserveAspectRatio="xMidYMid meet"
				>
					{currentArea && (
						<rect
							x={currentArea.x}
							y={currentArea.y}
							width={currentArea.width}
							height={currentArea.height}
							fill="#eef1f4"
							stroke="rgba(0,0,0,0.2)"
							strokeWidth={pad * 0.15}
						/>
					)}
					{areaBoxes.map((b) => {
						const cx = b.x + b.width / 2;
						const cy = b.y + b.height / 2;
						const isCur = b.id === current.id;
						return (
							<rect
								key={b.id}
								x={b.x}
								y={b.y}
								width={b.width}
								height={b.height}
								rx={2}
								fill={isCur ? STATUS_COLOR[status] : "#cfd4da"}
								stroke={isCur ? "#111" : "#b0b6bd"}
								strokeWidth={isCur ? pad * 0.25 : pad * 0.12}
								transform={
									b.rotation
										? `rotate(${b.rotation} ${cx} ${cy})`
										: undefined
								}
							/>
						);
					})}
				</svg>
			</Canvas>

			<Info>
				<Row>
					<h2>{current.label || "—"}</h2>
					<StatusChip $c={STATUS_COLOR[status]}>
						{t(statusLabelKey[status])}
					</StatusChip>
				</Row>
				<Sub>
					{occupants.length}/{capacity}
					{currentArea?.name && (
						<AreaName> · {currentArea.name}</AreaName>
					)}
				</Sub>
			</Info>

			<Section>
				<SectionTitle>
					{t("shelters.map.assign_pet")}
					{!current.is_out_of_service &&
						occupants.length < capacity && (
							<AssignButton type="button" onClick={openAssign}>
								<Icon name="add" color="light" size="16px" />
								<span>{t("shelters.map.assign_pet")}</span>
							</AssignButton>
						)}
				</SectionTitle>
				{occupants.length === 0 ? (
					<Empty>{t("shelters.no_pets")}</Empty>
				) : (
					<List>
						{occupants.map((o) => (
							<OccRow key={o.occId}>
								<OccName>{o.name}</OccName>
								<ReleaseBtn
									type="button"
									onClick={() => doRelease(o.occId)}
								>
									{t("shelters.map.release")}
								</ReleaseBtn>
							</OccRow>
						))}
					</List>
				)}
			</Section>
		</IonContent>
	);
};

const ModalMsg = styled.p`
	margin: 0;
	padding: ${$uw(2)} ${$uw(2)} 0;
	text-align: center;
	font-size: 1.6rem;
	color: ${$color("dark")};
`;

const Canvas = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(2)} 12px 0;
	cursor: pointer;
	> svg {
		width: 100%;
		max-height: 200px;
		display: block;
		border-radius: 12px;
	}
`;

const Info = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const StatusChip = styled.span<{ $c: string }>`
	font-size: 1.3rem;
	font-weight: 700;
	color: #fff;
	background: ${({ $c }) => $c};
	border-radius: 999px;
	padding: 2px ${$uw(1.25)};
`;

const Sub = styled.span`
	font-size: 1.5rem;
	font-weight: 700;
	color: ${$color("medium")};
`;

const AreaName = styled.span`
	font-weight: 600;
	color: ${$color("primary")};
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(2.5)} 12px 0;
`;

const SectionTitle = styled.h3`
	margin: 0 0 ${$uw(1.5)};
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	color: ${$color("dark")};
	font-size: 1.6rem;
`;

const AssignButton = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	border: none;
	border-radius: 999px;
	padding: ${$uw(0.75)} ${$uw(1.25)};
	background: ${$color("primary")};
	color: ${$color("light")};
	cursor: pointer;
	> span {
		font-size: 1.3rem;
		font-weight: 600;
	}
`;

const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const OccRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.25)};
	border-radius: 12px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const OccName = styled.span`
	font-size: 1.5rem;
	font-weight: 600;
	color: ${$color("dark")};
`;

const ReleaseBtn = styled.button`
	border: none;
	border-radius: 999px;
	padding: ${$uw(0.5)} ${$uw(1.25)};
	background: ${$color("danger")};
	color: ${$color("light")};
	font-size: 1.3rem;
	font-weight: 600;
	cursor: pointer;
`;

const Empty = styled.p`
	margin: 0;
	padding: ${$uw(1.5)} 12px;
	color: ${$color("medium")};
	font-size: 1.4rem;
`;
