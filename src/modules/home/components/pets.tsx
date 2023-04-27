import styled from "styled-components";
import { Icon, Image2x } from "../../../components";
import { FastAverageColor } from "fast-average-color";
import { useCallback, useEffect, useState } from "react";
import { config } from "../../../config";

export const Pets: React.FC = () => {
    const [avgColor, setAvgColor] = useState<string>();
    const fac = new FastAverageColor();

    useEffect(() => {
        fac.getColorAsync(
            `${config.baseUrl?.replace(
                "graphql",
                "media"
            )}/${"0de0273b-d389-4df7-b317-9a7675c3a4ed"}`
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
                            <Image2x id="0de0273b-d389-4df7-b317-9a7675c3a4ed" />
                        </PetsBox>
                        <ActionChip className="top left">
                            <Icon size="20px" name="bookOutline" color='var(--ion-color-dark)' />
                            <span>
                                {"Libretto"}
                            </span>
                        </ActionChip>
                        <ActionChip className="top right">
                        <Icon size="20px" name="calendarNumberOutline" color='var(--ion-color-dark)' />
                            <span>
                            {"Eventi"}
                            </span>
                        </ActionChip>
                        <ActionChip className="bottom left">
                        <Icon size="20px" name="informationCircleOutline" color='var(--ion-color-dark)' />
                            <span>
                            {"Profilo"}
                            </span>
                        </ActionChip>
                        <ActionChip className="bottom right">
                        <Icon size="20px" name="shareOutline" color='var(--ion-color-dark)' />
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
                border: 3px solid
                    ${({ mainColor }) =>
                        mainColor ? mainColor : "var(--ion-color-primary)"};
            }
        }
    }
    > h1 {
        background-color: ${({ mainColor }) =>
            mainColor ? mainColor : "var(--ion-color-primary)"};
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
    width: 50px;
    aspect-ratio: 1;
    display: flex;
    border-radius: 99px;
    
    flex-direction:column;
    align-items: center;
    font-size: .8rem;
    &.top.right {
        top: 10px;
        right: 20%;
    }
    &.top.left {
        left: 20%;
        top: 10px;
    }
    &.bottom.right {
        right: 10px;
        bottom: 40%;
    }
    &.bottom.left {
        bottom: 40%;
        left: 10px;
    }
    @media only screen and (max-width: 420px) {
        width: 90px;
    }
    @media only screen and (max-width: 390px) {
        font-size: 0.9rem;
        width: 75px;
    }
    @media only screen and (max-width: 350px) {
        width: 70px;
    }
`;

const Title = styled.h1`
    padding: 4px 30px;
    border-radius: 4px;
    width: fit-content;
    text-transform: uppercase;
`;
