import styled from "styled-components";
import { Icon, Image2x } from "../../../components";
import { FastAverageColor } from "fast-average-color";
import { useCallback, useEffect, useState } from "react";
import { config } from "../../../config";
import { Maybe } from "graphql/jsutils/Maybe";
import { DashboardPetFragment } from "../operations/__generated__/dashboardPet.generated";


type props ={
    pets: DashboardPetFragment[]
}

export const Pets: React.FC<props> = ({pets}) => {
    
    const [active, setActive ]= useState(0)
    const [prev, setprev ]= useState(0)
    const [direction, setDirection] = useState<'clock' | 'counter'>('clock')
   useEffect(()=>{
    console.log(pets)
   }, [pets])

   const changeMain = (i: number)=> {
    if(i !== active){
        setprev(active)
        setDirection(i < active ? 'counter' : 'clock' )
        setActive(i)
        
    }
   }

    return (
        
        <PetsContainer mainColor={pets[active]?.main_picture?.main_color?.color ?? 'var(--ion-color-primary)'} contrast={pets[active]?.main_picture?.main_color?.color ??'var(--ion-color-white)'}> 
            <BoxContainer> 
                    <PetsBox className="pet-box" direction={direction}>
                        {pets.map((pet, i)=>(
                        <Image2x id={pet.main_picture!.id} className={`${i==prev? 'deactivated' : ''} ${i == active ? 'active' : ''}`}/>
                        ))}
                    </PetsBox>
                <ActionChip className="top left">
                    <Icon name="bookOutline" color='var(--ion-color-dark)' />
                    <span>
                        {"Libretto"}
                    </span>
                </ActionChip>
                <ActionChip className="top right">
                <Icon name="calendarNumberOutline" color='var(--ion-color-dark)' />
                    <span>
                    {"Eventi"}
                    </span>
                </ActionChip>
                <ActionChip className="bottom left">
                <Icon name="informationCircleOutline" color='var(--ion-color-dark)' />
                    <span>
                    {"Profilo"}
                    </span>
                </ActionChip>
                <ActionChip className="bottom right">
                <Icon name="shareOutline" color='var(--ion-color-dark)' mode="md"/>
                    <span>
                    {"Share"}
                    </span>
                </ActionChip>
            </BoxContainer>
            
                {pets && pets.length && <Title>{pets[active].name}</Title>}

                
                    <DotsContainer>
                    { pets && pets.length && pets.map((pet, i)=> (
                        <PetDot className={`pet-dot ${i == active ?'active' : ''}`} onClick={()=> changeMain(i)}/>
                    )) }
                    </DotsContainer>
                
            
        </PetsContainer>
            
    
    );
};

const PetsContainer = styled.div<{ mainColor?: string, contrast?: string }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    align-items: center;
    padding-top: 10px;
    > * {
        > * {
            transition: color 1s ease-in, background-color 1s ease-in;
            color:  ${({ contrast }) =>
                contrast ? contrast : "var(--ion-color-primary)"};
            background-color: ${({ mainColor }) =>
                mainColor ? mainColor : "var(--ion-color-primary)"};
            &.pet-box {
                transition: color 1s ease-in, background-color 1s ease-in;
                border: 3px solid var(--ion-background-color);
                background-color: var(--ion-background-color);
            }
        }
    }
    > h1 {
        transition: color 1s ease-in, background-color 1s ease-in;
        color:  ${({ contrast }) =>
                contrast ? contrast : "var(--ion-color-primary)"};
        background-color: ${({ mainColor }) =>
            mainColor ? mainColor : "var(--ion-color-primary)"};
    }
    * {
        transition: color 1s ease-in, background-color 1s ease-in;
        color: #fff!important;
    }
`;
const BoxContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
`;
const PetsBox = styled.div<{direction?: 'clock' | 'counter' }>`
    width: 200px;
    margin: 40px 0 0 0;
    aspect-ratio: 1;
    z-index:3;
    position:relative;
    border-radius: 500px;
    overflow: hidden;
    display: flex;
    @media only screen and (max-width: 420px) {
        width: 170px;
    }
    @media only screen and (max-width: 380px) {
        width: 150px;
    }
    @media only screen and (max-width: 350px) {
        width: 120px;
    }
    overflow: hidden;
    > .img2x {
        width: 100%;
        height: 100%;
        position: absolute;
        top:-1000px;
        left: -0;
        &.deactivated {
            top:-1000px;
            left: -0;
            animation:  deactivate-${({direction})=> direction } 1.5s linear;
        }
        &.active{
                animation:activate-${({direction})=> direction } 1.5s linear;
                top:0;
                left: 0;
            }
        }
    
    
`;

const ActionChip = styled.span`
    position: absolute;
    width: 50%;
    height: 90px;
    display: flex;
    padding-bottom: 5px;
    align-items: center;
    gap: 12px;
    z-index: 2;
    font-size: 1.2rem;
    padding: 0 12px;
    @media only screen and (max-width: 420px) {
        height: 75px;
        gap: 8px;
        font-size: 1.1rem;
    }
    @media only screen and (max-width: 380px) {
        height: 65px;
        font-size: 1rem;
    }
    @media only screen and (max-width: 350px) {
        height: 55px;
        font-size: .9rem;
    }
    &.left{
        justify-content: start;
        left: 0;
    }
    &.right{
        right: 0%;
        justify-content: end;
        flex-direction: row-reverse
    }
    &.top{
        top: 24%;
        @media only screen and (max-width: 420px) {
            top: 28%
        }
        @media only screen and (max-width: 380px) {
            top: 30%

        }
        @media only screen and (max-width: 350px) {
            top: 32%;
        }
    }
    &.bottom{
        top: calc(24% + 93px);
        @media only screen and (max-width: 420px) {
            top: calc(28% + 79px);
            
        }
        @media only screen and (max-width: 380px) {
            top: calc(30% + 69px);
            
        }
        @media only screen and (max-width: 350px) {
            top: calc(32% + 59px);

        }
    }
   
    
`;

const Title = styled.h1`
    padding: 4px 30px;
    border-radius: 4px;
    width: fit-content;
    margin-bottom :80px;
    text-transform: uppercase;
`;


const DotsContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    padding: 0 20%;
    
`

const PetDot = styled.span`
    width: 22px;
    height: 22px;
    border-radius: 15px;
    
    border: 1px solid var(--ion-color-dark);
    &.active{
        
        border: 2px solid var(--ion-color-dark)
    }


`
