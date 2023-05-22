import styled from "styled-components";
import { Icon, Image2x } from "../../../components";
import { PetMinSubOwnerFragment } from "../operations/__generated__/petMinSubOwner.generated";
import { Maybe } from "../../../types";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

type props = {
    ownerships: PetMinSubOwnerFragment[];
    onSelected: (v: string)=> void
};

export const SubOwnerList: React.FC<props> = ({ ownerships = [], onSelected}) => {
    const { t } = useTranslation();
    useEffect(()=>{console.log('ciao')}, [])
    return (
        <List>
            {ownerships.length ? (
                ownerships.map((ownership, i) => (
                    
                    <Item key={i} onClick={()=>onSelected('pippo')}>
                        <UserImageBox>
                            {ownership?.user?.profile_picture && (
                                <Image2x
                                    id={ownership.user.profile_picture.id}
                                    alt={`${ownership.user.first_name} ${ownership.user.last_name} picture`}
                                />
                            )}
                        </UserImageBox>
                        <DescBox>
                            <h5>
                                {ownership?.user.first_name}
                                {ownership?.user.last_name}
                            </h5>
                            <span>{ownership?.user.email}</span>
                        </DescBox>
                        <ActionsOpener>
                            <Icon name="ellipsisHorizontalOutline" color="var(--ion-color-medium)" />
                        </ActionsOpener>
                    </Item>
                    
                ))
            ) : (
                <h2>{t('users.general.no_sub_owners')}</h2>
            )}
            {ownerships.length > 5 && <Gradient />}
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
    width: 50px;
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