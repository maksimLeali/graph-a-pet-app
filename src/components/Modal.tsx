import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Icon } from ".";
import { useOnClickOutside } from "../hooks";
import { useRef } from "react";
type props = {
    onClose: () => void;
    onCancel?: () => void;
    onConfirm?: () => void;
    bgColor?: string;
    txtColor?: string;
    children: React.ReactNode;
    customActions?: [
        {
            action: () => void;
            txtColor?: string;
            bgColor?: string;
            text: string;
        }
    ];
};

export const Modal: React.FC<props> = ({
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
    useOnClickOutside(ref, onClose);

    return (
        <ModalBg onClick={(e)=> {e.preventDefault(); e.stopPropagation()}}>
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
                        onClick={onClose}
                    />
                </CloseContainer>
                {children}
                <Actions>
                    {onCancel !== null && onCancel !== undefined && (
                        <IonButton color="danger" onClick={onCancel}>
                            {t("actions.cancel")}
                            <Icon name="closeCircleOutline" color={txtColor} />
                        </IonButton>
                    )}
                    {customActions.map((customAction) => (
                        <CustomIonButton
                            color={customAction.bgColor}
                            txtColor={customAction.txtColor}
                            onClick={() => customAction.action}
                        >
                            {customAction.text}
                        </CustomIonButton>
                    ))}
                    {onConfirm !== null && onConfirm !== undefined && (
                        <IonButton color="primary" onClick={onConfirm}>
                            {t("actions.confirm")}
                            <Icon name="closeCircleOutline" color={txtColor} />
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
    background-color: #2b2b2b88;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    top: 0;
    left: 0;
    padding: 40px 10px;
    
    box-sizing: border-box;
`;

const ModalBox = styled.div<{ bgColor: string; txtColor: string }>`
    max-width: 460px;
    width: 100%;
    border-radius: 4px;
    color: ${({ txtColor }) => txtColor};
    background-color: ${({ bgColor }) => bgColor}!important;
    
`;

const CloseContainer = styled.div`
    width: 100%;
    height: fit-content;
    padding: 10px 5px;
    display: flex;
    justify-content: flex-end;
`;

const CustomIonButton = styled(IonButton)<{ txtColor?: string }>`
    color: ${({ txtColor }) => txtColor ?? "var(--ion-color-light)"};
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 20px ;
    > *:first-child {
        justify-self: flex-start;
    }
`;
