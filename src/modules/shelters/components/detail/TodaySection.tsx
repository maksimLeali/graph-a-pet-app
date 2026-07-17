import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { Icon, type IconName } from "@components";
import { $color, $uw } from "@theme";

type Dash = {
	tasks_overdue: number;
	pets_needing_walk: number;
	low_stock_count: number;
	boxes_free: number;
};

type Props = {
	shelterId: string;
	dash?: Dash;
	loading?: boolean;
};

type Tone = "danger" | "warning" | "ok";

const toneColor: Record<Tone, string> = {
	danger: "status.danger",
	warning: "status.warning",
	ok: "status.ok",
};
const toneBg: Record<Tone, string> = {
	danger: "status.dangerBg",
	warning: "status.warningBg",
	ok: "status.okBg",
};

export const TodaySection: React.FC<Props> = ({ shelterId, dash, loading }) => {
	const { t, i18n } = useTranslation();
	const history = useHistory();

	const today = new Date().toLocaleDateString(i18n.language, {
		weekday: "short",
		day: "numeric",
		month: "long",
	});

	type Row = {
		key: string;
		tone: Tone;
		icon: IconName;
		text: string;
		cta?: string;
		to: string;
	};

	const rows: Row[] = [];
	if (dash) {
		if (dash.tasks_overdue > 0) {
			rows.push({
				key: "overdue",
				tone: "danger",
				icon: "alertCircle",
				text: t("shelters.overview.today_overdue", {
					count: dash.tasks_overdue,
				}),
				cta: t("shelters.overview.resolve") ?? "",
				to: `/shelters/detail/${shelterId}/tasks?status=OVERDUE`,
			});
		}
		if (dash.pets_needing_walk > 0) {
			rows.push({
				key: "walks",
				tone: "warning",
				icon: "walkOutline",
				text: t("shelters.overview.today_walks", {
					count: dash.pets_needing_walk,
				}),
				cta: t("shelters.overview.plan") ?? "",
				to: `/shelters/detail/${shelterId}/walks`,
			});
		}
		if (dash.low_stock_count > 0) {
			rows.push({
				key: "stock",
				tone: "warning",
				icon: "cubeOutline",
				text: t("shelters.overview.today_low_stock", {
					count: dash.low_stock_count,
				}),
				cta: t("shelters.overview.check") ?? "",
				to: `/shelters/detail/${shelterId}/inventory?filter=low_stock`,
			});
		}
	}
	const allOk = !!dash && rows.length === 0;

	return (
		<Section>
			<LabelRow>
				<Label>{t("shelters.overview.today")}</Label>
				<Today>{today}</Today>
			</LabelRow>

			{loading && !dash ? (
				<Card>
					<SkeletonRow className="skeleton" />
					<SkeletonRow className="skeleton" />
				</Card>
			) : (
				<Card>
					{rows.map((row) => (
						<ActionRow
							key={row.key}
							type="button"
							onClick={() => history.push(row.to)}
						>
							<IconBubble $bg={toneBg[row.tone]}>
								<Icon
									name={row.icon}
									color={toneColor[row.tone]}
									size="17px"
								/>
							</IconBubble>
							<RowText>{row.text}</RowText>
							{row.cta && <Cta $tone={toneColor[row.tone]}>{row.cta}</Cta>}
							<Icon name="chevronForward" color="medium" size="14px" />
						</ActionRow>
					))}
					{allOk && (
						<ActionRow
							type="button"
							className="compact"
							onClick={() =>
								history.push(`/shelters/detail/${shelterId}/boxes`)
							}
						>
							<IconBubble $bg={toneBg.ok}>
								<Icon
									name="checkmarkCircle"
									color={toneColor.ok}
									size="17px"
								/>
							</IconBubble>
							<RowText>{t("shelters.overview.all_ok")}</RowText>
							<Cta $tone={toneColor.ok}>
								{t("shelters.overview.boxes_free", {
									count: dash!.boxes_free,
								})}
							</Cta>
							<Icon name="chevronForward" color="medium" size="14px" />
						</ActionRow>
					)}
				</Card>
			)}
		</Section>
	);
};

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.25)} 12px 0;
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

const Today = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
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

const ActionRow = styled.button`
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
	min-height: ${$uw(3)};
	padding: ${$uw(0.75)} ${$uw(1)};
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
	&.compact {
		min-height: ${$uw(3)};
	}
`;

const IconBubble = styled.div<{ $bg: string }>`
	flex: 0 0 auto;
	width: ${$uw(2)};
	height: ${$uw(2)};
	border-radius: 9px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ $bg }) => $color($bg)};
`;

const RowText = styled.span`
	flex: 1 1 auto;
	min-width: 0;
	font-size: 1.45rem;
	font-weight: 500;
	color: ${$color("dark")};
`;

const Cta = styled.span<{ $tone: string }>`
	flex: 0 0 auto;
	font-size: 1.3rem;
	font-weight: 700;
	color: ${({ $tone }) => $color($tone)};
`;

const SkeletonRow = styled.div`
	height: ${$uw(3)};
	margin: ${$uw(0.5)};
	border-radius: 10px;
`;
