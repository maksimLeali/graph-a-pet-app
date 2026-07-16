import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon, PullToRefresh } from "@components";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapQuery } from "../operations/__generated__/getShelterMap.generated";

const STATUS_COLOR: Record<string, string> = {
	AVAILABLE: "#ffb74d",
	OCCUPIED: "#81c784",
	FULL: "#2e7d32",
	NEEDS_CLEANING: "#ffd54f",
	OOS: "#9e9e9e",
};

const statusOf = (box: {
	is_out_of_service?: boolean | null;
	capacity?: number | null;
	current_occupants?: unknown[] | null;
}) => {
	if (box.is_out_of_service) return "OOS";
	const occ = box.current_occupants?.length ?? 0;
	const cap = box.capacity ?? 1;
	if (occ <= 0) return "AVAILABLE";
	if (occ >= cap) return "FULL";
	return "OCCUPIED";
};

const statusLabelKey: Record<string, I18NKey> = {
	AVAILABLE: "shelters.map.available",
	OCCUPIED: "shelters.map.occupied",
	FULL: "shelters.map.full",
	NEEDS_CLEANING: "shelters.map.needs_cleaning",
	OOS: "shelters.map.oos",
};

export const ShelterBoxes: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const history = useHistory();
	const [q, setQ] = useState("");

	useEffect(() => {
		setPage({ name: t("shelters.boxes.title") });
	}, []);

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

	const { data: mapData, loading } = useGetShelterMapQuery({
		skip: !mapId,
		fetchPolicy: "cache-and-network",
		variables: { id: mapId as string },
	});

	const map = mapData?.getShelterMap?.map;
	const zones = (map?.zones ?? []).filter(Boolean);
	const areas = (map?.areas ?? []).filter(Boolean);
	const allBoxes = (map?.boxes ?? []).filter(Boolean);

	type Box = (typeof allBoxes)[number];

	// ricerca per nome box o nome cane dentro il box
	const needle = q.trim().toLowerCase();
	const boxMatches = (box: Box) => {
		if (!needle) return true;
		if ((box.label ?? "").toLowerCase().includes(needle)) return true;
		return (box.current_occupants ?? []).some((o) =>
			(o?.pet?.name ?? "").toLowerCase().includes(needle)
		);
	};
	const boxes = allBoxes.filter(boxMatches);

	const openOccupants = (box: Box) => {
		const pets = (box.current_occupants ?? []).filter((o) => o?.pet);
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			children: (
				<OccModal>
					<OccModalTitle>{box.label || "—"}</OccModalTitle>
					{pets.length === 0 ? (
						<Empty>{t("shelters.no_pets")}</Empty>
					) : (
						pets.map((o) => (
							<OccItem
								key={o!.id}
								role="button"
								tabIndex={0}
								onClick={() => {
									closeModal();
									history.push(
										`/shelters/detail/${id}/pet/${o!.id}`
									);
								}}
							>
								{o!.pet!.name}
							</OccItem>
						))
					)}
				</OccModal>
			),
		});
	};

	const renderBox = (box: Box) => {
		const st = statusOf(box);
		const occ = box.current_occupants?.length ?? 0;
		return (
			<BoxRow
				key={box.id}
				role="button"
				tabIndex={0}
				onClick={() =>
					history.push(`/shelters/detail/${id}/box/${box.id}`)
				}
			>
				<Dot $c={STATUS_COLOR[st]} />
				<BoxLabel>{box.label || "—"}</BoxLabel>
				<OccBtn
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						openOccupants(box);
					}}
				>
					{occ}/{box.capacity ?? 0}
				</OccBtn>
				<StatusTag>{t(statusLabelKey[st])}</StatusTag>
			</BoxRow>
		);
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2>{t("shelters.boxes.title")}</h2>
				<EditLink
					type="button"
					onClick={() => history.push(`/shelters/detail/${id}/map`)}
				>
					<Icon name="mapOutline" color="light" size="18px" />
					<span>{t("shelters.tabs.map")}</span>
				</EditLink>
			</Header>

			<SearchBar>
				<Icon name="search" color="medium" size="18px" />
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder={t("shelters.boxes.search") ?? ""}
				/>
			</SearchBar>

			{!loading && boxes.length === 0 ? (
				<Empty>{t("shelters.boxes.empty")}</Empty>
			) : (
				<Groups>
					{zones.map((zone) => {
						const zoneAreas = areas.filter(
							(a) => a.zone?.id === zone.id
						);
						const looseBoxes = boxes.filter(
							(b) => b.zone?.id === zone.id && !b.area?.id
						);
						const visibleAreas = zoneAreas.filter(
							(area) =>
								boxes.filter((b) => b.area?.id === area.id)
									.length > 0
						);
						// col filtro attivo, nascondi zone senza box
						if (
							needle &&
							visibleAreas.length === 0 &&
							looseBoxes.length === 0
						)
							return null;
						return (
							<Zone key={zone.id}>
								<ZoneTitle>
									{zone.name || t("shelters.map.add_zone")}
								</ZoneTitle>
								{(needle ? visibleAreas : zoneAreas).map((area) => {
									const areaBoxes = boxes.filter(
										(b) => b.area?.id === area.id
									);
									return (
										<Area key={area.id}>
											<AreaTitle>
												{area.name ||
													t("shelters.map.add_area")}
												<Count>{areaBoxes.length}</Count>
											</AreaTitle>
											{areaBoxes.length === 0 ? (
												<Empty>
													{t("shelters.boxes.no_box")}
												</Empty>
											) : (
												areaBoxes.map(renderBox)
											)}
										</Area>
									);
								})}
								{looseBoxes.length > 0 && (
									<Area>
										<AreaTitle>
											{t("shelters.boxes.no_area")}
											<Count>{looseBoxes.length}</Count>
										</AreaTitle>
										{looseBoxes.map(renderBox)}
									</Area>
								)}
							</Zone>
						);
					})}

					{(() => {
						const orphans = boxes.filter((b) => !b.zone?.id);
						if (orphans.length === 0) return null;
						return (
							<Zone>
								<ZoneTitle>
									{t("shelters.boxes.no_zone")}
								</ZoneTitle>
								<Area>{orphans.map(renderBox)}</Area>
							</Zone>
						);
					})()}
				</Groups>
			)}
		</IonContent>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(3)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const EditLink = styled.button`
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
		font-size: 1.4rem;
		font-weight: 600;
	}
`;

const Groups = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(2.5)};
`;

const Zone = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const ZoneTitle = styled.h3`
	margin: 0;
	color: ${$color("primary")};
	font-size: 1.7rem;
	border-bottom: 2px solid ${$color("primary")};
	padding-bottom: ${$uw(0.5)};
`;

const Area = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding-left: ${$uw(1)};
`;

const AreaTitle = styled.h4`
	margin: ${$uw(0.5)} 0 0;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	color: ${$color("dark")};
	font-size: 1.5rem;
`;

const Count = styled.span`
	font-size: 1.3rem;
	font-weight: 700;
	color: ${$color("medium")};
`;

const BoxRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.25)};
	border-radius: 12px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: pointer;
	&:active {
		transform: scale(0.99);
	}
`;

const Dot = styled.span<{ $c: string }>`
	width: ${$uw(1.25)};
	height: ${$uw(1.25)};
	border-radius: 999px;
	flex: 0 0 auto;
	background: ${({ $c }) => $c};
`;

const BoxLabel = styled.span`
	flex: 1;
	font-size: 1.5rem;
	font-weight: 600;
	color: ${$color("dark")};
`;

const OccBtn = styled.button`
	border: 1px solid ${$color("primary")};
	background: transparent;
	border-radius: 999px;
	padding: 2px ${$uw(1)};
	font-size: 1.4rem;
	font-weight: 700;
	color: ${$color("primary")};
	cursor: pointer;
	&:active {
		background: rgba(var(--ion-color-primary-rgb), 0.1);
	}
`;

const SearchBar = styled.div`
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.5)};
	margin: 0 12px ${$uw(1)};
	width: calc(100% - 24px);
	border-radius: ${$uw(1)};
	background: ${$color("background")};
	> input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 1.5rem;
		color: ${$color("dark")};
	}
`;

const OccModal = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 ${$uw(2)} ${$uw(1)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const OccModalTitle = styled.b`
	font-size: 1.7rem;
	color: ${$color("primary")};
	margin-bottom: ${$uw(0.5)};
`;

const OccItem = styled.div`
	padding: ${$uw(1)} ${$uw(1.25)};
	border-radius: 12px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	font-size: 1.5rem;
	font-weight: 600;
	color: ${$color("dark")};
	cursor: pointer;
`;

const StatusTag = styled.span`
	font-size: 1.2rem;
	font-weight: 600;
	color: ${$color("medium")};
`;

const Empty = styled.p`
	margin: 0;
	padding: ${$uw(1)} ${$uw(1.25)};
	color: ${$color("medium")};
	font-size: 1.4rem;
`;
