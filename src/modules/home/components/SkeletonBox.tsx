import styled from "styled-components"

export const SkeletonBox: React.FC = ()=> {
    return <MainContainer>
        <ChoiseContainer>
            <SkeletonChoise className="skeleton"/>
            <SkeletonChoise className="skeleton"/>
            <SkeletonImgBox className="skeleton"/>
        </ChoiseContainer>
         <SkeletonTitle className="skeleton"/>
         <SkeletonDot className="skeleton"/>

    </MainContainer>

}

const MainContainer = styled.div`
width: 100%;
height: 440px;
display: flex;
padding-top:10px;
flex-direction: column;

`

const ChoiseContainer = styled.div`
    width: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    margin-top:50px;
    padding: 20px 0;

`

const SkeletonChoise = styled.div`
    width: 100%;
    height: 90px;
    background-color : var(--ion-color-medium) ;
    margin-bottom: 3px;
    @media only screen and (max-width: 420px) {
        height: 75px;

    }
    @media only screen and (max-width: 380px) {
        height: 65px;
    }
    @media only screen and (max-width: 350px) {
        height: 55px;
    }
    `
const SkeletonImgBox = styled.div`
    width: 200px;
    aspect-ratio: 1/1;
    position: absolute;
    background-color : var(--ion-color-medium) ;
    border: 3px solid var(--ion-background-color);
    border-radius:200px;
    inset: 0;
    margin:auto;
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

const SkeletonTitle = styled.div`
    align-self: center;
    width:120px;
    height: 40px;
    margin-top: 20px;
    background-color : var(--ion-color-medium) ;
    border-radius: 4px;
    margin-bottom: 60px;
`

const SkeletonDot = styled.div`
    align-self: center;
    width: 30px;
    aspect-ratio: 1/1;
    background-color:  var(--ion-color-medium-tint) ;
    border-radius: 30px;
    border: 2px solid var(--ion-color-light);
`

