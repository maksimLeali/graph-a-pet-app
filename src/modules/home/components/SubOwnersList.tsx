import styled from "styled-components"
import { Image2x } from "../../../components"
import { PetMinSubOwnerFragment } from "../operations/__generated__/petMinSubOwner.generated"
import { Maybe } from "../../../types"

type props = {
    ownerships: Maybe<PetMinSubOwnerFragment>[]
}

export const SubOwnerList: React.FC<props> = ({ownerships= []})=> {
    return <List>
        {ownerships.map((ownership)=> 
            <Item>
                <UserImageBox>
                    {ownership?.user.profile_picture && <Image2x id={ownership.user.profile_picture.id}/>}
                </UserImageBox>
                <DescBox>
                    <h5> {ownership?.user.first_name} {ownership?.user.last_name}</h5>
                    <span>{ownership?.user.email}</span>
                </DescBox>
            </Item>
        )}
    </List>
}

const List = styled.div`
    width:100%;
    display: flex;
    flex-direction:column;
    border-top: 1px solid var(--ion-color-medium);
    
    `

const Item = styled.div`
    width:100%;
    border-bottom: 1px solid var(--ion-color-medium);
    height: 90px;
    display: flex;
`
const UserImageBox = styled.div`
    width: 90px;
    margin-right:10px;
    padding: 15px;
    > .img2x {
        width: 100%;
        height: 100%;
    }
`

const DescBox = styled.div`
    display: flex;
    flex-direction: column;
`