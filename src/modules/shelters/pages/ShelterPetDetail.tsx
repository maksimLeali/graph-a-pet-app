import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useLocation } from "react-router";
import dayjs from "dayjs";

import { IonContent } from "@ionic/react";
import { useUserContext } from "@contexts";
import { Icon, WalkRatingsSummaryCard } from "@components";
import { I18NKey } from "@i18n";
import { BoxStatus, WalkRatingType } from "@types";
import { $color, $uw } from "@theme";

import { PetDetailBody } from "../../pets/pages/PetProfile";
import {
	useGetFullPetLazyQuery,
	GetFullPetQuery,
} from "../../pets/operations/__generated__/getFullPet.generated";
import { useGetShelterPetLazyQuery } from "../operations/__generated__/getShelterPet.generated";
import {
	useGetCurrentBoxForPetLazyQuery,
	GetCurrentBoxForPetQuery,
} from "../operations/__generated__/getCurrentBoxForPet.generated";
import { useListShelterWalksQuery } from "../operations/__generated__/listShelterWalks.generated";
import { useGetLatestPetWeightQuery } from "../../pets/operations/__generated__/getLatestPetWeight.generated";

type WalkRatingAvg = { type: WalkRatingType; rating: number };

type FullPet = NonNullable<GetFullPetQuery["getPet"]["pet"]>;
type CurrentBox = NonNullable<
	GetCurrentBoxForPetQuery["getCurrentBoxForPet"]["box"]
>;

const STATUS_FILL: Record<string, string> = {
	AVAILABLE: "#2dd36f",
	NEEDS_CLEANING: "#4c8dff",
	OCCUPIED: "#ffc409",
	FULL: "#ff8a34",
	OUT_OF_SERVICE: "#92949c",
};

const STATUS_KEY: Record<BoxStatus, string> = {
	[BoxStatus.Available]: "shelters.map.available",
	[BoxStatus.NeedsCleaning]: "shelters.map.needs_cleaning",
	[BoxStatus.Occupied]: "shelters.map.occupied",
	[BoxStatus.Full]: "shelters.map.full",
	[BoxStatus.OutOfService]: "shelters.map.oos",
};

export const ShelterPetDetail: React.FC = () => {
	// id = shelter id, petId = shelter_pet id
	const { id, petId } = useParams<{ id: string; petId: string }>();
	const { setPage } = useUserContext();
	const { t } = useTranslation();
	const history = useHistory();
	const location = useLocation();

	const [pet, setPet] = useState<FullPet>();
	const [box, setBox] = useState<CurrentBox | null>(null);

	const [getFullPet, { loading }] = useGetFullPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getPet }) => {
			if (!getPet?.pet || getPet.error) return;
			setPet(getPet.pet);
		},
	});

	const [getShelterPet] = useGetShelterPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getShelterPet }) => {
			const sp = getShelterPet?.shelter_pet;
			if (!sp?.pet?.id) return;
			getFullPet({
				variables: {
					id: sp.pet.id,
					date_from: dayjs().startOf("day").toISOString(),
					date_to: dayjs().add(7, "day").endOf("day").toISOString(),
				},
			});
		},
	});

	const [getCurrentBox] = useGetCurrentBoxForPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getCurrentBoxForPet }) =>
			setBox(getCurrentBoxForPet?.box ?? null),
	});

	// media dei rating delle passeggiate del canile per questo shelter_pet
	// (stesso calcolo/UI del pet personale in PetProfile.tsx)
	const { data: walksData } = useListShelterWalksQuery({
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				filters: { fixed: [{ key: "shelter_pet_id", value: petId }] },
			},
		},
	});
	const walkRatings: WalkRatingAvg[] = (() => {
		const items = (walksData?.listShelterWalks?.items ?? []).filter(
			(w): w is NonNullable<typeof w> => !!w
		);
		const acc = new Map<WalkRatingType, { sum: number; count: number }>();
		for (const w of items) {
			for (const r of (w.ratings ?? []).filter(
				(r): r is NonNullable<typeof r> => !!r
			)) {
				const cur = acc.get(r.type) ?? { sum: 0, count: 0 };
				acc.set(r.type, { sum: cur.sum + r.rating, count: cur.count + 1 });
			}
		}
		return Object.values(WalkRatingType)
			.filter((type) => acc.has(type))
			.map((type) => {
				const { sum, count } = acc.get(type)!;
				return { type, rating: Math.round((sum / count) * 10) / 10 };
			});
	})();

	const { data: weightData } = useGetLatestPetWeightQuery({
		skip: !pet?.id,
		fetchPolicy: "cache-and-network",
		variables: { pet_id: pet?.id as string },
	});
	const latestWeight = weightData?.getLatestPetWeight?.weight;

	const load = () => {
		getShelterPet({ variables: { id: petId } });
		getCurrentBox({ variables: { shelter_pet_id: petId } });
	};

	useEffect(() => {
		setPage({ name: t("pages.shelters") });
	}, [petId]);

	// load su mount + a ogni navigazione (ritorno da mappa/evento): pattern location.key
	useEffect(() => {
		load();
	}, [petId, location.key]);

	const placement = (
		<Placement>
			<PlacementTitle>{t("shelters.placement.title")}</PlacementTitle>
			{box ? (
				<PlacementBody>
					<PlacementRow>
						<PlacementLabel>{t("shelters.placement.area")}</PlacementLabel>
						<PlacementValue>{box.area?.name ?? "—"}</PlacementValue>
					</PlacementRow>
					<PlacementRow>
						<PlacementLabel>{t("shelters.placement.box")}</PlacementLabel>
						<PlacementValue>{box.label}</PlacementValue>
					</PlacementRow>
					<PlacementRow>
						<PlacementLabel>
							{t("shelters.placement.status")}
						</PlacementLabel>
						<StatusChip $c={STATUS_FILL[box.status] ?? STATUS_FILL.FREE}>
							{t(STATUS_KEY[box.status] as I18NKey)}
						</StatusChip>
					</PlacementRow>
				</PlacementBody>
			) : (
				<PlacementEmpty>
					<span>{t("shelters.placement.not_placed")}</span>
				</PlacementEmpty>
			)}
			<MapButton
				type="button"
				onClick={() => history.push(`/shelters/detail/${id}/map`)}
			>
				<Icon name="mapOutline" color="primary" />
				<span>{t("shelters.placement.open_map")}</span>
			</MapButton>

			{walkRatings.length > 0 && (
				<RatingsBlock>
					<PlacementTitle>{t("events.walk")}</PlacementTitle>
					<WalkRatingsSummaryCard ratings={walkRatings} />
					<StatsLink
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${id}/pet/${petId}/walking-stats`)
						}
					>
						{t("stats.view_link")}
					</StatsLink>
				</RatingsBlock>
			)}

			<RatingsBlock>
				<PlacementTitle>{t("stats.weight")}</PlacementTitle>
				<PlacementRow>
					<PlacementLabel>{t("pets.weight")}</PlacementLabel>
					<PlacementValue>
						{latestWeight ? `${latestWeight.weight_kg} Kg` : "—"}
					</PlacementValue>
				</PlacementRow>
				<StatsLink
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${id}/pet/${petId}/weight-stats`)
					}
				>
					{t("stats.weight_view_link")}
				</StatsLink>
			</RatingsBlock>
		</Placement>
	);

	return (
		<IonContent>
			{pet ? (
				<PetDetailBody
					pet={pet}
					reload={load}
					onSaved={(p) =>
						setPet((prev) => (prev ? { ...prev, ...p } : prev))
					}
					topSection={placement}
					deleteRedirect={`/shelters/detail/${id}`}
				/>
			) : (
				<Loading className={loading ? "skeleton" : ""} />
			)}
		</IonContent>
	);
};

const Loading = styled.div`
	width: 100%;
	height: 40dvh;
`;

const Placement = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(3)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const PlacementTitle = styled.h3`
	margin: 0;
	font-size: 1.5rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	&::after {
		content: "";
		flex: 1;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(
			90deg,
			rgba(var(--ion-color-primary-rgb), 0.5),
			transparent
		);
	}
`;

const PlacementBody = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding: ${$uw(1.5)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const PlacementRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const PlacementLabel = styled.span`
	font-size: 1.4rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-weight: 600;
`;

const PlacementValue = styled.span`
	font-size: 1.8rem;
	font-weight: 700;
	word-break: break-word;
	text-align: right;
`;

const StatusChip = styled.span<{ $c: string }>`
	font-size: 1.4rem;
	font-weight: 700;
	color: #fff;
	padding: ${$uw(0.4)} ${$uw(1)};
	border-radius: 999px;
	background: ${({ $c }) => $c};
`;

const RatingsBlock = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const StatsLink = styled.button`
	width: 100%;
	margin-top: ${$uw(0.75)};
	padding: 0;
	border: none;
	background: none;
	text-align: center;
	color: ${$color("primary")};
	text-decoration: underline;
	font-size: 1.4rem;
	font-weight: 600;
	cursor: pointer;
`;

const PlacementEmpty = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px dashed rgba(var(--ion-color-medium-rgb), 0.5);
	color: ${$color("medium")};
	font-size: 1.6rem;
	text-align: center;
`;

const MapButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(1)};
	width: 100%;
	padding: ${$uw(1.25)};
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.4);
	color: ${$color("primary")};
	font-size: 1.6rem;
	font-weight: 700;
	cursor: pointer;
	transition: transform 0.15s ease;
	> .icon {
		width: ${$uw(2)};
		height: ${$uw(2)};
	}
	&:active {
		transform: scale(0.98);
	}
`;
