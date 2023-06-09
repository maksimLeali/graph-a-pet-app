import { useTranslation } from "react-i18next";
import { Maybe } from "../types";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated"
import styled from "styled-components";
import { MinAppointment } from "./";

type props = {
    appointments?: AppointmentFragment[] | Maybe<AppointmentFragment>[];
}

export const AppointmentsList: React.FC<props> =({appointments=[]})=> {
    const {t} = useTranslation()
    return <Container>
        {appointments.length > 0 
        ? appointments.map(appointment=> { return <MinAppointment key={appointment?.id} appointment={appointment}/>})
        : <span dangerouslySetInnerHTML={{__html: t('events.general.no_events')}} /> }  
    </Container>
}

const Container = styled.div`
    width:100%;
    display:flex;
    flex-direction: column;
    padding: 20px 12px;
    align-items:center;
`