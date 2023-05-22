import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Icon, } from ".";
import { useOnClickOutside } from "../hooks";
import { useEffect, useRef, useState } from "react";


export type ModalProps = {
    open?:boolean
    onClose: () => void;
    onCancel?: () => void;
    onConfirm?: () => void;
    bgColor?: string;
    txtColor?: string;
    children?: React.ReactNode;
    customActions?: {
        action: () => void;
        txtColor?: string;
        bgColor?: string;
        text: string;
    }[];
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    onCancel,
    onConfirm,
    bgColor = "var(--ion-color-light)",
    txtColor = "var(--ion-color-dark)",
    children,
    customActions = [],
}) => {
    const { t } = useTranslation();
    
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, ()=>onClose() );
    return (
        <ModalBg
            className={`ModalBg ${open ? 'open' : ''}`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <ModalBox
                ref={ref}
                className="Modal"
                bgColor={bgColor}
                txtColor={txtColor}
            >
                <CloseContainer>
                    <Icon
                        name="close"
                        color="var(--ion-color-medium)"
                        onClick={()=>onClose()}
                    />
                </CloseContainer>
                {children}
                <Actions>
                    {onCancel !== null && onCancel !== undefined && (
                        <IonButton color="danger" onClick={onCancel}>
                            {t("actions.cancel")}
                        </IonButton>
                    )}
                    {customActions.map((customAction,i) => (
                        <CustomIonButton
                            key={i}
                            color={customAction.bgColor}
                            txtColor={customAction.txtColor}
                            onClick={() => customAction.action()}
                        >
                            {customAction.text}
                        </CustomIonButton>
                    ))}
                    {onConfirm !== null && onConfirm !== undefined && (
                        <IonButton color="primary" onClick={onConfirm}>
                            {t("actions.confirm")}
                        </IonButton>
                    )}
                </Actions>
            </ModalBox>
        </ModalBg>
    );
};

const ModalBg = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: var(--ion-trasparent-bg);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    opacity: 0;
    
    animation: overMenuClose .5s ease-in-out;
    top: 0;
    left: 0;
    padding: 40px 10px;
    transition: opacity .5s ease-in-out;
    box-sizing: border-box;
    &.open {
        animation: overMenuOpen .5s ease-in-out;
        z-index: 201;
        opacity:1;
    }
`;

const ModalBox = styled.div<{ bgColor: string; txtColor: string }>`
    max-width: var(--max-width);
    width: 100%;
    max-height:90vh;
    border-radius: 4px;
    color: ${({ txtColor }) => txtColor};
    background-color: ${({ bgColor }) => bgColor}!important;
`;

const CloseContainer = styled.div`
    width: 100%;
    height: fit-content;
    padding: 10px 5px;
    height: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
`;

const CustomIonButton = styled(IonButton)<{ txtColor?: string }>`
    color: ${({ txtColor }) => txtColor ?? "var(--ion-color-light)"};
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    > *:first-child {
        justify-self: flex-start;
    }
`;
