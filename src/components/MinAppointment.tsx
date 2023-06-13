import dayjs from "dayjs";
import styled from "styled-components";
import { Maybe, TreatmentDuration } from "../types";
import { Image2x } from "./Image2x";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { SpecialIcon } from "./SpecialIcons";
import { SpecialIconName } from "./SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../utils";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

type props = {
    appointment: AppointmentFragment | Maybe<AppointmentFragment>;
};

export const MinAppointment: React.FC<props> = ({ appointment }) => {
    const { t } = useTranslation();
    const translatedDuration: Record<TreatmentDuration, number> = {
        [TreatmentDuration.HalfHour] : 30,
        [TreatmentDuration.HourAndHalf] : 90, 
        [TreatmentDuration.QuarterHour] : 15, 
        [TreatmentDuration.TenMinutes] : 10, 
        [TreatmentDuration.TwoHours] : 120, 
        [TreatmentDuration.ThreeQuarter]: 45
    }

    return (
        <Container href={`/events/${appointment?.id}`}
            color={
                appointment?.health_card?.pet.main_picture?.main_color?.color
            }
        >
            <Heading className="heading">
                <PetName>
                    {appointment?.health_card?.pet.name + ": "}
                    {t(`events.${appointment?.type.toLocaleLowerCase()}`)}
                </PetName>
            </Heading>
            <Body className ="body">
            <CustomSpan>{appointment?.name}</CustomSpan>
            </Body>
            <Footer className="footer">
                <CustomSpan>{t("events.from_to", {from: dayjs(appointment!.date).format("HH:mm"), to: dayjs(appointment!.date).add(translatedDuration[appointment!.duration ?? TreatmentDuration.HalfHour], "minutes" ).format("HH:mm")},)}</CustomSpan>
            </Footer>
            <IconWrapper
                className="icon-wrapper"
                borderColor={treatmentsColors[appointment!.type]}
            >
                <SpecialIcon
                    name={
                        appointment?.type.toLocaleLowerCase() as SpecialIconName
                    }
                    color={treatmentsColors[appointment!.type]}
                />
            </IconWrapper>
            {/* <ImageWrapper className="image-wrapper">
            <Image2x id={appointment!.health_card!.pet.main_picture!.id} />
            </ImageWrapper> */}
            {/* <AppointmentTime>
                {dayjs(appointment!.date).format("HH:mm")}
            </AppointmentTime> */}
        </Container>
    );
};

const Container = styled.a<{ color?: string }>`
    width: 100%;
    position: relative;
    margin-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-decoration: none;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.65) 0px 5px 15px;
    .heading, .footer {
        > span, > p {

            color: var(--ion-color-light);
        }
        background-color: ${({color})=> color};
        /* background-color: var(--ion-color-light-shade); */
        .dark & {
            /* background-color: var(--ion-color-light-tint); */
            > span, > p {
                color: var(--ion-color-dark);
            }
        }
    }
    .body {
        background-color: var(--ion-background-color);
        border-color: var(--ion-color-light-shade);
        color: var(--ion-color-dark);
        .dark & {
            border-color: var(--ion-color-light-tint);
        }
    }
    .image-wrapper {
        border-color: ${({ color }) =>
            color ? color : "var(--ion-color-primary)"};
    }
`;

const Heading = styled.div`
    height: 40px;
    width: 100%;
    display: flex;
    padding-left: 50px;
    padding-right: 20px;
    padding-bottom: 5px;
    border-radius: 2px 2px 0 0;
    justify-content: space-between;
    align-items: flex-end;
`;

const Footer = styled.div`
    height: 25px;
    width: 100%;
    display: flex;
    padding-left: 50px;
    padding-right: 20px;
    padding-bottom: 2px;
    border-radius: 0 0 2px 2px;
    justify-content: space-between;
    align-items: flex-end;
`

const Body = styled.div`
    width: 100%;
    /* width: calc(100% - 40px); */
    height: 40px;
    border-radius: 0 0 2px 2px;
    border: 1px solid;
    /* border-radius: 0 0 5px 5px; */
    font-weight: 400;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 50px;
    justify-content: flex-start;
`;



const CustomSpan = styled.span`
    font-size: 1rem;
    color: var(--ion-color-dark);
`;

const IconWrapper = styled.div<{ borderColor: string }>`
    width: 30px;
    aspect-ratio: 1;
    border-radius: 80px;
    display: flex;
    left: 10px;
    position: absolute;
    bottom: 5px;
    z-index: 1;
    top: 45px;
    background-color: var(--ion-background-color);
    border: 1px solid;
    border-color: ${ ({borderColor})=> {return borderColor} } ;
    padding: 4px;
    box-sizing: border-box;
    align-items: center;
    > * {
        width: 100%;
    }
`;

const PetName = styled.p`
    font-size: 1.2rem;
    margin-right: 10px;
    font-weight: 600;
    margin: 0;
`;


const ImageWrapper = styled.div`
  width: 30px;
  aspect-ratio: 1;
  z-index: 2;
  border-radius: 40px;
  top: 40px;
  position: absolute;
  left: 13px;
  border: 2px solid;
`;
const AppointmentTime = styled.div`
    position: absolute;
    top: 18px;
    left: 14px;
    font-weight: 600;
    font-size: 0.8rem;
    color: var(--ion-color-dark);
`;
