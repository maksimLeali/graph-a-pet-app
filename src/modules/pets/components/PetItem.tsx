
import styled from "styled-components";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import { $cssTRBL, $uw } from "../../../utils/theme/functions";
import { useEffect, useRef, useState } from "react";
import { Image2x } from "../../../components";
import gsap from "gsap";
type Prop = {
	pet: DashboardPetFragment;
	index: number
};

export const PetItem: React.FC<Prop> = ({ pet , index }) => {
	const [ready, setReady] = useState(false)
	const itemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
	  // Using GSAP to animate the entire PetItem component
	  gsap.fromTo(
		itemRef.current,
		{ opacity: 0, x: "-100px" }, // From left of 100px outside the screen
		{ opacity: 1, x: 0, duration: 0.6, delay: 0.2 + index / 10} // To original position with opacity transition
	  );
	}, []);

	setTimeout(() => {
		setReady(true);
	}, 1);

	return (
	  <Container ref={itemRef} bgColor={pet.main_picture?.main_color?.color}>
			<ImageWrapper>
				{ready && (
					<Image2x
						lazy
						alt={`${pet.name} picture`}
						id={pet.main_picture!.id}
					/>
				)}
				<Name>{pet.name} </Name>
			</ImageWrapper>
		</Container>
	);
};

const Container = styled.div<{ bgColor?: string }>`
	width: 100%;
	background-color: ${({ bgColor }) => bgColor || "var(--ion-color-primary)"};
	height: ${$uw(11)};
	margin-bottom: ${$uw(4)};
	border-radius: 4px;
`;

const ImageWrapper = styled.div`
	width: ${$uw(13)};
	position: relative;
	aspect-ratio: 1;
	position: relative;
	overflow: hidden;
	border-radius: 8px;
	top: ${$uw(-1)};
`;

const Name = styled.div`
	display: flex;
	align-items: end;
	padding: ${$cssTRBL(0, 2, 1)};
	height: 50%;
	width: 100%;
	position: absolute;
	bottom: 0;
	font-size: 2rem;
	font-weight: 600;
	background-image: linear-gradient(to top, #000a 0%, #0004 70%, #0000 100%);
	color: var(--ion-color-white);
`;
