import styled from "styled-components";

import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { Shelter } from "../types";

type Props = {
	shelter: Shelter;
	onClick?: () => void;
};

export const ShelterCard: React.FC<Props> = ({ shelter, onClick }) => {
	return (
		<Card role="button" tabIndex={0} onClick={onClick}>
			<House>
				<Icon name="paw" color="light" size="40px" />
			</House>
			<Name>{shelter.name}</Name>
			{shelter.city && <City>{shelter.city}</City>}
		</Card>
	);
};

const Card = styled.div`
	width: 30%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(1)};
	cursor: pointer;
`;

const House = styled.div`
	width: 100%;
	aspect-ratio: 1/1;
	background: ${$color("primary")};
	clip-path: polygon(50% 0, 100% 38%, 100% 100%, 0 100%, 0 38%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 18%;
	box-sizing: border-box;
`;

const Name = styled.span`
	text-align: center;
	font-weight: 600;
	word-break: break-word;
`;

const City = styled.span`
	text-align: center;
	font-size: 0.8em;
	opacity: 0.6;
	word-break: break-word;
`;
