import dayjs from "dayjs";
import styled from "styled-components";
import { Maybe, TreatmentDuration } from "../types";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { SpecialIcon } from "./SpecialIcons";
import { SpecialIconName } from "./SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
        <Container to={`/events/${appointment?.id}`}  aria-label={`${appointment?.name} ${appointment?.type}`} className="item-shadow"
        >
            <IconWrapper
                className="icon-wrapper"
            >
                <SpecialIcon
                    name={
                        appointment?.type.toLocaleLowerCase() as SpecialIconName
                    }
                    color={treatmentsColors[appointment!.type]}
                />
            </IconWrapper>
            <Body>
                <CustomSpan><b>{t("events.from_to", {from: dayjs(appointment!.date).format("HH:mm"), to: dayjs(appointment!.date).add(translatedDuration[appointment!.duration ?? TreatmentDuration.HalfHour], "minutes" ).format("HH:mm")},)}</b></CustomSpan>
                <CustomSpan>{t(`events.${appointment?.type.toLocaleLowerCase()}`)}: {appointment?.name}</CustomSpan>
            </Body>
            <PetName color={appointment?.health_card?.pet.main_picture?.main_color?.color}>
                {appointment?.health_card?.pet.name}
            </PetName>
           
        </Container>
    );
};

const Container = styled(Link)`
    width: calc(100% - 40px);
    height: 60px;
    position: relative;
    margin-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    border-radius: 10px;
    padding: 10px 10px;
    align-items: center;
    text-decoration: none;
    background-color: var(--ion-color-light-shade);
    background-color: var(--ion-color-light-tint);
    justify-content: space-between;
    



`;



const Body = styled.div`
    width: 100%;
    /* width: calc(100% - 40px); */
    height: 46px;
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
    font-size: 1.2rem;
    color: var(--ion-color-dark);
`;

const PetName = styled.span<{color?: string}>`
    padding: 3px 12px;
    color: var(--ion-color-light);
    border-radius: 20px;
    font-weight: 600;
    font-size: 1.7rem;
    .dark &{
        color: var(--ion-color-dark);
    }
    background-color: ${({color})=> color ? color : 'var(--ion-color-primary)'};

`

const IconWrapper = styled.div`
    width: 46px;
    aspect-ratio: 1;
    border-radius: 80px;
    display: flex;
    z-index: 1;
    padding: 10px;
    background-color: var(--ion-color-light-tint);
    background-color: var(--ion-color-light-shade);
    box-sizing: border-box;
    align-items: center;

    justify-content: center;
    > * {
        width: 100%;
    }
`;

