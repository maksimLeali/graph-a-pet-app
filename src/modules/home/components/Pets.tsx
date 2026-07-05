import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetOrCreateLazyQuery } from "../operations/__generated__/getOrCreateCode.generated";
import { DashboardPetFragment } from "@graphql_generated/dashboardPet.generated";
import { PetMinSubOwnerFragment } from "@graphql_generated/petMinSubOwner.generated";

import { SubOwnerList, Icon, Image2x } from "@components";
import { useSwipe } from "@hooks";
import { useModal, useUserContext } from "@contexts";
import { gendersColor } from "@utils";
import { Gender } from "@types";
import { $breakPoint, $color, $cssTRBL, $uw } from "@theme";
import { IconContainer } from "../../../components/formFields/SelectInput/components";

type props = {
	pets: DashboardPetFragment[];
	onActiveChange: (v: number) => void;
};

export const Pets: React.FC<props> = ({ pets, onActiveChange }) => {
	const [active, setActive] = useState(0);
	const [prev, setprev] = useState(0);	
	const [direction, setDirection] = useState<"clock" | "counter">("clock");
	const [canShare, setCanShare] = useState(true);
	const { openModal, closeModal } = useModal();
	const onLeft = useCallback(() => changeMain(active + 1), [active]);
	const onRight = useCallback(() => changeMain(active - 1), [active]);
	const { handleTouchStart, handleTouchMove } = useSwipe({
		onLeft,
		onRight,
	});
	const { t } = useTranslation();
	const { user} = useUserContext();
	const changeMain = (i: number) => {
		if (i !== active) {
			setprev(active);
			setDirection(i < active ? "counter" : "clock");
			if (i < 0) {
				return setActive(pets.length - 1);
			}
			if (i >= pets.length) {
				return setActive(0);
			}
			return setActive(i);
		}
	};
	useEffect(() => {
		onActiveChange(active);
	}, [active]);

	const [getOrCreateCode] = useGetOrCreateLazyQuery({
		onCompleted: ({ getOrCreateCode }) => {
			if (!getOrCreateCode?.code || getOrCreateCode.error) {
				return;
			}
			try {
				if (!canShare) {
					return null;
				}
				navigator.share({
					url: `${window.location.origin}/pets/sharing/${getOrCreateCode.code.code}`,
					title: "Un cucciolo per te",
					text: "ti è stato condiviso un cucciolo",
				});
			} catch (e) {
				console.log(e);
			}
		},
	});

	useEffect(() => {
		try {
			navigator.canShare({
				url: `${window.location.origin}/home`,
				text: "Un cucciolo per te",
			});
		} catch (e) {
			setCanShare(false);
		}
	}, []);
	const share = useCallback(() => {
		getOrCreateCode({
			variables: {				
				ref_table: "pets",				
				ref_id: pets[active].id,
				code: null,
			},
		});
	}, [active]);

	const modalOpen = useCallback(() => {
		openModal({
			onClose: () => closeModal(),
			children: (
				<SubOwnerList
					ownerships={
						(pets[active].ownerships?.items.filter(
							(item) => 
								item && item.user.id !== user.id
						) as PetMinSubOwnerFragment[]) ?? []
					}
					onSelected={(str) => {}}
				/>
			),
		});
	}, [active]);

	return (
		<PetsContainer
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			mainColor={
				pets[active]?.main_picture?.main_color?.color ?? "primary"
			}
			contrast={
				pets[active]?.main_picture?.main_color?.contrast ?? "white"
			}
		>
			<BoxContainer>
				<PetsBox className="custom-pet-color pet-box" direction={direction}>
					{pets.map((pet, i) => pet.main_picture? (
						<Image2x
							id={pet.main_picture!.id}
							key={i}
							rounded
							alt={`${pet.name} picture`}
							className={`${i == prev ? "deactivated" : ""} ${
								i == active ? "active" : ""
							}`}
						/>
					)  : <></>)}
				</PetsBox>
				<ActionChip className="custom-pet-color top left" onClick={() => modalOpen()}>
					<Icon name="peopleOutline" color="dark" />
					<span>{t("home.co_owners")}</span>
				</ActionChip>
				<ActionChip className="custom-pet-color top right">
					<Icon name="bookOutline" color="dark" />
					<span>{t("home.health_record")}</span>
				</ActionChip>
				<ActionChip className="custom-pet-color bottom left">
					<Icon name="informationCircleOutline" color="dark" />
					<span>{t("home.profile")}</span>
				</ActionChip>
				<ActionChip className="custom-pet-color bottom right" onClick={() => share()}>
					<Icon name="shareOutline" color="dark" mode="md" />
					<span>{t("home.share")}</span>
				</ActionChip>
			</BoxContainer>

			{pets && pets.length && (
				<Title
					className="custom-pet-color"
					$bg={pets[active].main_picture?.main_color?.color}
					$fg={pets[active].main_picture?.main_color?.contrast}
				>
					<IconContainer
						className="icon-container"
						style={
							{
								"--gc": $color(
									gendersColor[pets[active].gender ?? Gender.NotSaid].color
								),
							} as React.CSSProperties
						}
					>
						<Icon
							size="100%"
							color={gendersColor[pets[active].gender ?? Gender.NotSaid].color}
							name={gendersColor[pets[active].gender ?? Gender.NotSaid].iconName}
						/>
					</IconContainer>
					<span className="mainInfo">{pets[active].name}</span>
				</Title>
			)}

			<DotsContainer>
				{pets &&
					pets.length &&
					pets.map((pet, i) => (
						<PetDot
							key={i}
							className={`pet-dot custom-pet-color-after ${i == active ? "active" : ""}`}
							onClick={() => changeMain(i)}
						/>
					))}
			</DotsContainer>
		</PetsContainer>
	);
};

const PetsContainer = styled.div<{ mainColor?: string; contrast?: string }>`
	width: 100%;
	display: flex;
	margin-bottom: ${$uw(4)};
	flex-direction: column;
	box-sizing: border-box;
	position: relative;
	align-items: center;
	padding-top: ${$uw(2)};
	> * {
		> * {
			transition: color 1s ease-in, background-color 1s ease-in;
			color: ${({ contrast }) => $color(contrast ?? "primary")};
			background-color: ${({ mainColor }) =>
				$color(mainColor ?? "primary")};
			&::after {
				transition: color 1s ease-in, background-color 1s ease-in;
				color: ${({ contrast }) => $color(contrast ?? "primary")};
				background-color: ${({ mainColor }) =>
					$color(mainColor ?? "primary")};
			}
			&.pet-box {
				transition: color 1s ease-in, background-color 1s ease-in;
				border: 3px solid ${$color("background-color")};
				background-color: ${({ mainColor }) =>
					$color(mainColor ?? "primary")};
			}
		}
	}
	> h2 {
		transition: color 1s ease-in, background-color 1s ease-in;
		color: ${({ contrast }) => $color(contrast ?? "primary")};
		background-color: ${({ mainColor }) => $color(mainColor ?? "primary")};
	}
	* {
		transition: color 1s ease-in, background-color 1s ease-in;
		color: #fff !important;
	}
`;
const BoxContainer = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	height: ${$uw(13)};
	padding: ${$uw(0.4)} 0;
	box-sizing: border-box;
	position: relative;
	z-index: 0;
	margin: ${$cssTRBL(0, 0, 2, 0)};
`;
const PetsBox = styled.div<{ direction?: "clock" | "counter" }>`
	width: ${$uw(13)};
	justify-self: center;
	left: calc(50% - ${$uw(6.5)});
	top: 0;
	aspect-ratio: 1;
	z-index: 3;
	position: absolute;
	border-radius: 500px;
	overflow-y: hidden;
	display: flex;
	overflow: hidden;
	> .img2x {
		width: 100%;
		height: 100%;
		position: absolute;
		top: -1000px;
		left: -0;
		&.deactivated {
			top: -1000px;
			left: -0;
			animation: deactivate-${({ direction }) => direction} 1.5s ease-in-out;
		}
		&.active {
			animation: activate-${({ direction }) => direction} 1.5s cubic-bezier(0.05, 0.4, 0, 1);
			top: 0;
			left: 0;
		}
	}
`;

const ActionChip = styled.span`
	position: relative;
	width: 50%;
	height: ${$uw(6)};
	display: flex;
	padding-bottom: 5px;
	margin-bottom: ${$uw(0.3)};
	align-items: center;
	gap: 12px;
	z-index: 2;
	font-size: 2.1rem;
	padding: 0 12px;
	${$breakPoint(420)} {
		font-size: 1.7rem;
	}
	${$breakPoint(380)} {
		font-size: 1.6rem;
	}
	${$breakPoint(350)} {
		font-size: 1.5rem;
	}
	&.left {
		justify-content: start;
		left: 0;
	}
	&.right {
		right: 0%;
		justify-content: end;
		flex-direction: row-reverse;
	}
	&.bottom {
		margin-bottom: 0;
	}
`;

const Title = styled.h2<{ $bg?: string; $fg?: string }>`
	display: flex;
	align-items: center;
	width: fit-content;
	font-size: 2rem;
	height: ${$uw(2.5)};
	padding: 0 ${$uw(2)} 0 ${$uw(0.6)};
	margin: 0 0 ${$uw(2)};
	font-weight: 600;
	border-radius: 99px;
	background-color: ${({ $bg }) => $color($bg || "primary")} !important;
	> .icon-container {
		width: ${$uw(1.5)};
		height: ${$uw(1.5)};
		flex: 0 0 ${$uw(1.5)};
		border-radius: 100px;
		background-color: ${$color("white")} !important;
		margin-right: ${$uw(0.5)};
		padding: ${$uw(0.2)};
		box-sizing: border-box;
		* {
			color: var(--gc) !important;
		}
	}
	> span.mainInfo {
		font-size: 1.8rem;
		font-weight: 800;
		color: ${({ $fg }) => $color($fg || "dark")} !important;
	}
	${$breakPoint(450)} {
		font-size: 2rem;
	}
`;

const DotsContainer = styled.div`
	display: flex;
	justify-content: space-evenly;
	width: 100%;
	padding: 0 20%;
`;

const PetDot = styled.span`
	width: ${$uw(2)};
	height: ${$uw(2)};
	padding: ${$uw(0.7)};
	box-sizing: border-box;
	background-color: ${$color("background-color")};
	transition: padding 0.2s ease-out;
	&:after {
		display: flex;
		content: "";
		width: 100%;
		height: 100%;

		border-radius: 15px;
		border: 1px solid ${$color("dark")};
	}
	&.active::after {
		content: "";
		border: 2px solid ${$color("dark")};
	}
	&.active {
		padding: ${$uw(0.2)};
	}
`;
