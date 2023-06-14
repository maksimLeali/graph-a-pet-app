import styled from "styled-components";
import { SubOwnerListItem } from "./";

import { useTranslation } from "react-i18next";

import { PetMinSubOwnerFragment } from "./operations/__generated__/petMinSubOwner.generated";


type props = {
    ownerships: PetMinSubOwnerFragment[];
    onSelected: (v: string)=> void
    className?: string,
    gradient?:boolean
};

export const SubOwnerList: React.FC<props> = ({ ownerships = [], onSelected, className, gradient =true}) => {
    const { t } = useTranslation();
    return (
        <List className={`${className} ownerships-list`}>
            {ownerships.length ? (
                ownerships.map((ownership, i) => (
                    
                    <SubOwnerListItem key={i} onSelected={(v)=> onSelected(v)} ownership={ownership} />
                    
                ))
            ) : (
                <h2>{t('users.general.no_sub_owners')}</h2>
            )}
            {gradient && ownerships.length> 5 && <Gradient />}
        </List>
    );
};

const List = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--ion-color-medium);
    max-height:calc(90vh - 140px);
    overflow-y: scroll;
    flex-flow: wrap;
    scroll-behavior: smooth;
    box-sizing:border-box;
    position:relative;
    > h2 {
        margin-top: 30px;
        width: 100%;
        text-align: center;
    }
`;

const Item = styled.div`
    width: 100%;
    border-bottom: 1px solid var(--ion-color-medium);
    height: 90px;
    display: flex;
    justify-content:flex-start;
`;
const UserImageBox = styled.div`
    width: 90px;
    margin-right: 10px;
    padding: 15px;
    > .img2x {
        width: 100%;
        height: 100%;
    }
`;

const DescBox = styled.div`
    display: flex;
    flex-direction: column;
`;

const ActionsOpener = styled.div`
    
    height: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
    margin-left:auto;
    margin-right:12px;
`
const Gradient = styled.div`
    width:100%;
    height:50px;
    position: sticky;
    bottom:-2px;
    background: linear-gradient(to top, var(--ion-color-light) , var(--ion-trasparent));
`