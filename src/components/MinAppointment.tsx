import styled from "styled-components"
import { Maybe } from "../types"
import { AppointmentFragment } from "./operations/__generated__/appointment.generated"


type props ={
    appointment : AppointmentFragment| Maybe<AppointmentFragment>
}

export const MinAppointment: React.FC<props> = ({appointment})=> {
    return <Container>
        
        <span>{appointment?.name}</span>
    </Container>
}

const Container = styled.div`
    width: 100%;
`