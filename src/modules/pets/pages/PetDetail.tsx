import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import _ from "lodash";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { useCheckCodeMutation } from "../operations/__generated__/checkCode.generated";
import { useGetPetLazyQuery } from "../operations/__generated__/getSinglePet.generated";
import { useLinkPetToMeMutation } from "../operations/__generated__/linkPetToMe.generated";
import { MinPetFragment } from "@graphql_generated/minPet.generated";
import { PetMinSubOwnerFragment } from "@graphql_generated/petMinSubOwner.generated";

import { ShareBox } from "../components";
import { Image2x, SubOwnerList, SubOwnerListItem, Icon } from "@components";
import { useUserContext } from "@contexts";
import { CustodyLevel, Gender } from "@types";
import { gendersColor } from "@utils";
import { $color, $uw } from "@theme";


export const PetDetails: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [pet, setPet] = useState<MinPetFragment>();
    const { t } = useTranslation();
    const { setPage } = useUserContext();
    const [cookies] = useCookies(["user"]);
    const [owner, setOwner] = useState<string>();
    const [loaners, setLoaners] = useState<string[]>([]);
    const [checkCode, { loading: checkLoading }] = useCheckCodeMutation({
        onCompleted: ({ checkCode }) => {
            if (!checkCode?.code || checkCode.error) {
                return;
            }
            getPet({ variables: { id: checkCode.code.ref_id } });
        },
    });

    const [getPet, { loading: getPetLoading }] = useGetPetLazyQuery({
        onCompleted: ({ getPet }) => {
            if (!getPet?.pet || getPet.error) {
                return;
            }
            setPet(getPet.pet);
            if (getPet.pet.ownerships?.items) {
                setOwner(
                    getPet.pet.ownerships.items.find(
                        (item) => item!.custody_level == CustodyLevel.Owner
                    )?.user.id
                );
                setLoaners(
                    getPet.pet.ownerships.items
                        .filter(
                            (item) => item!.custody_level != CustodyLevel.Owner
                        )
                        .map((item) => item!.user.id)
                );
            }
        },
    });

    const [linkPetToMe, {loading}] = useLinkPetToMeMutation({
        onCompleted: ({linkPetToMe})=> {
            if(linkPetToMe.error){
                return
            }
            toast.success(t('messages.success.linked_succesfully'))
        }
    })

    useEffect(() => {
        setPage({ name: t("pages.pet_sharing") });
        checkCode({ variables: { code } });
    }, []);

    return (
        <Container>
            {getPetLoading || checkLoading || pet ? (
                <PetInfoBox>
                    <MainPetContainer>
                        <ImageWrapper
                            className={`${
                                getPetLoading || checkLoading ? "skeleton" : ""
                            }`}
                        >
                            {!(getPetLoading || checkLoading) &&
                            pet?.main_picture ? (
                                <Image2x id={pet?.main_picture.id} />
                            ) : (
                                <FillBox></FillBox>
                            )}
                        </ImageWrapper>
                        <NameBox
                            $bg={pet?.main_picture?.main_color?.color}
                            $fg={pet?.main_picture?.main_color?.contrast}
                            className={`${
                                getPetLoading || checkLoading ? "skeleton" : ""
                            }`}
                        >
                            {pet && (
                                <>
                                    <IconContainer>
                                        <Icon
                                            size="100%"
                                            color={gendersColor[pet.gender ?? Gender.NotSaid].color}
                                            name={gendersColor[pet.gender ?? Gender.NotSaid].iconName}
                                        />
                                    </IconContainer>
                                    <span className="mainInfo">{pet.name}</span>
                                </>
                            )}
                        </NameBox>
                    </MainPetContainer>                   
                    <InfoBox className="info2">
                        <span>{t("pets.gender")}</span>
                        <InfoChip
                            className={`${
                                getPetLoading || checkLoading ? "skeleton" : ""
                            }`}
                        >
                            {pet && <span>{pet.gender}</span>}
                        </InfoChip>
                    </InfoBox>
                    <InfoBox className="info3">
                        <span>{t("pets.weight")}</span>
                        <InfoChip
                            className={`${
                                getPetLoading || checkLoading ? "skeleton" : ""
                            }`}
                        >
                            {pet && <span>{pet.weight_kg} Kg</span>}
                        </InfoChip>
                    </InfoBox>
                </PetInfoBox>
            ) : (
                <Empty>
                    <h1>{t("messages.errors.no_pet_found")}</h1>
                </Empty>
            )}
            {!checkLoading && !getPetLoading && (
                <>
                    {pet &&
                    owner != cookies.user.id &&
                    !loaners.includes(cookies.user.id) ? (
                        <ShareBox onConfirm={(v) => linkPetToMe({variables: {petId: pet.id , custodyLevel: v}})} />
                    ) : owner == cookies.user.id ? (
                        <>
                        <h3 className="sharing-title">{t('pets.shared_with')}</h3>
                        <SubOwnerList
                            gradient={false}
                            ownerships={
                                (pet!.ownerships?.items.filter(
                                    (item) => item && item.custody_level!= CustodyLevel.Owner
                                ) as PetMinSubOwnerFragment[]) ?? [] 
                            }
                            onSelected={(v)=> {}}
                        />
                        </>
                    ) : (
                        <>
                        <h3 className="sharing-title">{t('pets.shared_from')} </h3>
                       {pet?.ownerships?.items && <SubOwnerListItem ownership={ pet!.ownerships?.items?.find(
                                    (item) => item && item.custody_level == CustodyLevel.Owner
                                ) as PetMinSubOwnerFragment} onSelected={(v)=> console.log(v)}/>}
                        </>
                    )}
                </>
            )}
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 24px 16px 24px;
    box-sizing: border-box;
    @media (max-height: 700px) {
        padding-bottom: 0;
        min-height: calc(100vh - 90px);
    }
    > .sharing-title {
        text-align: center;
        margin-bottom: 24px;
        letter-spacing: 0.3px;
    }
    .ownerships-list {
        max-height: unset;
    }
`;

const PetInfoBox = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 80px);
    padding: ${$uw(2)} ${$uw(1)};
    border-radius: 16px;
    background: ${$color('background')};
    border: 1px solid rgba(var(--ion-color-primary-rgb), 0.22);
    margin-bottom: ${$uw(2)};
`;

const MainPetContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    grid-row-start: 1;
    grid-row-end: 4;
    grid-column: 1;
`;

const ImageWrapper = styled.div`
    width: 100%;
    max-width: 180px;
    aspect-ratio: 1/1;
    padding: 4px;
    box-sizing: border-box;
    background: linear-gradient(
        135deg,
        ${$color('primary')},
        ${$color('secondary')}
    );
    border-radius: 260px;
    margin-bottom: 20px;
    > .img2x {
        width: 100%;
        height: 100%;
        border-radius: 260px;
        overflow: hidden;
        display: block;
    }
    &.skeleton {
        background: none;
        padding: 0;
        box-shadow: none;
    }
`;

const NameBox = styled.div<{ $bg?: string; $fg?: string }>`
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
    font-size: 2rem;
    padding: 0 ${$uw(2)} 0 ${$uw(0.6)};
    height: ${$uw(2.5)};
    font-weight: 600;
    border-radius: 99px;
    box-sizing: border-box;
    background-color: ${({ $bg }) => $color($bg || 'primary')};
    color: ${({ $fg }) => $color($fg || 'dark')};
    > span.mainInfo {
        height: auto;
        margin-bottom: 0;
        font-size: 1.8rem;
        font-weight: 800;
    }
    &.skeleton {
        background-color: unset;
    }
`;

const IconContainer = styled.div`
    width: ${$uw(1.5)};
    height: ${$uw(1.5)};
    flex: 0 0 ${$uw(1.5)};
    display: block;
    border-radius: 100px;
    background-color: ${$color('white')};
    margin-right: ${$uw(0.5)};
    padding: ${$uw(0.2)};
    box-sizing: border-box;
`;

const FillBox = styled.span`
    width: 100%;
    height: 100%;
    border-radius: 260px;
    display: block;
    background: linear-gradient(
        135deg,
        ${$color('primary')},
        ${$color('secondary')}
    );
`;
const InfoBox = styled.div`
    grid-column: 2;
    padding: 10px 14px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-self: center;
    justify-content: flex-end;
    gap: 8px;
    > span {
        text-align: center;
        font-size: 1.3rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: ${$color('primary')};
        font-weight: 600;
    }
    &.info1 {
        align-self: flex-start;
        grid-row: 1;
    }
    &.info2 {
        align-self: center;
        grid-row: 2;
    }
    &.info3 {
        grid-row: 3;
    }
`;

const InfoChip = styled.span`
    width: 100%;
    padding: 8px;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-weight: 700;
    text-transform: capitalize;
    background: rgba(var(--ion-color-primary-rgb), 0.12);
    border: 1px solid rgba(var(--ion-color-primary-rgb), 0.35);
    color: ${$color('primary')} !important;
    .dark & {
        color: ${$color('primary-tint')} !important;
    }
`;

const Empty = styled.div`
    width: 100%;
    padding: 80px 12px;
    > h1 {
        text-align: center;
    }
`;
