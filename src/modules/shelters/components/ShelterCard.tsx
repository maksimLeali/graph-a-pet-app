import styled from "styled-components";

import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { Shelter } from "../types";

type Props = {
	shelter: Shelter;
	onClick?: () => void;
};

export const ShelterCard: React.FC<Props> = ({ shelter, onClick }) => {
	const address = [shelter.city, shelter.region]
		.filter(Boolean)
		.join(", ");
	return (
		<Card role="button" tabIndex={0} onClick={onClick}>
			<IconBox>
				<Icon name="home" color="light" />
			</IconBox>
			<Info>
				<Name>{shelter.name}</Name>
				{address && <Address>{address}</Address>}
			</Info>
			<Chevron name="chevronForward" color="medium" />
		</Card>
	);
};

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1.5)};
	padding: ${$uw(1.25)} ${$uw(1.5)};
	border-radius: 16px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: pointer;
	transition: border-color 0.15s ease, transform 0.15s ease;
	&:active {
		transform: scale(0.99);
		border-color: ${$color("primary")};
	}
	@media (hover: hover) {
		&:hover {
			border-color: ${$color("primary")};
		}
	}
`;

const IconBox = styled.div`
	flex: 0 0 auto;
	width: ${$uw(4)};
	height: ${$uw(4)};
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(
		135deg,
		${$color("primary")},
		${$color("secondary")}
	);
	> .icon {
		width: ${$uw(2)};
		height: ${$uw(2)};
	}
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.25)};
`;

const Name = styled.span`
	font-size: 1.8rem;
	font-weight: 700;
	word-break: break-word;
`;

const Address = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
	word-break: break-word;
`;

const Chevron = styled(Icon)`
	flex: 0 0 auto;
	width: 18px;
	height: 18px;
	opacity: 0.6;
`;
