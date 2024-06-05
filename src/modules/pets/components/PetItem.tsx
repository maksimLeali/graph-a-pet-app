import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import gsap from "gsap";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { $breakPoint, $color, $uw } from "@theme";
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
				<Name className="name">
					<IconContainer className="icon-container">
						<Icon
							size="100%"
							color={gendersColor[pet.gender].color}
							name={gendersColor[pet.gender].iconName}
						></Icon>
					</IconContainer>
					<span className="mainInfo">{pet.name}</span>
				</Name>
				<InfoRow>
					<span>
						{t(`pets.breeds.${pet.body.breed.toLocaleLowerCase()}`)}
					</span>
				</InfoRow>
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

				{pet.neutered && (
					<InfoRow>
						<span className="sub">
							{t(
								`pets.neutered_${
									pet.gender == "FEMALE" ? "female" : "male"
								}`
							)}
						</span>
					</InfoRow>
				)}
			</InfoBox>
		</Container>
	);
};

const Container = styled.div<{ bgColor?: string; color?: string }>`
	width: 100%;
	height: ${$uw(13)};
	/* background-color: ${({ bgColor }) => $color(bgColor || "primary")}; */
	margin-bottom: ${$uw(4)};
	opacity: 0;
	display: flex;
	border-radius: 99px 4px 4px 99px;
	position: relative;
	padding: 2px;
	&::before {
		content: "";
		background-color: ${$color("light-tint")};
		position: absolute;
		height: calc(${$uw(13)} - 4px);
		left: ${$uw(7)};
		width: ${$uw(7)};
		z-index: 1;
	}
	&::after {
		content: "";
		left: ${$uw(7)};

		width: calc(${$uw(7)} + 4px);
		height: ${$uw(3)};
		background-color: ${({ bgColor }) => $color(bgColor || "primary")};
		position: absolute;
		z-index: 1;
	}
	.image-wrapper {
		border: 4px solid ${({ bgColor }) => $color(bgColor || "primary")};
	}
	.icon-container {
		background-color: ${$color("white")};
	}
	.info-box {
		background-color: ${$color("light-tint")};
		.name {
			background-color: ${({ bgColor }) => $color(bgColor || "primary")};
			color: ${({ color }) => $color(color || "dark")};
		}
	}
`;

const ImageWrapper = styled.div`
	width: ${$uw(13)};
	height: calc(${$uw(13)} - 4px);
	flex: 0 0 ${$uw(13)};
	aspect-ratio: 1;
	position: relative;
	z-index: 3;
	border-left-width: 0;
	overflow: hidden;
	border-radius: 99px;
`;

const InfoBox = styled.div`
	display: flex;
	padding: ${$uw(1)};
	width: ${$uw(17)};
	height: 100%;
	border-radius: 0 2px 2px 0px;
	z-index: 2;
	flex-wrap: wrap;
	flex-direction: column;
	align-items: start;
	box-sizing: border-box;

	span {
		height: ${$uw(1)};
		margin-bottom: ${$uw(1)};
	}
`;

const Name = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	top: ${$uw(-1)};
	font-size: 2rem;
	left: ${$uw(-3)};
	height: ${$uw(3)};
	font-weight: 600;
	padding-right: ${$uw(2)};
	padding-left: ${$uw(1)};
	border-radius: 0 99px 99px 0;
	> span.mainInfo {
		height: auto;
		margin-bottom: 0;
		font-size: 1.8rem;
		font-weight: 800;
	}
`;

const IconContainer = styled.div`
	width: ${$uw(1.5)};
	height: ${$uw(1.5)};
	display: block;
	border-radius: 100px;

	margin-right: ${$uw(.5)};
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
	${$breakPoint(420)} {
		span {
			font-size: 1.4rem;
		}
	}
`;
