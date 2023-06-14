import { useEffect, useState } from "react";
import styled from "styled-components"
import { useUserContext } from "../../../contexts";
import { useParams } from "react-router";
import { useGetTreatmentLazyQuery } from "../operations/__generated__/getAppointment.generated";
import { FullTreatmentFragment } from "../../../components/operations/__generated__/fullTreatment.generated";
import { IonHeader } from "@ionic/react";

type props = {

}

export const EventDetails: React.FC<props> = ()=> {
    const { id } = useParams<{ id: string }>();

    const { setPage } = useUserContext();
    const [event,setEvent] = useState<FullTreatmentFragment>();

    const [getEvent, {loading}] = useGetTreatmentLazyQuery({
        onCompleted:({getTreatment})=> {
            if(!getTreatment?.treatment || getTreatment.error){
                return
            }
            setEvent(getTreatment.treatment)
            console.log(getTreatment.treatment)
        }
    })
    useEffect(() => {
        console.log(id)
        setPage({ visible: false, name: "Events detail" });
        getEvent({variables:{id}})
    }, []);


    return <Container>
        <IonHeader>
            
        </IonHeader>
    </Container>
}

const Container = styled.div`
    
`

