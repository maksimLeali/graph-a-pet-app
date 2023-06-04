import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import styled from "styled-components";
import { useUserContext } from "../../../contexts";
import { useTranslation } from "react-i18next";
import { Image2x, SubOwnerList, SubOwnerListItem } from "../../../components";
import { useCheckCodeMutation } from "../operations/__generated__/checkCode.generated";
import { useGetPetLazyQuery } from "../operations/__generated__/getSinglePet.generated";
import { CustodyLevel } from "../../../types";
import { IonButton } from "@ionic/react";
import _ from "lodash";
import { CustodyLevelSelector } from "../components/CustodyLevelSelector";
import { ShareBox } from "../components";
import { useCookies } from "react-cookie";
import { useLinkPetToMeMutation } from "../operations/__generated__/linkPetToMe.generated";
import { toast } from "react-hot-toast";
import { MinPetFragment } from "../../../components/operations/__generated__/minPet.generated";
import { PetMinSubOwnerFragment } from "../../../components/operations/__generated__/petMinSubOwner.generated";


export const Sharing: React.FC = () => {
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
            console.log("code ok");

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
            console.log(getPet.pet);
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
                            className={`${
                                getPetLoading || checkLoading ? "skeleton" : ""
                            }`}
                        >
                            {pet && <span>{pet.name}</span>}
                        </NameBox>
                    </MainPetContainer>
                    <InfoBox className="info1">
                        <span>{t("pets.family")}</span>
                        <InfoChip
                            className={`${
                                getPetLoading || checkLoading ? "skeleton" : ""
                            }`}
                        >
                            {pet && <span>{pet.body.family}</span>}
                        </InfoChip>
                    </InfoBox>
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
                            onSelected={(v)=> {console.log('v', v)}}
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
    padding: 20px 12px 20px;
    box-sizing: border-box;
    @media (max-height: 700px) {
        padding-bottom: 0;
        min-height: calc(100vh - 90px);
    }
    > .sharing-title {
        text-align: center;
        margin-bottom: 24px;
    }
    .ownerships-list {
        max-height: unset;
    }
`;

const PetInfoBox = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 80px);
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
    border: 2px solid var(--ion-color-primary);
    border-radius: 260px;
    margin-bottom: 20px;
    overflow-y: hidden;
    > .img2x {
        width: 100%;
        height: 100%;
    }
    &.skeleton {
        border: 0;
    }
`;

const NameBox = styled.div`
    min-width: 80px;
    height: 30px;
    padding: 5px 24px;
    border-radius: 30px;
    box-sizing: border-box;
    background-color: var(--ion-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
        text-transform: uppercase;
        font-weight: 600;
    }
`;

const FillBox = styled.span`
    width: 100%;
    height: 100%;
    background-color: var(--ion-color-primary);
`;
const InfoBox = styled.div`
    grid-column: 2;
    padding: 10px 12px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-self: center;
    justify-content: flex-end;
    gap: 10px;
    > span {
        text-align: center;
        color: var(--ion-color-dark);
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
    padding: 5px;
    height: 30px;
    border-radius: 30px;
    background-color: var(--ion-color-primary);
    color: var(--ion-color-light) !important;
    .dark & {
        color: var(--ion-color-dark) !important;
    }
`;

const Empty = styled.div`
    width: 100%;
    padding: 80px 12px;
    > h1 {
        text-align: center;
    }
`;
