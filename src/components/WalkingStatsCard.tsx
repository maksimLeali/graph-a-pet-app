import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { WalkRatingType, StatsPeriod } from "@types";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";
import {
	WalkRatingsSummaryCard,
	walkRatingLabels,
	WALK_RATING_COLOR,
} from "./WalkRatingsSummaryCard";

export type WalkRatingSeriesData = {
	type: WalkRatingType;
	data: (number | null)[];
};

type Props = {
	labels: string[];
	series: WalkRatingSeriesData[];
	period: StatsPeriod;
	onPeriodChange: (period: StatsPeriod) => void;
	loading?: boolean;
};

const PERIODS: StatsPeriod[] = [
	StatsPeriod.Weekly,
	StatsPeriod.Monthly,
	StatsPeriod.Yearly,
];

const PERIOD_LABEL_KEY: Record<StatsPeriod, I18NKey> = {
	[StatsPeriod.Weekly]: "stats.period.weekly",
	[StatsPeriod.Monthly]: "stats.period.monthly",
	[StatsPeriod.Yearly]: "stats.period.yearly",
};

const RANGE_LABEL_KEY: Record<StatsPeriod, I18NKey> = {
	[StatsPeriod.Weekly]: "stats.period_range.weekly",
	[StatsPeriod.Monthly]: "stats.period_range.monthly",
	[StatsPeriod.Yearly]: "stats.period_range.yearly",
};

// Gen Feb Mar Apr Mag Giu Lug Ago Set Ott Nov Dic -> single-letter initials,
// matching the design's month-initial x-axis style ("G F M A M G L A S O N D")
const MONTH_INITIALS = ["G", "F", "M", "A", "M", "G", "L", "A", "S", "O", "N", "D"];

// backend label -> short axis label, per period bucket format
// (WEEKLY: "YYYY-Www", MONTHLY: "YYYY-MM", YEARLY: "YYYY")
const shortLabel = (raw: string, period: StatsPeriod) => {
	if (period === StatsPeriod.Weekly) {
		const week = raw.split("-W")[1];
		return week ? String(Number(week)) : raw;
	}
	if (period === StatsPeriod.Monthly) {
		const month = Number(raw.split("-")[1]);
		return MONTH_INITIALS[month - 1] ?? raw;
	}
	return raw;
};

const PLOT_W = 1000;
const PLOT_H = 300;
const LEFT_PAD = 50;
const RIGHT_PAD = 20;
const TOP_PAD = 10;
const BOTTOM_PAD = 10;

const xFor = (i: number, n: number) => {
	if (n <= 1) return (LEFT_PAD + (PLOT_W - RIGHT_PAD)) / 2;
	const plotW = PLOT_W - LEFT_PAD - RIGHT_PAD;
	return LEFT_PAD + (i / (n - 1)) * plotW;
};
const yFor = (value: number) => {
	const plotH = PLOT_H - TOP_PAD - BOTTOM_PAD;
	return PLOT_H - BOTTOM_PAD - (value / 5) * plotH;
};

// splits a series into contiguous runs of non-null points: runs of length
// >=2 get a path, isolated points render as a dot only (no line)
const buildRuns = (data: (number | null)[], n: number) => {
	const runs: { path: string; points: { x: number; y: number }[] }[] = [];
	let current: { x: number; y: number }[] = [];
	const flush = () => {
		if (current.length === 0) return;
		const path =
			current.length > 1
				? current
						.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
						.join(" ")
				: "";
		runs.push({ path, points: current });
		current = [];
	};
	data.forEach((v, i) => {
		if (v == null) {
			flush();
			return;
		}
		current.push({ x: xFor(i, n), y: yFor(v) });
	});
	flush();
	return runs;
};

const GRID_VALUES = [0, 1, 2, 3, 4, 5];

export const WalkingStatsCard: React.FC<Props> = ({
	labels,
	series,
	period,
	onPeriodChange,
	loading,
}) => {
	const { t } = useTranslation();
	const [hidden, setHidden] = useState<Set<WalkRatingType>>(new Set());

	const toggle = (type: WalkRatingType) => {
		setHidden((prev) => {
			const next = new Set(prev);
			if (next.has(type)) next.delete(type);
			else next.add(type);
			return next;
		});
	};

	const xLabels = labels.map((l) => shortLabel(l, period));
	const n = labels.length;

	// media per tipo sui bucket attualmente caricati (nessun refetch, come
	// da spec: il toggle legenda e il cambio tab sono solo stato client)
	const summaryRatings = series
		.map((s) => {
			const values = s.data.filter((v): v is number => v != null);
			if (values.length === 0) return null;
			const avg = values.reduce((a, b) => a + b, 0) / values.length;
			return { type: s.type, rating: Math.round(avg * 10) / 10 };
		})
		.filter((r): r is { type: WalkRatingType; rating: number } => !!r);

	return (
		<Screen>
			<PeriodLabel>{t(RANGE_LABEL_KEY[period])}</PeriodLabel>

			<Tabs>
				{PERIODS.map((p) => (
					<Tab
						key={p}
						type="button"
						className={p === period ? "active" : ""}
						onClick={() => onPeriodChange(p)}
					>
						{t(PERIOD_LABEL_KEY[p])}
					</Tab>
				))}
			</Tabs>

			<ChartCard>
				{loading ? (
					<ChartSkeleton className="skeleton" />
				) : (
					<>
						<ChartArea>
							{GRID_VALUES.map((v) => (
								<YLabel key={v} style={{ top: `${(yFor(v) / PLOT_H) * 100}%` }}>
									{v}
								</YLabel>
							))}
							<svg
								viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
								style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
							>
								{GRID_VALUES.map((v) => (
									<line
										key={v}
										x1={LEFT_PAD}
										y1={yFor(v)}
										x2={PLOT_W - RIGHT_PAD}
										y2={yFor(v)}
										stroke="var(--ion-color-step-200)"
										strokeWidth={1.5}
										strokeDasharray={v === 0 ? "0" : "6 6"}
									/>
								))}
								{series
									.filter((s) => !hidden.has(s.type))
									.map((s) =>
										buildRuns(s.data, n).map((run, i) => (
											<g key={`${s.type}-${i}`}>
												{run.path && (
													<path
														d={run.path}
														fill="none"
														stroke={WALK_RATING_COLOR[s.type]}
														strokeWidth={4}
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												)}
												{run.points.map((p, pi) => (
													<circle
														key={pi}
														cx={p.x}
														cy={p.y}
														r={8}
														fill={WALK_RATING_COLOR[s.type]}
														stroke="var(--ion-card-background)"
														strokeWidth={3}
													/>
												))}
											</g>
										))
									)}
							</svg>
						</ChartArea>

						<XLabels>
							{xLabels.map((l, i) => (
								<XLabel key={i}>{l}</XLabel>
							))}
						</XLabels>
					</>
				)}

				<Legend>
					{series.map((s) => {
						const visible = !hidden.has(s.type);
						const color = WALK_RATING_COLOR[s.type];
						return (
							<Chip
								key={s.type}
								type="button"
								$visible={visible}
								$color={color}
								onClick={() => toggle(s.type)}
							>
								<Dot style={{ background: visible ? color : "var(--ion-color-step-300)" }} />
								<span>{walkRatingLabels[s.type]}</span>
							</Chip>
						);
					})}
				</Legend>
			</ChartCard>

			<WalkRatingsSummaryCard ratings={summaryRatings} />
		</Screen>
	);
};

const Screen = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const PeriodLabel = styled.div`
	font-size: 1.5rem;
	font-weight: 700;
	color: ${$color("medium")};
	text-transform: capitalize;
`;

const Tabs = styled.div`
	display: flex;
	gap: ${$uw(0.5)};
	background: ${$color("step-100")};
	padding: ${$uw(0.25)};
	border-radius: 14px;
	border: 1px solid ${$color("step-200")};
`;

const Tab = styled.button`
	flex: 1;
	text-align: center;
	padding: ${$uw(0.6)} 0;
	border: none;
	border-radius: 10px;
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
	user-select: none;
	background: transparent;
	color: ${$color("medium")};
	transition: background 0.15s ease, color 0.15s ease;
	&:hover {
		background: ${$color("step-150")};
		color: ${$color("text-color")};
	}
	&.active {
		background: ${$color("primary")};
		color: ${$color("primary-contrast")};
	}
	&.active:hover {
		background: ${$color("primary")};
		color: ${$color("primary-contrast")};
	}
`;

const ChartCard = styled.div`
	width: 100%;
	box-sizing: border-box;
	background: ${$color("card-background")};
	border: 1px solid ${$color("step-200")};
	border-radius: 20px;
	padding: 22px 18px 18px;
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

const ChartArea = styled.div`
	position: relative;
	width: 100%;
`;

const ChartSkeleton = styled.div`
	width: 100%;
	height: 180px;
	border-radius: 12px;
`;

const YLabel = styled.div`
	position: absolute;
	left: 0;
	transform: translateY(-50%);
	width: 34px;
	text-align: right;
	font-size: 12px;
	font-weight: 600;
	color: ${$color("medium")};
`;

const XLabels = styled.div`
	display: flex;
	padding: 0 5%;
	margin-top: 2px;
`;

const XLabel = styled.div`
	flex: 1;
	text-align: center;
	font-size: 13px;
	font-weight: 700;
	color: ${$color("medium")};
`;

const Legend = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 6px;
	padding-top: 14px;
	border-top: 1px solid ${$color("step-200")};
`;

const Chip = styled.button<{ $visible: boolean; $color: string }>`
	display: flex;
	align-items: center;
	gap: 7px;
	padding: 7px 12px;
	border-radius: 999px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	user-select: none;
	border: 1px solid ${({ $visible }) => ($visible ? $color("step-300") : $color("step-150"))};
	background: ${({ $visible }) => ($visible ? $color("step-100") : "transparent")};
	color: ${({ $visible }) => ($visible ? $color("text-color") : $color("medium"))};
	transition: all 0.15s ease;
	&:hover {
		color: ${$color("text-color")};
		border-color: ${({ $color: chipColor }) => chipColor};
	}
`;

const Dot = styled.span`
	width: 10px;
	height: 10px;
	border-radius: 3px;
	display: inline-block;
`;
