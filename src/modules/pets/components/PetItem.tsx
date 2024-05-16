import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import gsap from "gsap";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { $uw } from "@theme";
import { Image2x, Icon } from "@components";
import { gendersColor } from "@utils";


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

	useEffect(() => {
		console.log(t("pet.age_years", { years: 3 }));
	}, []);
	return (
		<Container
			ref={itemRef}
			bgColor={pet.main_picture?.main_color?.color}
			color={pet.main_picture?.main_color?.contrast}
		>
			{ready && (
				<ImageWrapper className="image-wrapper">
					<Image2x
						lazy
						alt={`${pet.name} picture`}
						id={pet.main_picture!.id}
						onLoad={() => setImageReady(true)} // Set ready state to true when image is loaded
					/>
				</ImageWrapper>
			)}
			<InfoBox className="info-box">
				<Name>
					<span className="mainInfo">
						<p>{pet.name}</p>
						<span>
							{t(
								`pets.breeds.${pet.body.breed.toLocaleLowerCase()}`
							)}
						</span>
					</span>
					<IconContainer className="icon-container">
						<Icon
							size="100%"
							customColor={gendersColor[pet.gender].color}
							name={gendersColor[pet.gender].iconName}
						></Icon>
					</IconContainer>
				</Name>

				<InfoRow>
					<span
						dangerouslySetInnerHTML={{
							__html:
								t("pets.age_years", {
									count: dayjs().diff(pet.birthday, "years"),
								}) ?? "",
						}}
					/>
					<span
						dangerouslySetInnerHTML={{
							__html:
								t("pets.weight_kg", {
									weight_kg: pet.weight_kg,
								}) ?? "",
						}}
					/>
				</InfoRow>
				<InfoRow>
					<span
						dangerouslySetInnerHTML={{
							__html:
								t("pets.coat_lenght", {
									lenght: t(
										`pets.coat_lenghts.${pet.body.coat.length}`
									),
								}) ?? "",
						}}
					/>
				</InfoRow>
				<InfoRow>
					{pet.neutered && (
						<span className="sub">
							{t(
								`pets.neutered_${
									pet.gender == "FEMALE" ? "female" : "male"
								}`
							)}
						</span>
					)}
				</InfoRow>
			</InfoBox>
		</Container>
	);
};

const Container = styled.div<{ bgColor?: string; color?: string }>`
	width: 100%;
	height: ${$uw(11)};
	margin-bottom: ${$uw(4)};
	opacity: 0;
	display: flex;
	border-radius: 4px;
	position: relative;
	.image-wrapper {
		border: 3px solid
			${({ bgColor }) => bgColor || "var(--ion-color-primary)"};
	}
	.icon-container {
		border: 1px solid
			${({ bgColor }) => bgColor || "var(--ion-color-primary)"};
		box-shadow: 0 0 0 1px #fff;
	}
	.info-box {
		background-color: ${({ bgColor }) =>
			bgColor || "var(--ion-color-primary)"};
	}
	span {
		${({ color }) => (color ? `color: ${color}` : "")}
	}
`;

const ImageWrapper = styled.div`
	width: ${$uw(13)};
	height: ${$uw(13)};
	position: absolute;
	aspect-ratio: 1;

	overflow: hidden;
	border-radius: 99px;
	top: ${$uw(-1)};
`;

const Name = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	font-size: 2rem;
	height: ${$uw(2.5)};
	margin-bottom: ${$uw(1)};
	font-weight: 600;

	> span.mainInfo {
		height: 100%;
		margin-bottom: 0;
		p {
			font-size: 1.8rem;
			font-weight: 800;
		}
		span {
			font-weight: 400;
			font-size: 1.3rem;
		}
		* {
			margin: 0;
			margin-bottom: 0;
		}
	}
`;

const InfoBox = styled.div`
	display: flex;
	padding: ${$uw(1)};
	width: 100%;
	height: 100%;
	border-radius: 99px 20px 20px 99px;
	padding-left: ${$uw(14)};
	flex-wrap: wrap;
	flex-direction: column;
	align-items: start;

	span {
		height: ${$uw(1)};
		margin-bottom: ${$uw(1)};
	}
`;

const IconContainer = styled.div`
	width: ${$uw(1.8)};
	height: ${$uw(1.8)};
	display: block;
	border-radius: 100px;
	background-color: #fff;
	margin-right: ${$uw(1)};
	padding: ${$uw(0.2)};
`;

const InfoRow = styled.div`
	width: 100%;
	display: flex;
	gap: ${$uw(1)};
	height: ${$uw(1.5)};
	margin-bottom: ${$uw(0.5)};
	justify-content: flex-start;
	&:last-child {
		margin-bottom: 0;
	}
	> .sub {
		font-size: 1.3rem;
	}
`;
