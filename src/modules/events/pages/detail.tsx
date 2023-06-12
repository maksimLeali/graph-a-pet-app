import { useEffect } from "react";
import styled from "styled-components"
import { useUserContext } from "../../../contexts";
import { useParams } from "react-router";

type props = {

}

export const EventDetails: React.FC<props> = ()=> {
    const { id } = useParams<{ id: string }>();

    const { setPage } = useUserContext();
      
    useEffect(() => {
        console.log(id)
        setPage({ visible: false, name: "Events detail" });
    
    }, []);


    return <Container>
        

    </Container>
}

const Container = styled.div`
    
`