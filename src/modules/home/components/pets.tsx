import styled from "styled-components";
import { Icon, Image2x } from "../../../components";
import { FastAverageColor } from "fast-average-color";
import { useCallback, useEffect, useState } from "react";
import { config } from "../../../config";

export const Pets: React.FC = () => {
    const [avgColor, setAvgColor] = useState<string>();
    const fac = new FastAverageColor();
    const id = 'd6bddfb3-36ad-4089-8b67-0f0aab43d054'
    useEffect(() => {
        fac.getColorAsync(
            `${config.baseUrl?.replace(
                "graphql",
                "media"
            )}/${id}`
        )
            .then((res) => {
                console.log(res);
                setAvgColor(res.hex);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <PetsContainer mainColor={avgColor}>
            {avgColor && (
                <>
                    <BoxContainer>
                        <PetsBox className="pet-box">
                            <Image2x id={id} />
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
                    <Title>{"rayetta"}</Title>
                </>
            )}
        </PetsContainer>
    );
};

const PetsContainer = styled.div<{ mainColor?: string }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    align-items: center;
    padding-top: 10px;
    > * {
        
        > * {
            background-color: ${({ mainColor }) =>
                mainColor ? mainColor : "var(--ion-color-primary)"};
            &.pet-box {
                border: 3px solid var(--ion-background-color);
            }
        }
    }
    > h1 {
        background-color: ${({ mainColor }) =>
            mainColor ? mainColor : "var(--ion-color-primary)"};
    }
    * {
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
const PetsBox = styled.div`
    width: 200px;
    margin: 40px 0 0 0;
    aspect-ratio: 1;
    z-index:3;
    border-radius: 500px;
    @media only screen and (max-width: 420px) {
        width: 170px;
    }
    @media only screen and (max-width: 380px) {
        width: 150px;
    }
    @media only screen and (max-width: 350px) {
        width: 120px;
    }
    > .img2x {
        width: 100%;
        height: 100%;
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
    text-transform: uppercase;
`;
