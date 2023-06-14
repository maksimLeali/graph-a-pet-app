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
        [TreatmentDuration.TenMinutes] : 10, 
        [TreatmentDuration.QuarterHour] : 15, 
        [TreatmentDuration.HalfHour] : 30,
        [TreatmentDuration.Hour] : 60,
        [TreatmentDuration.HourAndHalf] : 90, 
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
            <CustomSpan>
                    {appointment?.health_card?.pet.name + ": "}
                    {t(`events.${appointment?.type.toLocaleLowerCase()}`)}
                </CustomSpan>
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
            
        </Container>
    );
};

const Container = styled.a<{ color?: string }>`
    width: calc(100% - 40px);
    position: relative;
    margin-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-decoration: none;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    .dark &{
        box-shadow:  rgba(220, 220, 220, 0.23) 0px 3px 6px;
    }
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
    height: 25px;
    width: 100%;
    display: flex;
    
    
    padding-bottom: 5px;
    padding-top: 5px;;
    border-radius: 2px 2px 0 0;
    justify-content: center;
    align-items: center;
`;

const Footer = styled(Heading)`
    border-radius: 0 0 2px 2px;
`

const Body = styled.div`
    width: 100%;
    /* width: calc(100% - 40px); */
    height: 46px;
    border-radius: 0 0 2px 2px;
    border: 1px solid;
    /* border-radius: 0 0 5px 5px; */
    font-weight: 400;
    display: flex;
    align-items: center;
    position: relative;
    
    justify-content: center;
`;



const CustomSpan = styled.span`
    font-size: 1rem;
    font-weight: 600;
    color: var(--ion-color-dark);
`;

const IconWrapper = styled.div<{ borderColor: string }>`
    width: 24px;
    aspect-ratio: 1;
    border-radius: 80px;
    display: flex;
    left: 15px;
    position: absolute;
    
    z-index: 1;
    top: 36px;
    background-color: var(--ion-background-color);
    
    border-color: ${ ({borderColor})=> {return borderColor} } ;
    
    box-sizing: border-box;
    align-items: center;
    > * {
        width: 100%;
    }
`;

