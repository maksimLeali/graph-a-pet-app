import { useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Image2x, Icon } from "@components";
import { FundingNeedStatus } from "@types";
import { $color, $uw } from "@theme";

import { useGetPublicDonationAvailabilityQuery } from "../../../donations/operations/__generated__/getPublicDonationAvailability.generated";
import { useListFundingNeedsQuery } from "../../../donations/operations/__generated__/listFundingNeeds.generated";
import { useDonateFlow, CURRENCY } from "../../../donations/hooks/useDonateFlow";
import { formatCents } from "../../../donations/utils/formatCurrency";
import { needUrgency } from "../../hooks/useShelterAnimalStatuses";

const COLLAPSED_COUNT = 2;

type PetLookup = Map<string, { name: string; pictureId?: string }>;

type Props = {
	shelterId: string;
	canReadNeeds: boolean;
	petsById: PetLookup;
};

export const DonationsSection: React.FC<Props> = ({
	shelterId,
	canReadNeeds,
	petsById,
}) => {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);

	const { data: availData, refetch: refetchAvail } =
		useGetPublicDonationAvailabilityQuery({
			skip: !shelterId,
			fetchPolicy: "cache-and-network",
			variables: { shelter_id: shelterId },
		});
	const available =
		!!availData?.getPublicDonationAvailability?.availability?.available;

	const { data: needsData, refetch: refetchNeeds } = useListFundingNeedsQuery({
		skip: !shelterId || !canReadNeeds,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId, status: FundingNeedStatus.Active },
	});

	const needs = (needsData?.listFundingNeeds?.items ?? []).filter(
		(n): n is NonNullable<typeof n> => !!n
	);

	// il backend non ha un goal mensile di rifugio: la progress bar usa il
	// funding need attivo shelter-level (pet_id null), se presente
	const shelterNeed = needs.find((n) => !n.pet_id);
	const progress = useMemo(() => {
		if (!shelterNeed || shelterNeed.target_amount_cents <= 0) return null;
		const pct = Math.min(
			Math.round(
				(shelterNeed.collected_amount_cents /
					shelterNeed.target_amount_cents) *
					100
			),
			100
		);
		return { pct };
	}, [shelterNeed]);

	const petNeeds = useMemo(
		() =>
			needs
				.filter((n) => !!n.pet_id && petsById.has(n.pet_id as string))
				.sort((a, b) => {
					const ua = needUrgency(a.category) === "danger" ? 0 : 1;
					const ub = needUrgency(b.category) === "danger" ? 0 : 1;
					return ua - ub;
				}),
		[needs, petsById]
	);
	const shownNeeds = expanded ? petNeeds : petNeeds.slice(0, COLLAPSED_COUNT);

	const { donate: donateShelter, creating } = useDonateFlow({
		shelterId,
		fundingNeedId: shelterNeed?.id,
		onSettled: () => {
			refetchAvail();
			refetchNeeds();
		},
	});

	if (!available && petNeeds.length === 0) return null;

	return (
		<Section>
			<LabelRow>
				<Label>{t("shelters.overview.donations")}</Label>
				{petNeeds.length > COLLAPSED_COUNT && (
					<ViewAll type="button" onClick={() => setExpanded((v) => !v)}>
						{expanded
							? t("shelters.overview.view_less")
							: t("shelters.overview.view_all")}
					</ViewAll>
				)}
			</LabelRow>

			{available && (
				<MainCard
					type="button"
					disabled={creating}
					onClick={() => donateShelter()}
				>
					<MainHead>
						<HeartBadge>
							<Icon name="heart" color="primary-contrast" size="16px" />
						</HeartBadge>
						<MainTitle>
							{t("shelters.overview.support_title")}
						</MainTitle>
						{progress && <Percent>{progress.pct}%</Percent>}
					</MainHead>
					{progress && shelterNeed && (
						<>
							<Track
								role="progressbar"
								aria-valuenow={progress.pct}
								aria-valuemin={0}
								aria-valuemax={100}
							>
								<Fill
									style={{
										transform: `scaleX(${progress.pct / 100})`,
									}}
								/>
							</Track>
							<RaisedText>
								{t("shelters.overview.raised_of_goal", {
									raised: formatCents(
										shelterNeed.collected_amount_cents,
										shelterNeed.currency ?? CURRENCY
									),
									goal: formatCents(
										shelterNeed.target_amount_cents,
										shelterNeed.currency ?? CURRENCY
									),
								})}
							</RaisedText>
						</>
					)}
					{!progress && (
						<RaisedText>
							{t("donations.shelter_cta_subtitle")}
						</RaisedText>
					)}
				</MainCard>
			)}

			{shownNeeds.length > 0 && (
				<NeedsGrid>
					{shownNeeds.map((need) => (
						<DogNeedCard
							key={need.id}
							shelterId={shelterId}
							needId={need.id}
							petId={need.pet_id as string}
							pet={petsById.get(need.pet_id as string)!}
							category={need.category}
							onSettled={() => refetchNeeds()}
						/>
					))}
				</NeedsGrid>
			)}
		</Section>
	);
};

type dogNeedProps = {
	shelterId: string;
	needId: string;
	petId: string;
	pet: { name: string; pictureId?: string };
	category?: string | null;
	onSettled: () => void;
};

const DogNeedCard: React.FC<dogNeedProps> = ({
	shelterId,
	needId,
	petId,
	pet,
	category,
	onSettled,
}) => {
	const { t } = useTranslation();
	const urgency = needUrgency(category);
	const { donate, creating } = useDonateFlow({
		shelterId,
		petId,
		fundingNeedId: needId,
		onSettled,
	});

	return (
		<NeedCard>
			<NeedHead>
				<NeedPic>
					{pet.pictureId ? (
						<Image2x id={pet.pictureId} />
					) : (
						<Icon name="paw" color="medium" size="16px" />
					)}
				</NeedPic>
				<NeedTitles>
					<NeedName>{pet.name}</NeedName>
					<NeedLabel $tone={`status.${urgency}`}>
						{urgency === "danger"
							? t("shelters.overview.need_urgent")
							: t("shelters.overview.need_diet")}
					</NeedLabel>
				</NeedTitles>
			</NeedHead>
			<DonateButton
				type="button"
				className={urgency === "danger" ? "filled" : "outline"}
				disabled={creating}
				onClick={() => donate()}
			>
				{t("donations.cta")}
			</DonateButton>
		</NeedCard>
	);
};

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
`;

const LabelRow = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	margin-bottom: ${$uw(0.75)};
`;

const Label = styled.span`
	font-size: 1.2rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: ${$color("primary")};
`;

const ViewAll = styled.button`
	border: none;
	background: transparent;
	padding: 0;
	font-size: 1.3rem;
	font-weight: 700;
	color: ${$color("primary")};
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const MainCard = styled.button`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding: ${$uw(1.25)};
	border-radius: 16px;
	background: ${$color("donation.cardBg")};
	border: 1px solid ${$color("donation.cardBorder")};
	cursor: pointer;
	text-align: left;
	&:active {
		opacity: 0.8;
	}
	&:disabled {
		opacity: 0.6;
		pointer-events: none;
	}
`;

const MainHead = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
`;

const HeartBadge = styled.div`
	flex: 0 0 auto;
	width: ${$uw(2.25)};
	height: ${$uw(2.25)};
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
`;

const MainTitle = styled.b`
	flex: 1 1 auto;
	min-width: 0;
	font-size: 1.65rem;
	color: ${$color("dark")};
`;

const Percent = styled.b`
	flex: 0 0 auto;
	font-size: 1.65rem;
	color: ${$color("primary")};
`;

const Track = styled.div`
	width: 100%;
	height: ${$uw(0.6)};
	border-radius: 999px;
	overflow: hidden;
	background: rgba(var(--ion-color-primary-rgb), 0.18);
`;

const Fill = styled.div`
	width: 100%;
	height: 100%;
	transform-origin: left center;
	background: ${$color("primary")};
	transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const RaisedText = styled.span`
	font-size: 1.3rem;
	color: ${$color("dark")};
	opacity: 0.75;
`;

const NeedsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: ${$uw(0.75)};
	margin-top: ${$uw(0.75)};
`;

const NeedCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding: ${$uw(1)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
`;

const NeedHead = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.6)};
	min-width: 0;
`;

const NeedPic = styled.div`
	flex: 0 0 auto;
	width: ${$uw(2.25)};
	height: ${$uw(2.25)};
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	> .img2x {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const NeedTitles = styled.div`
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 1px;
`;

const NeedName = styled.b`
	font-size: 1.45rem;
	color: ${$color("dark")};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const NeedLabel = styled.span<{ $tone: string }>`
	font-size: 1.2rem;
	font-weight: 700;
	color: ${({ $tone }) => $color($tone)};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const DonateButton = styled.button`
	width: 100%;
	min-height: ${$uw(2.5)};
	border-radius: 10px;
	font-size: 1.45rem;
	font-weight: 700;
	cursor: pointer;
	&.filled {
		border: none;
		background: ${$color("primary")};
		color: ${$color("primary-contrast")};
	}
	&.outline {
		border: 1px solid ${$color("primary")};
		background: transparent;
		color: ${$color("primary")};
	}
	&:active {
		opacity: 0.7;
	}
	&:disabled {
		opacity: 0.6;
		pointer-events: none;
	}
`;
