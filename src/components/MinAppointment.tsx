import dayjs from "dayjs";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import { SpecialIconName, SpecialIcon } from "@components";
import { treatmentsColors } from "@utils";
import { AppointmentFragment } from "@graphql_generated/appointment.generated";
import { Maybe, TreatmentDuration } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";

type props = {
	appointment: AppointmentFragment | Maybe<AppointmentFragment>;
};

export const MinAppointment: React.FC<props> = ({ appointment }) => {
	const { t } = useTranslation();
	const translatedDuration: Record<TreatmentDuration, number> = {
		[TreatmentDuration.TenMinutes]: 10,
		[TreatmentDuration.QuarterHour]: 15,
		[TreatmentDuration.HalfHour]: 30,
		[TreatmentDuration.Hour]: 60,
		[TreatmentDuration.HourAndHalf]: 90,
		[TreatmentDuration.TwoHours]: 120,
		[TreatmentDuration.ThreeQuarter]: 45,
	};
	const element = useRef<HTMLAnchorElement>(null);
	useEffect(() => {
		gsap.fromTo(
			element.current,
			{ opacity: 0, y: -20 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: "expo.in",
			}
		);
	}, []);

	return (
		<Container
			to={`/events/${appointment?.id}`}
			aria-label={`${appointment?.name} ${appointment?.type}`}
			className="item-shadow"
			ref={element}
		>
			<IconWrapper className="icon-wrapper">
				<SpecialIcon
					name={
						appointment?.type?.toLocaleLowerCase() as SpecialIconName
					}
					color={treatmentsColors[appointment!.type]}
				/>
			</IconWrapper>
			<Body>
				<CustomSpan>
					<b>
						{t("events.from_to", {
							from: dayjs(appointment!.date).format("HH:mm"),
							to: dayjs(appointment!.date)
								.add(
									translatedDuration[
										appointment!.duration ??
											TreatmentDuration.HalfHour
									],
									"minutes"
								)
								.format("HH:mm"),
						})}
					</b>
				</CustomSpan>
				<CustomSpan>
					{t(`events.${appointment?.type.toLocaleLowerCase()}`)}:{" "}
					{appointment?.name}
				</CustomSpan>
			</Body>
			<PetName
				className="custom-pet-color"
				color={
					appointment?.health_card?.pet.main_picture?.main_color
						?.color
				}
			>
				{appointment?.health_card?.pet.name}
			</PetName>
		</Container>
	);
};

const Container = styled(Link)`
	width: ${$uw(28)};
	height: ${$uw(5)};
	position: relative;
	margin-bottom: 20px;
	box-sizing: border-box;
	display: flex;
	border-radius: 10px;
	opacity: 0;
	padding: ${$cssTRBL(0.5, 1)};
	align-items: center;
	text-decoration: none;
	background-color: ${$color("light-tint")};
	
	justify-content: space-between;
`;

const Body = styled.div`
	width: 100%;

	height: 100%;
	border-radius: 0 0 2px 2px;

	/* border-radius: 0 0 5px 5px; */
	font-weight: 400;

	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: relative;
	margin-left: 12px;
	justify-content: space-evenly;
`;

const CustomSpan = styled.span`
	font-size: 1.4rem;
	color: ${$color("dark")};
`;

const PetName = styled.span<{ color?: string }>`
	padding: 3px 12px;
	color: ${$color("light")};
	border-radius: 20px;
	font-weight: 600;
	font-size: 1.7rem;
	.dark & {
		color: ${$color("dark")};
	}
	background-color: ${({ color }) => $color(color ?? "primary")};
`;

const IconWrapper = styled.div`
	width: ${$uw(3.5)};
	padding: ${$cssTRBL(.5)};
	aspect-ratio: 1;
	border-radius: 80px;
	display: flex;
	z-index: 1;

	border: 1px solid ${$color("light-shade")};

	box-sizing: border-box;
	align-items: center;

	justify-content: center;
	> * {
		width: 100%;
	}
`;
