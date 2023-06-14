import styled from "styled-components";
import { Chip, Icon, Image2x } from ".";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { custodyLevelColors } from "../utils";
import { PetMinSubOwnerFragment } from "./operations/__generated__/petMinSubOwner.generated";


type props = {
    ownership: PetMinSubOwnerFragment;
    onSelected: (v: string)=> void
};

export const SubOwnerListItem: React.FC<props> = ({ ownership, onSelected}) => {
    const { t } = useTranslation();
    return (
                    
                    <Item onClick={()=>onSelected('pippo')}>
                        <UserImageBox>
                            {ownership?.user?.profile_picture && (
                                <Image2x
                                    lazy
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
                            <Chip color={custodyLevelColors[ownership.custody_level]} label={t(`pets.${ownership.custody_level.toLowerCase()}_short`)} />
                        </ActionsOpener>
                    </Item>
    );
};


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
    max-width: 40%;
    flex-direction: column;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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