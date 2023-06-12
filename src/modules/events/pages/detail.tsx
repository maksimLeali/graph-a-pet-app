import { useEffect } from "react";
import styled from "styled-components"
import { useUserContext } from "../../../contexts";
import { useParams } from "react-router";
import { useGetTreatmentLazyQuery } from "../operations/__generated__/getAppointment.generated";

type props = {

}

export const EventDetails: React.FC<props> = ()=> {
    const { id } = useParams<{ id: string }>();

    const { setPage } = useUserContext();
      
    const [getEvent, {loading}] = useGetTreatmentLazyQuery({
        onCompleted:({getTreatment})=> {
            if(!getTreatment?.treatment || getTreatment.error){
                return
            }
            console.log(getTreatment.treatment)
        }
    })
    useEffect(() => {
        console.log(id)
        setPage({ visible: false, name: "Events detail" });
        getEvent({variables:{id}})
    }, []);


    return <Container>


    </Container>
}

const Container = styled.div`
    
`