import { useParams, useLocation } from "react-router-dom";

import styled from "styled-components"


type props = {
    
}

export const SharingPet: React.FC<props> = ()=>{
    const { id } = useParams<{ id: string }>();
    const location = useLocation()
    
    
    return <Container >

    </Container>
}

const Container = styled.div`

`