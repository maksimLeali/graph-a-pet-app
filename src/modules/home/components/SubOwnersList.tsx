import styled from "styled-components";
import { Image2x } from "../../../components";
import { PetMinSubOwnerFragment } from "../operations/__generated__/petMinSubOwner.generated";
import { Maybe } from "../../../types";
import { useTranslation } from "react-i18next";

type props = {
    ownerships: Maybe<PetMinSubOwnerFragment>[];
    noItemText: string
};

export const SubOwnerList: React.FC<props> = ({ ownerships = [], noItemText= '' }) => {
    
    const items = [1,2,3,4,5,6,7,8,9,10];
    return (
        <List>
            {ownerships.length ? (
                items.map((ownership, i) => (
                    <Item key={i}>
                        <UserImageBox>
                            {ownerships[0]?.user.profile_picture && (
                                <Image2x
                                    id={ownerships[0].user.profile_picture.id}
                                />
                            )}
                        </UserImageBox>
                        <DescBox>
                            <h5>
                                {ownerships[0]?.user.first_name}
                                {ownerships[0]?.user.last_name}
                            </h5>
                            <span>{ownerships[0]?.user.email}</span>
                        </DescBox>
                    </Item>
                ))
            ) : (
                <h2>{noItemText}</h2>
            )}
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
