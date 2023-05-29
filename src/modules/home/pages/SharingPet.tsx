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

    const [checkCode] = useCheckCodeMutation({
        onCompleted: ({checkCode})=> {
            if(!checkCode?.code || checkCode.error){
                return
            }
            console.log('code ok')
            
            getPet({variables: {id: checkCode.code.ref_id}})
        }
    })
    
    const [getPet, ] = useGetPetLazyQuery ({
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
            {pet ? <ImageWrapper>
                {pet.main_picture? <Image2x id={pet.main_picture.id} /> : <></>}
            </ImageWrapper> : 
            <ImageWrapper className="skeleton"></ImageWrapper>
             }
                {pet ? 
            <NameBox >
                <span>{pet.name}</span> 
            </NameBox>
                : 
                <NameBox className="skeleton" />
            }
                
        </SharedBox>
    </Container>
}

const Container = styled.div`
    width: 100%;
    padding: 40px 24px ;
    box-sizing: border-box;
`

const SharedBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const ImageWrapper = styled.div`
    width:260px;
    aspect-ratio: 1/1;
    border: 2px solid var(--ion-color-primary);
    border-radius: 260px;
    margin-bottom: 20px;
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
    height: 40px;
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