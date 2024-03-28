import styled from "styled-components";
import { Icon, Image2x } from "../../../components";
import { useCallback, useEffect, useState } from "react";
import { useSwipe } from "../../../hooks";
import { SubOwnerList } from "../../../components";
import { useModal } from "../../../contexts/ModalContext";
import { useTranslation } from "react-i18next";
import { useGetOrCreateLazyQuery } from "../operations/__generated__/getOrCreateCode.generated";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import { PetMinSubOwnerFragment } from "../../../components/operations/__generated__/petMinSubOwner.generated";
import { $break_point, $cssTRBL, $uw } from "../../../utils/theme/functions";

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
							(item) => item
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
				pets[active]?.main_picture?.main_color?.color ??
				"var(--ion-color-primary)"
			}
			contrast={
				pets[active]?.main_picture?.main_color?.contrast ??
				"var(--ion-color-white)"
			}
		>
			<BoxContainer>
				<PetsBox className="pet-box" direction={direction}>
					{pets.map((pet, i) => (
						<Image2x
							id={pet.main_picture!.id}
							key={i}
							alt={`${pet.name} picture`}
							className={`${i == prev ? "deactivated" : ""} ${
								i == active ? "active" : ""
							}`}
						/>
					))}
				</PetsBox>
				<ActionChip className="top left" onClick={() => modalOpen()}>
					<Icon name="peopleOutline" color="var(--ion-color-dark)" />
					<span>{"Affidatari"}</span>
				</ActionChip>
				<ActionChip className="top right">
					<Icon name="bookOutline" color="var(--ion-color-dark)" />
					<span>{"Libretto"}</span>
				</ActionChip>
				<ActionChip className="bottom left">
					<Icon
						name="informationCircleOutline"
						color="var(--ion-color-dark)"
					/>
					<span>{"Profilo"}</span>
				</ActionChip>
				<ActionChip className="bottom right" onClick={() => share()}>
					<Icon
						name="shareOutline"
						color="var(--ion-color-dark)"
						mode="md"
					/>
					<span>{"Share"}</span>
				</ActionChip>
			</BoxContainer>

			{pets && pets.length && <Title>{pets[active].name}</Title>}

			<DotsContainer>
				{pets &&
					pets.length &&
					pets.map((pet, i) => (
						<PetDot
							key={i}
							className={`pet-dot ${i == active ? "active" : ""}`}
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
	margin-bottom: 60px;
	flex-direction: column;
	box-sizing: border-box;
	position: relative;
	align-items: center;
	padding-top: 10px;
	> * {
		> * {
			transition: color 1s ease-in, background-color 1s ease-in;
			color: ${({ contrast }) =>
				contrast ? contrast : "var(--ion-color-primary)"};
			background-color: ${({ mainColor }) =>
				mainColor ? mainColor : "var(--ion-color-primary)"};
			&::after {
				transition: color 1s ease-in, background-color 1s ease-in;
				color: ${({ contrast }) =>
					contrast ? contrast : "var(--ion-color-primary)"};
				background-color: ${({ mainColor }) =>
					mainColor ? mainColor : "var(--ion-color-primary)"};
			}
			&.pet-box {
				transition: color 1s ease-in, background-color 1s ease-in;
				border: 3px solid var(--ion-background-color);
				background-color: ${({ mainColor }) =>
					mainColor ? mainColor : "var(--ion-color-primary)"};
			}
		}
	}
	> h2 {
		transition: color 1s ease-in, background-color 1s ease-in;
		color: ${({ contrast }) =>
			contrast ? contrast : "var(--ion-color-primary)"};
		background-color: ${({ mainColor }) =>
			mainColor ? mainColor : "var(--ion-color-primary)"};
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
	height:${$uw(13)};
    padding: ${$uw(.4)} 0;
	box-sizing: border-box;
	position: relative;
	z-index: 0;
    margin: ${$cssTRBL(5, 0 ,2, 0)};
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
    margin-bottom:${$uw(.3)};
	align-items: center;
	gap: 12px;
	z-index: 2;
	font-size: 2.1rem;
	padding: 0 12px;
	${$break_point(420)} {
		
		font-size: 1.7rem;
	}
	${$break_point(380)} {
		
		font-size: 1.6rem;
	}
	${$break_point(350)} {
		
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
    &.bottom{
        margin-bottom: 0;
    }

`;

const Title = styled.h2`
	padding: 0 ${$uw(2)};
	height: ${$uw(3)};
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: ${$uw(3)};
	margin-bottom: ${$uw(2)};
	text-transform: uppercase;
    ${$break_point(450)}{
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
	background-color: var(--ion-background-color);
	transition: padding 0.2s ease-out;
	&:after {
		display: flex;
		content: "";
		width: 100%;
		height: 100%;

		border-radius: 15px;
		border: 1px solid var(--ion-color-dark);
	}
	&.active::after {
		content: "";
		border: 2px solid var(--ion-color-dark);
	}
	&.active {
		padding: ${$uw(0.2)};
	}
`;
