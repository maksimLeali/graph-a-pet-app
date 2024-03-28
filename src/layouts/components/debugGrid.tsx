import { $cssTRBL, $uw } from "../../utils/theme/functions";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable as GSAPDraggable } from "gsap/dist/Draggable";
import { useState } from "react";
import styled from "styled-components";
import { useUserContext } from "../../contexts";
gsap.registerPlugin(GSAPDraggable);

export const DebugGrid: React.FC = () => {
	const [gridHeight, setGridHeigth] = useState(6);
	const { gridVisible } = useUserContext();
	useGSAP(() => {
		GSAPDraggable.create("#debugGrid", { bounds: "#mainWrapper" });
	}, []);

	const editGridHeight = (num: number) => {
		console.log("handlig");
		if (gridHeight + num < 6) return;
		setGridHeigth(gridHeight + num);
	};

	return (
		<Container id="debugGrid" gridHeight={gridHeight} visible={gridVisible}>
			<Action
				onClick={(e) => {
					e.preventDefault();
					editGridHeight(-1);
				}}
				onTouchEnd={(e) => {
					e.preventDefault();
					editGridHeight(-1);
				}}
				className="remove"
			>
				-
			</Action>
			<Action
				onClick={(e) => {
					console.log("click click");
					e.preventDefault();
					editGridHeight(1);
				}}
				onTouchEnd={(e) => {
					e.preventDefault();
					editGridHeight(1);
				}}
				className="add"
			>
				+
			</Action>
		</Container>
	);
};

const Container = styled.div<{ gridHeight: number; visible: boolean }>`
	width: var(--max-grid-size);
	height: ${({ gridHeight }) => $uw(gridHeight)};
	position: absolute;
	top: 0;
	z-index: ${({ visible }) => (visible ? 999 : `-1!important`)};
	opacity: ${({ visible }) => (visible ? 1 : 0)};
	marggin-left: auto;
	display: flex;
	justify-content: space-between;
	align-items: start;
	padding: ${$cssTRBL(2)};
	margign-right: auto;

	background-size: calc(var(--max-grid-size) / var(--grid-columns-number))
		calc(var(--max-grid-size) / var(--grid-columns-number));
	background-image: linear-gradient(
			to right,
			var(--grid-color) 1px,
			transparent 1px
		),
		linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
`;

const Action = styled.button`
	width: ${$uw(2)};
	height: ${$uw(2)};
	box-sizing: border-box;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	&.remove {
		border: 5px solid var(--ion-color-danger);
		color: var(--ion-color-danger);
		background-color: unset;
		font-weight: 800;
		font-size: 2.5rem;
	}
	&.add {
		border: 5px solid var(--ion-color-primary);
		color: var(--ion-color-primary);
		background-color: unset;
		font-weight: 800;
		font-size: 2.5rem;
	}
`;
