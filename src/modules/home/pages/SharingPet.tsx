import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import styled from "styled-components"
import { useUserContext } from "../../../contexts";
import { useTranslation } from "react-i18next";
import { Image2x } from "../../../components";
import { useCheckCodeMutation } from "../operations/__generated__/checkCode.generated";
import { useGetPetLazyQuery, useGetPetQuery } from "../operations/__generated__/getSinglePet.generated";
import { Pet } from "../../../types";
import { MinPetFragment } from "../operations/__generated__/minPet.generated";



type props = {
    
}

export const SharingPet: React.FC<props> = ()=>{
    const { code } = useParams<{ code: string }>();
    const location = useLocation()
    const [pet,setPet] = useState<MinPetFragment>()
    const { t } = useTranslation()
    const { setPage } = useUserContext()
    useEffect(()=> {
        setPage({ name: t("pages.pet_sharing")})
        checkCode({variables: {code}})
    }, [])

    const [checkCode, {loading : checkLoading}] = useCheckCodeMutation({
        onCompleted: ({checkCode})=> {
            if(!checkCode?.code || checkCode.error){
                return
            }
            console.log('code ok')
            
            getPet({variables: {id: checkCode.code.ref_id}})
        }
    })
    
    const [getPet, {loading: getPetLoading}] = useGetPetLazyQuery ({
        onCompleted:({getPet})=> {
            if(!getPet?.pet || getPet.error ){
                return
            }
            setPet(getPet.pet)

            console.log(getPet.pet)
        }
    })
    
    
    return <Container >
        <SharedBox>
            <MainPetContainer>

            <ImageWrapper className={`${getPetLoading ||checkLoading? 'skeleton' : ''}`}>
                {!(getPetLoading || checkLoading)&& pet?.main_picture? <Image2x id={pet?.main_picture.id} /> : <FillBox></FillBox>}
            </ImageWrapper>    
            <NameBox className={`${getPetLoading ||checkLoading? 'skeleton' : ''}`} >
                {pet && <span>{pet.name}</span> }
            </NameBox>
            </MainPetContainer>
            <InfoBox className="info1">
                <span>Pet</span>
                <InfoChip className={`${getPetLoading ||checkLoading? 'skeleton' : ''}`}>
                    {pet && <span>{pet.body.family}</span> }
                </InfoChip>
            </InfoBox>
            <InfoBox className="info2">
                <span>Gender</span>
                <InfoChip className={`${getPetLoading ||checkLoading? 'skeleton' : ''}`}>
                    {pet && <span>{pet.gender}</span> }
                </InfoChip>
            </InfoBox>
            <InfoBox className="info3">
                <span>TEST</span>
                <InfoChip className={`${getPetLoading ||checkLoading? 'skeleton' : ''}`}>
                    {pet && <span>{pet.weight_kg} Kg</span> }
                </InfoChip>
            </InfoBox>
            
        </SharedBox>
    </Container>
}

const Container = styled.div`
    width: 100%;
    padding: 20px 12px ;
    box-sizing: border-box;
`

const SharedBox = styled.div`
    display: grid;
    grid-template-columns: repeat(2,1fr);
    grid-template-rows: repeat(4, 80px);
`

const MainPetContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    grid-row-start: 1;
    grid-row-end: 4;
    grid-column: 1;
    
    
`

const ImageWrapper = styled.div`
    width:100%;
    aspect-ratio: 1/1;
    border: 2px solid var(--ion-color-primary);
    border-radius: 260px;
    margin-bottom: 20px;
    overflow-y: hidden;
    > .img2x {
        width:100%;
        height:100%;
    }
    &.skeleton{
        border: 0;
    }
`

const NameBox = styled.div`
    min-width: 80px;
    height: 30px;
    padding: 5px 12px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: var(--ion-color-primary);
    display:flex;
    align-items: center;
    justify-content: center;
    > span {
        text-transform: uppercase;
        font-weight: 600;
    }
`

const FillBox = styled.span`
    width: 100%;
    height: 100%;
    background-color: var(--ion-color-primary);
`
const InfoBox = styled.div`
    
    grid-column: 2;
    padding: 10px 12px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-self: center;
    justify-content: flex-end;
    gap: 10px;
    > span {
        text-align: center;
        color: var(--ion-color-dark)
    }
    &.info1 {
        align-self: flex-start;
        grid-row: 1 ;
    }
    &.info2 {
        align-self: center;
        grid-row: 2 ;
    }
    &.info3 {
        grid-row: 3 ;
    }
`

const InfoChip = styled.span`
    width: 100%;
    padding: 5px;
    height: 30px;
    border-radius: 4px;
    background-color: var(--ion-color-primary);
    color: var(--ion-color-light)!important;
    .dark &{
        color: var(--ion-color-dark)!important;
        
    }
    
`