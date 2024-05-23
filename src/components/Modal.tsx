import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

import { $color, $cssTRBL, $uw } from "@theme";
import { Icon, } from "@components";
import { useOnClickOutside } from "@hooks";


export type ModalProps = {
    open?:boolean
    onClose: () => void;
    onCancel?: () => void;
    onConfirm?: () => void;
    bgColor?: string;
    txtColor?: string;
    children?: React.ReactNode ;
    customActions?: {
        action: () => void;
        txtColor?: string;
        bgColor?: string;
        text: string;
    }[];
}

export const Modal: React.FC<ModalProps> = ({
    open= false,
    onClose,
    onCancel,
    onConfirm,
    bgColor = "light",
    txtColor = "dark",
    children,
    customActions = [],
}) => {
    const { t } = useTranslation();
    const [inited, setInited] = useState(false)
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, ()=>onClose() );

    useEffect(()=> {
        if(open && ! inited){
            setInited(true)
        }
    }, [open])
    return (
        <ModalBg
            className={`ModalBg ${open ? 'open' : ''} ${inited ? 'inited' : ''}`}
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
                        color="medium"
                        onClick={()=>onClose()}
                    />
                </CloseContainer>
                {children}
                <Actions>
                    {onCancel !== null && onCancel !== undefined && (
                        <IonButton color="danger" fill="outline" onClick={onCancel}>
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
    height:0;
    background-color: ${$color('trasparent-bg')};
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    opacity: 0;
    top: 0;
    left: 0;
    transition: opacity .5s ease-in-out;
    box-sizing: border-box;
    &.inited {
        animation: overMenuClose .5s ease-in-out;
    }
    &.open {
        animation: overMenuOpen .5s ease-in-out;
        z-index: 202;
        opacity:1;
        height: 100dvh;
    }
`;

const ModalBox = styled.div<{ bgColor: string; txtColor: string }>`
    max-width: var(--max-width);
    width: 100%;
    max-height:90dvh;
    border-radius: 4px;
    color: ${({ txtColor }) => $color(txtColor)};
    background-color: ${({ bgColor }) => $color(bgColor)}!important;
    padding: ${$cssTRBL(2, 0)};
`;

const CloseContainer = styled.div`
    width: 100%;
    height: fit-content;
    height: ${$uw(2)};
    margin-bottom: ${$uw(2)};
    padding: ${$cssTRBL(0,2)};
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    > * {
        width: ${$uw(2)};
        height: ${$uw(2)};
    }
`;

const CustomIonButton = styled(IonButton)<{ txtColor?: string }>`
    color: ${({ txtColor }) => $color( txtColor ?? "light")};
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${$cssTRBL(0,2)};
    > *:first-child {
        justify-self: flex-start;
    }
`;
