import styled from "styled-components";

import { $color, $cssTRBL, $uw } from "@theme";

export const SkeletonBox: React.FC = () => {
	return (
		<>
			<MainContainer>
				<ChoiseContainer>
					<SkeletonChoise className="skeleton" />
					<SkeletonChoise className="skeleton" />
					<SkeletonImgBox className="skeleton" />
				</ChoiseContainer>
				<SkeletonTitle className="skeleton" />
				<SkeletonDot className="skeleton" />
			</MainContainer>
		</>
	);
};

const MainContainer = styled.div`
	width: 100%;

	display: flex;
	padding-top: 10px;
	margin-bottom: ${$uw(4)};
	flex-direction: column;
`;

const ChoiseContainer = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	flex-direction: column;
	margin: ${$cssTRBL(5, 0, 2, 0)};
	padding: ${$uw(0.4)} 0;
`;

const SkeletonChoise = styled.div`
	width: 100%;
	height: ${$uw(6)};
	background-color: ${$color('medium')};
	margin-bottom: 3px;
`;
const SkeletonImgBox = styled.div`
	width: ${$uw(13)};
	aspect-ratio: 1/1;
	position: absolute;
	background-color: ${$color('medium')};
	border: 3px solid ${$color('background-color')};
	border-radius: 200px;
	inset: 0;
	margin: auto;
`;

const SkeletonTitle = styled.div`
	align-self: center;
	width: 120px;
	padding: 0 ${$uw(2)};
	height: ${$uw(3)};
	background-color: ${$color('medium')};
	border-radius: ${$uw(3)};
	margin-bottom: ${$uw(2)};
`;

const SkeletonDot = styled.div`
	align-self: center;
	width: 30px;
	aspect-ratio: 1/1;
	background-color: ${$color("medium-tint")};
	border-radius: 30px;
	border: 2px solid ${$color("light")};
`;
