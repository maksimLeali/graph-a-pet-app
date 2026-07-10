import styled from "styled-components";
import { TaskStatus, ShelterWalkStatus } from "@types";

export type PillTone = "slate" | "yellow" | "red" | "green";

const TONE_COLORS: Record<PillTone, { bg: string; fg: string }> = {
	slate: { bg: "rgba(148, 163, 184, 0.16)", fg: "#cbd5e1" },
	yellow: { bg: "rgba(245, 196, 24, 0.18)", fg: "#f5c518" },
	red: { bg: "rgba(248, 113, 113, 0.18)", fg: "#f87171" },
	green: { bg: "rgba(52, 211, 153, 0.18)", fg: "#34d399" },
};

export const taskStatusTone = (status: TaskStatus, isOverdue?: boolean): PillTone => {
	if (isOverdue) return "red";
	switch (status) {
		case TaskStatus.Completed:
			return "green";
		case TaskStatus.InProgress:
		case TaskStatus.Overdue:
			return "yellow";
		case TaskStatus.Skipped:
		case TaskStatus.Cancelled:
			return "red";
		default:
			return "slate";
	}
};

export const walkStatusTone = (status: ShelterWalkStatus): PillTone => {
	switch (status) {
		case ShelterWalkStatus.Completed:
			return "green";
		case ShelterWalkStatus.InProgress:
			return "yellow";
		case ShelterWalkStatus.Cancelled:
			return "red";
		default:
			return "slate";
	}
};

type Props = {
	label: string;
	tone: PillTone;
	className?: string;
};

export const StatusPill: React.FC<Props> = ({ label, tone, className }) => {
	const { bg, fg } = TONE_COLORS[tone];
	return (
		<Pill className={className} $bg={bg} $fg={fg}>
			{label}
		</Pill>
	);
};

const Pill = styled.span<{ $bg: string; $fg: string }>`
	display: inline-flex;
	align-items: center;
	padding: 3px 10px;
	border-radius: 999px;
	background: ${({ $bg }) => $bg};
	color: ${({ $fg }) => $fg};
	font-size: 1.1rem;
	font-weight: 700;
	white-space: nowrap;
	line-height: 1.4;
`;
