import { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { Chip } from "@components";
import { CustodyLevel } from "@types";
import { custodyLevelColors, enumKeys } from "@utils";
import { $cssTRBL } from "@theme";

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
    justify-content: space-between;
    
    flex-wrap: wrap;
    padding: ${$cssTRBL(0 , 2)};
    box-sizing:border-box;
    
`