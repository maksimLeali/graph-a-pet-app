import styled from "styled-components";
import { custodyLevelColors, enumKeys } from "../../../utils";
import { CustodyLevel } from "../../../types";
import { Chip, Icon } from "../../../components";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../contexts";
import { useCallback, useEffect } from "react";
import _, { indexOf } from "lodash";

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
    const clKeys = enumKeys(CustodyLevel);
    clKeys.splice(_.indexOf(clKeys, 'Owner'),_.indexOf(clKeys, 'Owner'));
    
    
    const open = useCallback(() => {
        openModal({
            onClose: () => closeModal(),
            children: (
               <ChipsContainer >
                    {clKeys.map((cl)=> <Chip invert={CustodyLevel[cl] != current} key={cl} label={t(`pets.${cl.toLocaleLowerCase()}`)} color={custodyLevelColors[CustodyLevel[cl]]} />)}
                </ChipsContainer>
            ),
        });
    }, []);

    return (
        <Container onClick={()=> open()}>
            <Chip label={t(`pets.${current.toLocaleLowerCase()}`)} color={custodyLevelColors[current]} />
            <Icon size="24px" name="create" />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    flex-wrap: wrap;
`;

const ChipsContainer = styled.div`
       width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    flex-wrap: wrap;
    padding: 0 30px;
`