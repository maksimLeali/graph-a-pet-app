import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { StatsPeriod } from "@types";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

// dataviz skill categorical slot 1 (blue) — single series, no legend needed
const COLOR = { light: "#2a78d6", dark: "#3987e5" };

// il tema attivo è deciso dal toggle in MainMenu (document.body.classList
// "dark", non la preferenza di sistema): va osservato lì, non via matchMedia,
// altrimenti il grafico non segue lo switch manuale dell'utente in-app
const useIsDark = () => {
	const [isDark, setIsDark] = useState(
		() => document.body.classList.contains("dark")
	);
	useEffect(() => {
		const observer = new MutationObserver(() => {
			setIsDark(document.body.classList.contains("dark"));
		});
		observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);
	return isDark;
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

type Props = {
	labels: string[];
	data: (number | null)[];
	period: StatsPeriod;
	onPeriodChange: (period: StatsPeriod) => void;
	loading?: boolean;
};

export const PetWeightChart: React.FC<Props> = ({
	labels,
	data,
	period,
	onPeriodChange,
	loading,
}) => {
	const { t } = useTranslation();
	const isDark = useIsDark();
	const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
	const tickColor = isDark ? "#c3c2b7" : "#52514e";
	const color = isDark ? COLOR.dark : COLOR.light;

	const hasData = data.some((v) => v != null);

	return (
		<Wrap>
			<PeriodTabs>
				{PERIODS.map((p) => (
					<PeriodTab
						key={p}
						type="button"
						className={p === period ? "active" : ""}
						onClick={() => onPeriodChange(p)}
					>
						{t(PERIOD_LABEL_KEY[p])}
					</PeriodTab>
				))}
			</PeriodTabs>

			{loading ? (
				<ChartBox className="skeleton" />
			) : hasData ? (
				<ChartBox>
					<Line
						data={{
							labels,
							datasets: [
								{
									label: t("stats.weight") ?? "",
									data,
									borderColor: color,
									backgroundColor: color,
									borderWidth: 2,
									pointRadius: 4,
									pointBorderWidth: 2,
									pointBorderColor: isDark ? "#1a1a19" : "#fcfcfb",
									spanGaps: true,
									tension: 0.3,
								},
							],
						}}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							interaction: { mode: "nearest", intersect: false },
							scales: {
								y: {
									ticks: { color: tickColor },
									grid: { color: gridColor },
								},
								x: {
									ticks: { color: tickColor },
									grid: { display: false },
								},
							},
							plugins: {
								legend: { display: false },
								tooltip: { mode: "nearest", intersect: false },
							},
						}}
					/>
				</ChartBox>
			) : (
				<Empty>{t("stats.empty")}</Empty>
			)}
		</Wrap>
	);
};

const Wrap = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const PeriodTabs = styled.div`
	display: flex;
	gap: ${$uw(0.5)};
`;

const PeriodTab = styled.button`
	flex: 1 1 auto;
	padding: ${$uw(0.6)} ${$uw(1)};
	border: none;
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	color: ${$color("primary")};
	font-size: 1.3rem;
	font-weight: 700;
	cursor: pointer;
	&.active {
		background: ${$color("primary")};
		color: ${$color("light")};
	}
`;

const ChartBox = styled.div`
	width: 100%;
	height: 220px;
	box-sizing: border-box;
	padding: ${$uw(1.25)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const Empty = styled.div`
	width: 100%;
	text-align: center;
	padding: ${$uw(3)} 12px;
	color: ${$color("medium")};
	font-size: 1.5rem;
`;
