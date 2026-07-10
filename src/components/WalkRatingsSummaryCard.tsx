import styled from "styled-components";

import { WalkRatingType } from "@types";

export const walkRatingLabels: Record<WalkRatingType, string> = {
	[WalkRatingType.Overall]: "Generale",
	[WalkRatingType.Behavior]: "Comportamento",
	[WalkRatingType.Calm]: "Calma",
	[WalkRatingType.Aggression]: "Aggressività",
	[WalkRatingType.LeashPulling]: "Tiro al guinzaglio",
};

// dataviz-derived monochromatic green family (design handoff OKLCH values,
// converted to hex — fixed dark card, independent of app light/dark theme)
export const WALK_RATING_COLOR: Record<WalkRatingType, string> = {
	[WalkRatingType.Overall]: "#00c565",
	[WalkRatingType.LeashPulling]: "#24ab7e",
	[WalkRatingType.Behavior]: "#99de6f",
	[WalkRatingType.Aggression]: "#007338",
	[WalkRatingType.Calm]: "#beecc6",
};

// display order per design: the 4 secondary metrics first, "Generale"
// last spanning both grid columns as the summary row
const DISPLAY_ORDER: WalkRatingType[] = [
	WalkRatingType.Aggression,
	WalkRatingType.Behavior,
	WalkRatingType.Calm,
	WalkRatingType.LeashPulling,
	WalkRatingType.Overall,
];

export type WalkRatingAvg = { type: WalkRatingType; rating: number };

type Props = {
	ratings: WalkRatingAvg[];
	className?: string;
};

const formatValue = (v: number) => (v % 1 === 0 ? String(v) : v.toFixed(1));

export const WalkRatingsSummaryCard: React.FC<Props> = ({ ratings, className }) => {
	const byType = new Map(ratings.map((r) => [r.type, r.rating]));
	const stats = DISPLAY_ORDER.filter((type) => byType.has(type)).map((type) => ({
		type,
		value: byType.get(type)!,
	}));

	if (stats.length === 0) return null;

	return (
		<Card className={className}>
			<Grid>
				{stats.map((s) => (
					<StatRow
						key={s.type}
						$full={s.type === WalkRatingType.Overall}
					>
						<TopRow>
							<Label>{walkRatingLabels[s.type]}</Label>
							<ValueRow>
								<Star $color={WALK_RATING_COLOR[s.type]}>★</Star>
								<Value>{formatValue(s.value)}</Value>
							</ValueRow>
						</TopRow>
						<BarTrack>
							<BarFill
								style={{
									width: `${Math.min(100, (s.value / 5) * 100)}%`,
									background: WALK_RATING_COLOR[s.type],
								}}
							/>
						</BarTrack>
					</StatRow>
				))}
			</Grid>
		</Card>
	);
};

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	background: #070e09;
	border: 1px solid #20332573;
	border-radius: 20px;
	padding: 22px 20px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px 24px;
`;

const StatRow = styled.div<{ $full: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 8px;
	${({ $full }) => $full && `grid-column: 1 / -1;`}
`;

const TopRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`;

const Label = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: #8a968c;
`;

const ValueRow = styled.span`
	display: flex;
	align-items: center;
	gap: 6px;
`;

const Star = styled.span<{ $color: string }>`
	color: ${({ $color }) => $color};
	font-size: 16px;
	line-height: 1;
`;

const Value = styled.span`
	font-size: 17px;
	font-weight: 800;
	color: #f1f7f2;
`;

const BarTrack = styled.div`
	height: 5px;
	width: 100%;
	background: #19221a99;
	border-radius: 3px;
	overflow: hidden;
`;

const BarFill = styled.div`
	height: 100%;
	border-radius: 3px;
`;
