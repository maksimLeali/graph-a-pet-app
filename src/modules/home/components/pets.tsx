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
                        <Icon name="shareOutline" color='var(--ion-color-dark)' />
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
    padding-top: 80px;
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
    &.left{
        justify-content: start;
    }
    &.right{
        justify-content: end;
        flex-direction: row-reverse
    }
    &.top.right {
        top: 24%;
        right: 0;
        @media only screen and (max-width: 420px) {
            
        }
        @media only screen and (max-width: 380px) {
            
        }
        @media only screen and (max-width: 350px) {
            
        }
    }
    &.top.left {
        left: 0;
        top: 24%;
        @media only screen and (max-width: 420px) {
            
        }
        @media only screen and (max-width: 380px) {
            
        }
        @media only screen and (max-width: 350px) {
            
        }
    }
    &.bottom.right {
        right: 0;
        top: calc(24% + 93px);
        @media only screen and (max-width: 420px) {
            
        }
        @media only screen and (max-width: 380px) {
            
        }
        @media only screen and (max-width: 350px) {
            
        }
    }
    &.bottom.left {
        top: calc(24% + 93px);
        left: 0;
        @media only screen and (max-width: 420px) {
        @media only screen and (max-width: 380px) {
        @media only screen and (max-width: 350px) {
    }
    @media only screen and (max-width: 420px) {
        height: 75px;
    }
    @media only screen and (max-width: 380px) {
        height: 65px;
    }
    @media only screen and (max-width: 350px) {
    
        width: 55px;
    }
`;

const Title = styled.h1`
    padding: 4px 30px;
    border-radius: 4px;
    width: fit-content;
    text-transform: uppercase;
`;
