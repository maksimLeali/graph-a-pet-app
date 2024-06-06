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
				<ImageWrapper className="image-wrapper custom-pet-border-color">
					<Image2x
						lazy
						alt={`${pet.name} picture`}
						id={pet.main_picture!.id}
						onLoad={() => setImageReady(true)} // Set ready state to true when image is loaded
					/>
				</ImageWrapper>
			)}
			<InfoWrapper>
				<Name className="name custom-pet-color">
					<IconContainer className="icon-container">
						<Icon
							size="100%"
							color={gendersColor[pet.gender].color}
							name={gendersColor[pet.gender].iconName}
						></Icon>
					</IconContainer>
					<span className="mainInfo">{pet.name}</span>
				</Name>
				<InfoBox className="info-box custom-pet-border-color">
					<InfoRow>
						<span>
							{t(
								`pets.breeds.${pet.body.breed.toLocaleLowerCase()}`
							)}
						</span>
					</InfoRow>

					<InfoRow>
						<span
							dangerouslySetInnerHTML={{
								__html:
									t("pets.age_years", {
										count: dayjs().diff(
											pet.birthday,
											"years"
										),
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
						{pet.neutered && (
							<span className="sub">
								{t(
									`pets.neutered_${
										pet.gender == "FEMALE"
											? "female"
											: "male"
									}`
								)}
							</span>
						)}
					</InfoRow>
				</InfoBox>
			</InfoWrapper>
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

	
	.image-wrapper {
		border: 4px solid ${({ bgColor }) => $color(bgColor || "primary")};
	}
	.icon-container {
		background-color: ${$color("white")};
	}
	.name {
		background-color: ${({ bgColor }) => $color(bgColor || "primary")};
		color: ${({ color }) => $color(color || "dark")};
	}
	.info-box {
		border-top: 2px solid ${({ bgColor }) => $color(bgColor || "primary")};
		background-color: ${$color("light-tint")};
		box-shadow: 1px 2px 2px 0px #6666;
		.dark & {
			box-shadow: none;
		}
	}
`;

const ImageWrapper = styled.div`
	width: ${$uw(13)};
	height: ${$uw(13)};
	flex: 0 0 ${$uw(13)};
	aspect-ratio: 1;
	position: absolute;
	z-index: 3;
	border-left-width: 0;
	overflow: hidden;
	border-radius: 99px;
`;

const InfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	
`;

const Name = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	width: fit-content;
	font-size: 2rem;
	margin-left: ${$uw(6)};
	padding-left: ${$uw(6)};
	height: ${$uw(3)};
	font-weight: 600;
	padding-right: ${$uw(2)};
	border-radius: 0 99px 0px 0;
	> span.mainInfo {
		height: auto;
		margin-bottom: 0;
		font-size: 1.8rem;
		font-weight: 800;
	}
`;

const InfoBox = styled.div`
	display: flex;
	padding: ${$uw(1)};
	width: ${$uw(24)};	
	margin-left: ${$uw(6)};
	padding-left: ${$uw(8)};
	position: relative;
	top: -2px;
	height: ${$uw(10)};
	border-radius: 0 2px 2px 0px;

	flex-wrap: wrap;
	flex-direction: column;
	align-items: start;
	box-sizing: border-box;

	span {
		height: ${$uw(1)};
		margin-bottom: ${$uw(1)};
	}
`;

const IconContainer = styled.div`
	width: ${$uw(1.5)};
	height: ${$uw(1.5)};
	display: block;
	border-radius: 100px;

	margin-right: ${$uw(0.5)};
	padding: ${$uw(0.2)};
`;

const InfoRow = styled.div`
	width: 100%;
	display: flex;
	gap: ${$uw(1)};

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
