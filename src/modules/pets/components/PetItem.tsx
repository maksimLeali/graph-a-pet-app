import styled from "styled-components";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import { $cssTRBL, $uw } from "../../../utils/theme/functions";
import { useEffect, useRef, useState } from "react";
import { Image2x } from "../../../components";
import gsap from "gsap";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
type Prop = {
	pet: DashboardPetFragment;
	index: number;
};

export const PetItem: React.FC<Prop> = ({ pet, index }) => {
	const [ready, setReady] = useState(false);
	const [imageReady, setImageReady] = useState(false);
	const itemRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();
	useEffect(() => {
		if (imageReady) {
			// Using GSAP to animate the entire PetItem component
			gsap.fromTo(
				itemRef.current,
				{ opacity: 0, x: "-100px" }, // From left of 100px outside the screen
				{ opacity: 1, x: 0, duration: 0.6, delay: 0.2 + index / 10 } // To original position with opacity transition
			);
		}
	}, [imageReady, index]);
	setTimeout(() => {
		setReady(true);
	}, 100);
	return (
		<Container ref={itemRef} bgColor={pet.main_picture?.main_color?.color}>
			{ready && (
				<ImageWrapper>
					<Image2x
						lazy
						alt={`${pet.name} picture`}
						id={pet.main_picture!.id}
						onLoad={() => setImageReady(true)} // Set ready state to true when image is loaded
					/>

					<Name>
						<IconContainer className="icon-container" />
						{pet.name}{" "}
					</Name>
				</ImageWrapper>
			)}
			<InfoBox>
				<span>
					{t(`pets.breeds.${pet.body.breed.toLocaleLowerCase()}`)}
				</span>
				<BodyInfo>
					<span>{dayjs().diff(pet.birthday, "years")} Anni</span>
					<span>{pet.weight_kg} Kg</span>
				</BodyInfo>
				<span></span>
				<span></span>
			</InfoBox>
		</Container>
	);
};

const Container = styled.div<{ bgColor?: string }>`
	width: 100%;
	background-color: ${({ bgColor }) => bgColor || "var(--ion-color-primary)"};
	height: ${$uw(11)};
	margin-bottom: ${$uw(4)};
	opacity: 0;
	display: flex;
	border-radius: 4px;
	position: relative;
	.icon-container {
		border: 1px solid
			${({ bgColor }) => bgColor || "var(--ion-color-primary)"};
		box-shadow: 0 0 0 1px #fff;
	}
`;

const ImageWrapper = styled.div`
	width: ${$uw(13)};
	height: ${$uw(13)};
	position: absolute;
	aspect-ratio: 1;

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

const InfoBox = styled.div`
	display: flex;
	padding: ${$uw(1)};
	width: 100%;
	height: 100%;
	padding-left: ${$uw(14)};
	flex-wrap: wrap;
	flex-direction: column;
	align-items: start;
	> * {
		margin-bottom: ${$uw(1)};
	}
	span {
		height: ${$uw(2)};
	}
`;

const IconContainer = styled.div`
	width: ${$uw(2)};
	height: ${$uw(2)};
	display: block;
	border-radius: 100px;
	background-color: #fff;
	margin-right: ${$uw(1)};
`;

const BodyInfo = styled.div`
	width: 100%;
	display: flex;
	height: ${$uw(2)};
	align-items: center;
	gap: ${$uw(1)};
`;
