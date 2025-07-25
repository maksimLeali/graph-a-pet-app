import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Chip, Image2x } from "@components";
import { custodyLevelColors } from "@utils";
import { PetMinSubOwnerFragment } from "@graphql_generated/petMinSubOwner.generated";
import { $color, $cssTRBL, $uw } from "@theme";

type props = {
    ownership: PetMinSubOwnerFragment;
    onSelected: (v: string) => void;
};

export const SubOwnerListItem: React.FC<props> = ({
    ownership,
    onSelected,
}) => {
    const { t } = useTranslation();
    return (
        <Item onClick={() => onSelected("pippo")}>
            <UserImageBox>
                {ownership?.user?.profile_picture && (
                    <Image2x
                        lazy
                        rounded
                        id={ownership.user.profile_picture.id}
                        alt={`${ownership.user.first_name} ${ownership.user.last_name} picture`}
                    />
                )}
            </UserImageBox>
            <DescBox>
                <Name>
                    <Chip
                        className="chip"
                        color={custodyLevelColors[ownership.custody_level]}
                        label={t(
                            `pets.${ownership.custody_level.toLowerCase()}_short`
                        )}
                    />

                    <h5>
                        {ownership?.user.first_name} {ownership?.user.last_name}
                    </h5>
                </Name>
                <span>{ownership?.user.email}</span>
            </DescBox>
        </Item>
    );
};

const Item = styled.div`
    width: 100%;
    border-bottom: 1px solid ${$color("medium")};
    height: ${$uw(6)};
    padding: ${$cssTRBL(0, 1)};
    display: flex;
    justify-content: flex-start;
`;
const UserImageBox = styled.div`
    width: ${$uw(6)};
    margin-right: 10px;
    padding: ${$uw(0.5)};
    position: relative;
    display: flex;
    justify-content: center;
    > .img2x {
        width: 100%;
        height: 100%;
    }
`;

const DescBox = styled.div`
    display: flex;
    max-width: ${$uw(22)};
    flex-direction: column;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
	justify-content: center;
	gap:${$uw(1)};
`;

const Name = styled.div`
    display: flex;
    gap: ${$uw(1)};
    align-items: center;
    .chip {
        height: ${$uw(1.5)};
        padding: ${$cssTRBL(0, 1)};
        span {
            font-size: 1.2rem;
            font-weight: bold;
        }
    }
`;
