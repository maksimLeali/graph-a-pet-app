import { $color, $cssTRBL, $uw } from "@theme";
import { ReportType } from "@types";
import React, { useState } from "react";
import styled from "styled-components";

type Props = {
	onChange: (choise?: ReportType) => void;
};

export const ChoiseContainer: React.FC<Props> = React.memo(({ onChange }) => {
	const [choise, setChoise] = useState<ReportType>();
	const [color, setColor] = useState<"danger" | "warning" | "medium">(
		"medium"
	);

	const handleSetChoise = (selected: ReportType) => {
		if (choise == selected) {
			setChoise(undefined);
			setColor("medium");
			onChange(undefined);
			return;
		}
		setChoise(selected);
		setColor(selected == ReportType.Missing ? "danger" : "warning");
		onChange(undefined);
		return;
	};

	return (
		<Container color={color} choise={choise}>
			<Choise onClick={() => handleSetChoise(ReportType.Missing)}>
				Segnalazioni
			</Choise>
			<Choise onClick={() => handleSetChoise(ReportType.Found)}>
				Avvistamenti
			</Choise>
		</Container>
	);
});

const Container = styled.div<{ color: string; choise?: ReportType }>`
	border: 1px solid ${({ color }) => $color(color)};
	background-color: ${({ color }) => {
		if (color === "medium") {
			return $color("background-color");
		}
		return $color(color);
	}};
	border-radius: 4px;
	position: relative;
	margin-left: auto;
	height: ${$uw(2)};
    margin-top: ${$uw(2)};
	display: flex;
	margin-right: auto;
	align-items: center;
	transition: border-color 1s ease-out;
	width: fit-content;
	gap: ${$uw(2)};
	overflow-y: hidden;
	> div {
		transition: background-color 1s ease-out;

		&:first-child {
			padding-right: 0;
			background-color: ${({ choise, color }) =>
				choise == ReportType.Missing
					? $color(color)
					: $color("background-color")};
		}
		&:last-child {
			padding-left: 0;
			background-color: ${({ choise, color }) =>
				choise == ReportType.Found
					? $color(color)
					: $color("background-color")};
		}
	}
	&::before {
		transition: background-color 1s ease-out, border-color 1s ease-out;
		content: "";
		position: absolute;
		border-bottom: 1px solid ${({ color }) => $color(color)};
		width: ${$uw(2)};
		height: ${$uw(2)};
		display: block;
		left: calc(50% - ${$uw(1)});
		background-color: ${({ choise }) =>
			choise == ReportType.Missing
				? $color("danger")
				: $color("background-color")};
		z-index: 1;
	}
	&::after {
		content: "";
		position: absolute;
		transition: background-color 1s ease-out, border-color 1s ease-out;
		border-left: 1px solid ${({ color }) => $color(color)};
		transform: rotate(45deg) translate(50%, 50%);
		width: ${$uw(2.82)};
		height: ${$uw(2.82)};
		display: block;
		top: calc(-50% - ${$uw(0.5)});
		left: calc(50% - ${$uw(0.5)});
		background-color: ${({ choise }) =>
			choise == ReportType.Found
				? $color("warning")
				: $color("background-color")};
		z-index: 1;
	}
`;

const Choise = styled.div`
	position: relative;
	z-index: 2;
	height: 100%;
	padding: ${$cssTRBL(1)};
	display: flex;
	height: 100%;
	align-items: center;
`;
