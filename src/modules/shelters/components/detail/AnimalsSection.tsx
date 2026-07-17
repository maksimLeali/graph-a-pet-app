import { useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { Image2x, Icon } from "@components";
import { Gender } from "@types";
import { $color, $uw } from "@theme";

import {
	AnimalRow,
	AnimalStatus,
} from "../../hooks/useShelterAnimalStatuses";

const PAGE_SIZE = 20;

type Filter = "all" | AnimalStatus;

type Props = {
	shelterId: string;
	animals: AnimalRow[];
	loading?: boolean;
};

const statusTone: Record<AnimalStatus, { text: string; bg: string }> = {
	care: { text: "status.danger", bg: "status.dangerBg" },
	walk: { text: "status.warning", bg: "status.warningBg" },
	ok: { text: "status.ok", bg: "status.okBg" },
};

export const AnimalsSection: React.FC<Props> = ({
	shelterId,
	animals,
	loading,
}) => {
	const { t } = useTranslation();
	const history = useHistory();
	const [filter, setFilter] = useState<Filter>("all");
	const [showFilters, setShowFilters] = useState(false);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	const filtered = useMemo(
		() =>
			filter === "all"
				? animals
				: animals.filter((a) => a.status === filter),
		[animals, filter]
	);
	const shown = filtered.slice(0, visibleCount);

	const statusLabel: Record<AnimalStatus, string> = {
		care: t("shelters.overview.status_care"),
		walk: t("shelters.overview.status_walk"),
		ok: t("shelters.overview.status_ok"),
	};

	const genderLabel = (g?: Gender | null) =>
		g === Gender.Male
			? t("pets.gender_male")
			: g === Gender.Female
				? t("pets.gender_female")
				: undefined;

	const meta = (a: AnimalRow) =>
		[
			a.boxLabel
				? t("shelters.overview.box_label", { code: a.boxLabel })
				: undefined,
			genderLabel(a.gender),
			a.years != null
				? t("shelters.overview.age", { count: a.years })
				: undefined,
		]
			.filter(Boolean)
			.join(" · ");

	return (
		<Section>
			<LabelRow>
				<Label>
					{t("shelters.overview.animals")}
					{!loading && <Dot>·</Dot>}
					{!loading && <Count>{filtered.length}</Count>}
				</Label>
				<FilterButton
					type="button"
					aria-label={t("shelters.overview.filter") ?? ""}
					onClick={() => setShowFilters((v) => !v)}
				>
					<Icon name="funnelOutline" color="primary" size="13px" />
					<span>{t("shelters.overview.filter")}</span>
				</FilterButton>
			</LabelRow>

			{showFilters && (
				<FilterChips>
					{(["all", "walk", "care", "ok"] as Filter[]).map((f) => (
						<FilterChip
							key={f}
							type="button"
							className={filter === f ? "active" : ""}
							onClick={() => {
								setFilter(f);
								setVisibleCount(PAGE_SIZE);
							}}
						>
							{f === "all"
								? t("shelters.overview.filter_all")
								: statusLabel[f]}
						</FilterChip>
					))}
				</FilterChips>
			)}

			{loading && animals.length === 0 ? (
				<Card>
					<SkeletonRow className="skeleton" />
					<SkeletonRow className="skeleton" />
					<SkeletonRow className="skeleton" />
				</Card>
			) : filtered.length === 0 ? (
				<Empty>{t("shelters.no_pets")}</Empty>
			) : (
				<Card>
					{shown.map((a) => (
						<Row
							key={a.shelterPetId}
							type="button"
							onClick={() =>
								history.push(
									`/shelters/detail/${shelterId}/pet/${a.shelterPetId}`
								)
							}
						>
							<Pic>
								{a.pictureId ? (
									<Image2x id={a.pictureId} />
								) : (
									<Icon name="paw" color="medium" size="18px" />
								)}
							</Pic>
							<Texts>
								<Name>{a.name}</Name>
								{meta(a) && <Meta>{meta(a)}</Meta>}
							</Texts>
							<StatusChip
								$text={statusTone[a.status].text}
								$bg={statusTone[a.status].bg}
							>
								{statusLabel[a.status]}
							</StatusChip>
						</Row>
					))}
				</Card>
			)}

			{filtered.length > visibleCount && (
				<ShowMore
					type="button"
					onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
				>
					{t("shelters.overview.show_more")}
				</ShowMore>
			)}
		</Section>
	);
};

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px ${$uw(3)};
`;

const LabelRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: ${$uw(0.75)};
`;

const Label = styled.span`
	display: inline-flex;
	align-items: baseline;
	gap: ${$uw(0.4)};
	font-size: 1.2rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: ${$color("primary")};
`;

const Dot = styled.span`
	color: ${$color("medium")};
`;

const Count = styled.span`
	color: ${$color("medium")};
	letter-spacing: 0;
`;

const FilterButton = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.4)};
	min-height: ${$uw(2)};
	padding: ${$uw(0.25)} ${$uw(0.6)};
	border: none;
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	cursor: pointer;
	> span {
		font-size: 1.3rem;
		font-weight: 700;
		color: ${$color("primary")};
	}
	&:active {
		opacity: 0.7;
	}
`;

const FilterChips = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(0.5)};
	margin-bottom: ${$uw(0.75)};
`;

const FilterChip = styled.button`
	padding: ${$uw(0.4)} ${$uw(1)};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
	border-radius: 999px;
	background: transparent;
	font-size: 1.3rem;
	font-weight: 700;
	color: ${$color("primary")};
	cursor: pointer;
	&.active {
		background: ${$color("primary")};
		color: ${$color("primary-contrast")};
		border-color: ${$color("primary")};
	}
	&:active {
		opacity: 0.7;
	}
`;

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	border-radius: 16px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	overflow: hidden;
`;

const Row = styled.button`
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
	min-height: ${$uw(3.5)};
	padding: ${$uw(0.6)} ${$uw(1)};
	border: none;
	background: transparent;
	cursor: pointer;
	text-align: left;
	& + & {
		border-top: 1px solid rgba(var(--ion-color-medium-rgb), 0.15);
	}
	&:active {
		opacity: 0.7;
	}
`;

const Pic = styled.div`
	flex: 0 0 auto;
	width: ${$uw(2.75)};
	height: ${$uw(2.75)};
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

const Texts = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 1px;
`;

const Name = styled.span`
	font-size: 1.45rem;
	font-weight: 500;
	color: ${$color("dark")};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Meta = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const StatusChip = styled.span<{ $text: string; $bg: string }>`
	flex: 0 0 auto;
	padding: ${$uw(0.25)} ${$uw(0.6)};
	border-radius: 999px;
	font-size: 1.2rem;
	font-weight: 700;
	color: ${({ $text }) => $color($text)};
	background: ${({ $bg }) => $color($bg)};
`;

const Empty = styled.p`
	margin: 0;
	padding: ${$uw(2)} 0;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.55rem;
`;

const ShowMore = styled.button`
	width: 100%;
	min-height: ${$uw(3)};
	margin-top: ${$uw(0.75)};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
	border-radius: 12px;
	background: transparent;
	font-size: 1.45rem;
	font-weight: 700;
	color: ${$color("primary")};
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const SkeletonRow = styled.div`
	height: ${$uw(3)};
	margin: ${$uw(0.5)};
	border-radius: 10px;
`;
