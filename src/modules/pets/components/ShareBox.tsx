import { IonButton } from "@ionic/react";
import { t } from "i18next";
import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { CustodyLevelSelector } from ".";
import { CustodyLevel } from "../../../types";

type props = {
    onConfirm :(v: CustodyLevel)=> void,

}

export const ShareBox: React.FC<props> = ({onConfirm})=> {
    const [custodyLevel, setCustodyLevel] = useState<Exclude<CustodyLevel, CustodyLevel.Owner>>(CustodyLevel.SubOwner)
    const history = useHistory()
    return <ShareBoxContainer>
    <CustodyLevelSelector current={custodyLevel} onSelected={(v)=> { console.log('selected:', v) ;setCustodyLevel(v as Exclude<CustodyLevel, CustodyLevel.Owner> )}} />
    <ActionContainer>
        <IonButton
            color="danger"
            fill="outline"
            onClick={() => {history.push('/home')}}
        >
            {t("actions.refuse")}
        </IonButton>
        <IonButton color="primary" onClick={() => onConfirm(custodyLevel)}>
            {t("actions.accept")}
        </IonButton>
    </ActionContainer>
</ShareBoxContainer>
}

const ShareBoxContainer = styled.div`
    width: calc(100% - 24px);
    border-radius: 40px 30px 0 0;
    background-color: var(--ion-color-light);
    position: absolute;
    bottom: 80px;
    left: 12px;
    display: flex;
    flex-direction: column;
    padding: 10px 12px 30px;
    box-sizing: border-box;
    justify-content: space-between;
    @media( max-height: 700px){
        position: sticky;
        width: 100%;
        bottom: 0;
        
    }
`;
const ActionContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;