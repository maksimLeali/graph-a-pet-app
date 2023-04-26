import styled from "styled-components"


export const Pets: React.FC = ()=> {
    return <PetsContainer>
        <BoxContainer>

            <PetsBox />
            <ActionChip className="top left">
                {"Libretto"}
            </ActionChip>
            <ActionChip className="top right">
                {"Eventi"}
            </ActionChip>
            <ActionChip className="bottom left">
                {"Profilo"}
            </ActionChip>
            <ActionChip className="bottom right">
                {"Condividi"}
            </ActionChip>
        </BoxContainer>
        <Title>
            {"Brinola"}
        </Title>
        
    </PetsContainer>
}

const PetsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    align-items:center ;
    padding-top: 80px;
    
`
const BoxContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items:center ;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    
`
const PetsBox = styled.div`
    width: 200px;
    margin: 40px 0 0 0;
    aspect-ratio: 1;
    border-radius: 500px;
    background-color: #aaf ;
    @media only screen and (max-width: 420px) {
        width: 170px;
    }
    @media only screen and (max-width: 380px) {
        width: 150px;
    }
    @media only screen and (max-width: 350px) {
        width: 120px;
    }
`

const ActionChip = styled.span`
position:absolute;
background-color:#aaf;
width:90px;
display: flex;
border-radius: 4px ;
justify-content:center;
padding: 5px 0;
&.top.right{
    top: 10px;
    right: 20%;
}
&.top.left{
    left: 20%;
    top:10px;
}
&.bottom.right{
    right: 10px;
    bottom: 40%;
}
&.bottom.left{
    bottom: 40%;
    left:10px;
}
@media only screen and (max-width: 420px) {
    width: 90px;
}
@media only screen and (max-width: 390px) {
    font-size: .9rem;
    width:75px;
}
@media only screen and (max-width: 350px) {
    width: 70px;
}
    
`

const Title = styled.h1`
    padding: 4px 30px;
    border-radius: 4px ;
    width: fit-content;
    background-color: #aaf ;
`