import { t } from "i18next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Chip } from "../../../components";
import { CustodyLevel } from "../../../types";
import { custodyLevelColors, enumKeys } from "../../../utils";
import _, { indexOf } from "lodash";
import { useTranslation } from "react-i18next";

type props = {
    current: CustodyLevel;
    onClick: (v: CustodyLevel)=> void
}
export const CustodyLevelsList:React.FC<props> = ({ onClick, current})=> {
    const clKeys = enumKeys(CustodyLevel);
    clKeys.splice(_.indexOf(clKeys, 'Owner'),_.indexOf(clKeys, 'Owner'));
    const [tempSelected, setTempSelected] = useState<CustodyLevel>(current)
    const { t } = useTranslation();
 
    return (
   <ChipsContainer >
        {clKeys.map((cl)=> <Chip invert={CustodyLevel[cl] != tempSelected} key={cl} onClick={()=>{{setTempSelected(CustodyLevel[cl]); onClick(CustodyLevel[cl])};}} label={t(`pets.${cl.toLocaleLowerCase()}`)} color={custodyLevelColors[CustodyLevel[cl]]} />)}
    </ChipsContainer>
)}

const ChipsContainer = styled.div`
       width: 100%;
    display: flex;
    justify-content: space-around;
    gap: 20px;
    flex-wrap: wrap;
    padding: 10px 30px;
    box-sizing:border-box;
    
`