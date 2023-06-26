import { useTranslation } from "react-i18next";
import { Maybe } from "../types";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated"
import styled from "styled-components";
import { MinAppointment } from "./";

type props = {
    appointments?: AppointmentFragment[] | Maybe<AppointmentFragment>[];
    loading?: boolean
}

export const AppointmentsList: React.FC<props> =({appointments=[], loading= false})=> {
    const {t} = useTranslation()
    return <Container>
        {loading && <SkeletonMinAppointment  > 
            <SkeletonIcon className="skeleton"/> 
            <SkeletonTextes>
                
                <SkeletonP className="skeleton title" />
                <SkeletonP className="skeleton"/>
            </SkeletonTextes>
            <SkeletonTag className="skeleton"/>
        </SkeletonMinAppointment> }
        {appointments.length > 0 && appointments.map(appointment=> { return <MinAppointment key={appointment?.id} appointment={appointment}/>}) }
        { !loading && !appointments.length &&  <span dangerouslySetInnerHTML={{ __html: t('events.general.no_events') ?? ''} } /> }  
    </Container>
}

const Container = styled.div`
    border: 1px solid #fa0;
    width:100%;
    display:flex;
    flex-direction: column;
    padding: 20px 12px;
    align-items:center;
`

const SkeletonMinAppointment = styled.div`
    width: calc(100% - 40px);
    height: 50px;
    display:flex;
    padding: 10px;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    
`

const SkeletonIcon= styled.div`
    width: 38px;
    height: 38px;
    border-radius: 50px;;
`

const SkeletonTextes= styled.div`
    width: calc(100% - 150px);
    display:flex;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
    height:100%;
    
`

const SkeletonP= styled.div`
    height: 10px;
    width: 100%;
    &.title {
        
        width: 120px;
        height: 16px;
    }
`

const SkeletonTag= styled.div`
    width: 80px;
    height: 26px;
    border-radius: 20px;
`
