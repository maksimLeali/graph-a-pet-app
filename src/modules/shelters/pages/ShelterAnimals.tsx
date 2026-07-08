import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, Image2x } from "@components";
import { $color, $uw } from "@theme";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapQuery } from "../operations/__generated__/getShelterMap.generated";
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";

export const ShelterAnimals: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage, useCustomColors } = useUserContext();
	const history = useHistory();

	useEffect(() => {
		setPage({ name: t("shelters.animals.title") });
	}, []);

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
	const allPets = (petsData?.listShelterPets?.items ?? []).filter(
		(p): p is NonNullable<typeof p> => !!p
	);

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

	const { data: mapData } = useGetShelterMapQuery({
		skip: !mapId,
		fetchPolicy: "cache-and-network",
		variables: { id: mapId as string },
	});

	const map = mapData?.getShelterMap?.map;
	const zones = (map?.zones ?? []).filter(Boolean);
	const areas = (map?.areas ?? []).filter(Boolean);
	const boxes = (map?.boxes ?? []).filter(Boolean);

	// pet assegnati a un box (per pet.id)
	const assignedPetIds = new Set<string>();
	boxes.forEach((b) =>
		(b.current_occupants ?? []).forEach((o) => {
			if (o?.pet?.id) assignedPetIds.add(o.pet.id);
		})
	);
	const toFix = allPets.filter((sp) => !assignedPetIds.has(sp.pet.id));

	// lookup immagine/colore per pet.id (i box hanno solo id+nome)
	const petByPetId = new Map(allPets.map((sp) => [sp.pet.id, sp]));

	const openPet = (shelterPetId: string) =>
		history.push(`/shelters/detail/${id}/pet/${shelterPetId}`);

	type Occupant = NonNullable<
		NonNullable<(typeof boxes)[number]["current_occupants"]>[number]
	>;

	const petRow = (
		shelterPetId: string,
		name: string,
		pictureId?: string | null,
		borderColor?: string | null,
		boxLabel?: string | null
	) => (
		<PetCard
			key={shelterPetId}
			role="button"
			tabIndex={0}
			onClick={() => openPet(shelterPetId)}
		>
			<Avatar
				$border={useCustomColors ? borderColor ?? undefined : undefined}
			>
				{pictureId ? (
					<Image2x lazy rounded id={pictureId} alt={name} />
				) : (
					<AvatarFallback>
						{(name?.[0] ?? "?").toUpperCase()}
					</AvatarFallback>
				)}
			</Avatar>
			<PetName>{name}</PetName>
			{boxLabel && <BoxTag>{boxLabel}</BoxTag>}
		</PetCard>
	);

	return (
		<IonContent>
			<Header>
				<h2>{t("shelters.animals.title")}</h2>
				<AddButton
					type="button"
					onClick={() => history.push(`/shelters/add-pet/${id}`)}
				>
					<Icon name="add" color="light" size="18px" />
					<span>{t("shelters.add_pet")}</span>
				</AddButton>
			</Header>

			<Groups>
				{toFix.length > 0 && (
					<Zone>
						<ZoneTitle $warn>
							{t("shelters.animals.to_fix")}
							<Count>{toFix.length}</Count>
						</ZoneTitle>
						<Grid>
							{toFix.map((sp) =>
								petRow(
									sp.id,
									sp.pet.name,
									sp.pet.main_picture?.id,
									sp.pet.main_picture?.main_color?.color
								)
							)}
						</Grid>
					</Zone>
				)}

				{zones.map((zone) => {
					const zoneAreas = areas.filter((a) => a.zone?.id === zone.id);
					const looseBoxes = boxes.filter(
						(b) => b.zone?.id === zone.id && !b.area?.id
					);
					const boxPets = (boxList: typeof boxes) =>
						boxList.flatMap((b) =>
							(b.current_occupants ?? [])
								.filter((o): o is Occupant => !!o?.pet)
								.map((o) => {
									const sp = petByPetId.get(o.pet!.id);
									return petRow(
										o.id,
										o.pet!.name,
										sp?.pet?.main_picture?.id,
										sp?.pet?.main_picture?.main_color?.color,
										b.label
									);
								})
						);
					return (
						<Zone key={zone.id}>
							<ZoneTitle>
								{zone.name || t("shelters.map.add_zone")}
							</ZoneTitle>
							{zoneAreas.map((area) => {
								const areaBoxes = boxes.filter(
									(b) => b.area?.id === area.id
								);
								const rows = boxPets(areaBoxes);
								return (
									<Area key={area.id}>
										<AreaTitle>
											{area.name || t("shelters.map.add_area")}
											<Count>{rows.length}</Count>
										</AreaTitle>
										{rows.length === 0 ? (
											<Empty>{t("shelters.no_pets")}</Empty>
										) : (
											<Grid>{rows}</Grid>
										)}
									</Area>
								);
							})}
							{looseBoxes.length > 0 && (
								<Area>
									<AreaTitle>
										{t("shelters.boxes.no_area")}
									</AreaTitle>
									<Grid>{boxPets(looseBoxes)}</Grid>
								</Area>
							)}
						</Zone>
					);
				})}
			</Groups>
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

const AddButton = styled.button`
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

const ZoneTitle = styled.h3<{ $warn?: boolean }>`
	margin: 0;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	color: ${({ $warn }) => ($warn ? $color("danger") : $color("primary"))};
	font-size: 1.7rem;
	border-bottom: 2px solid
		${({ $warn }) => ($warn ? $color("danger") : $color("primary"))};
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

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${$uw(1.5)};
`;

const PetCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.5)};
	cursor: pointer;
	transition: transform 0.15s ease;
	&:active {
		transform: scale(0.96);
	}
`;

const Avatar = styled.div<{ $border?: string }>`
	position: relative;
	width: 100%;
	aspect-ratio: 1/1;
	padding: 3px;
	box-sizing: border-box;
	border-radius: 999px;
	overflow: hidden;
	background: ${({ $border }) =>
		$border ? $color($border) : $color("primary")};
	> .img2x,
	> span {
		width: 100%;
		height: 100%;
		border-radius: 999px;
		overflow: hidden;
		display: block;
	}
`;

const AvatarFallback = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 2rem;
`;

const PetName = styled.span`
	font-size: 1.4rem;
	font-weight: 600;
	text-align: center;
	word-break: break-word;
	color: ${$color("dark")};
`;

const BoxTag = styled.span`
	font-size: 1.1rem;
	font-weight: 700;
	color: ${$color("light")};
	background: ${$color("primary")};
	border-radius: 999px;
	padding: 1px ${$uw(1)};
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Empty = styled.p`
	margin: 0;
	padding: ${$uw(0.5)} ${$uw(1.25)};
	color: ${$color("medium")};
	font-size: 1.4rem;
`;
