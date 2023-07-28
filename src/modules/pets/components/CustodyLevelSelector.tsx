import styled from "styled-components";
import { custodyLevelColors, enumKeys } from "../../../utils";
import { CustodyLevel } from "../../../types";
import { Chip, Icon } from "../../../components";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../contexts";
import { useCallback, useEffect, useState } from "react";

import { CustodyLevelsList } from "./";

type props = {
    current: CustodyLevel;
    onSelected: (v: CustodyLevel) => void;
};

export const CustodyLevelSelector: React.FC<props> = ({
    current,
    onSelected,
}) => {
    const { t } = useTranslation();
 
    const { openModal, closeModal } = useModal()

    const open = useCallback(() => {
        openModal({
            onClose: () => closeModal(),
            children: <CustodyLevelsList onClick={(v)=>{onSelected(v); closeModal()}}  current={current} />,
        });
    }, [current]);

    return (
        <Container onClick={()=> open()}>
            <p >{t('pets.accept_as')}</p>
            <Chip label={t(`pets.${current.toLocaleLowerCase()}`)} color={custodyLevelColors[current]} />
            <Icon size="24px" name="swapVertical" />
            <p dangerouslySetInnerHTML={{__html: t(`pets.desc_${current.toLocaleLowerCase()}` ) ?? '' }} />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 10px;
    padding: 12px;
    align-items: center;
    > p {
        margin: 0;
        color: var(--ion-color-dark);
        &:last-child{

            text-align:center ;
            width:100%;
        }
    }
    > div {
        &:nth-child(2){
            margin-left: auto;
        }
        &:nth-child(3){
            margin-right: auto;

        }
    }
`;