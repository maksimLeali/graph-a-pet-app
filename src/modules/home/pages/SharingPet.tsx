import { useParams, useLocation } from "react-router-dom";

import styled from "styled-components"



type props = {
    
}

export const SharingPet: React.FC<props> = ()=>{
    const { code } = useParams<{ code: string }>();
    const location = useLocation()

    
    
    
    return <Container >

    </Container>
}

const Container = styled.div`

`