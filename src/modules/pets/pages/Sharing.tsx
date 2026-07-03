import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";

import { useCheckCodeMutation } from "../operations/__generated__/checkCode.generated";
import { useGetPetLazyQuery } from "../operations/__generated__/getSinglePet.generated";
import { useLinkPetToMeMutation } from "../operations/__generated__/linkPetToMe.generated";
import { MinPetFragment } from "@graphql_generated/minPet.generated";
import { PetMinSubOwnerFragment } from "@graphql_generated/petMinSubOwner.generated";

import { Image2x, SubOwnerList, SubOwnerListItem } from "@components";
import { CustodyLevel } from "@types";
import { ShareBox } from "../components";
import { useUserContext } from "@contexts";
import { $color, $uw } from "../../../utils/theme/functions";


export const Sharing: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [pet, setPet] = useState<MinPetFragment>();
    const { t } = useTranslation();
    const { setPage, refetchDashboard } = useUserContext();
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
            refetchDashboard();
        }
    })

    useEffect(() => {
        setPage({ name: t("pages.pet_sharing") });
        checkCode({ variables: { code } });
    }, []);

    const loadingPet = getPetLoading || checkLoading;

    return (
        <Container>
            {loadingPet || pet ? (
                <>
                    <Header>
                        <PetImage className={loadingPet ? "skeleton" : ""}>
                            {!loadingPet && pet?.main_picture ? (
                                <Image2x id={pet?.main_picture.id} />
                            ) : (
                                <Fill />
                            )}
                        </PetImage>
                        <NameRow className={loadingPet ? "skeleton" : ""}>
                            {pet && <h2>{pet.name}</h2>}
                        </NameRow>
                    </Header>

                    <Fields>
                        <Card>
                            <CardLabel>{t("pets.gender")}</CardLabel>
                            <CardValue>
                                {pet?.gender
                                    ? t(
                                          `pets.gender_${pet.gender.toLowerCase()}` as any
                                      )
                                    : "—"}
                            </CardValue>
                        </Card>
                        <Card>
                            <CardLabel>{t("pets.weight")}</CardLabel>
                            <CardValue>
                                {pet?.weight_kg != null
                                    ? `${pet.weight_kg} Kg`
                                    : "—"}
                            </CardValue>
                        </Card>
                    </Fields>
                </>
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

const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${$uw(2)};
    padding: ${$uw(3)} 12px;
    box-sizing: border-box;
`;

const PetImage = styled.div`
    width: 100%;
    max-width: 180px;
    aspect-ratio: 1/1;
    border: 2px solid ${$color('primary')};
    border-radius: 260px;
    overflow: hidden;
    > .img2x {
        width: 100%;
        height: 100%;
    }
    &.skeleton {
        border: 0;
    }
`;

const Fill = styled.span`
    width: 100%;
    height: 100%;
    display: block;
    background-color: ${$color('primary')};
`;

const NameRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${$uw(1)};
    padding: ${$uw(0.5)} ${$uw(1)};
    border-radius: 12px;
    background: ${$color('background')};
    border: 1px solid rgba(255, 255, 255, 0.12);
    > h2 {
        margin: 0;
        text-transform: uppercase;
    }
`;

const Fields = styled.div`
    width: 100%;
    padding: 0 12px ${$uw(4)};
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${$uw(2.5)} ${$uw(2)};
    align-items: start;
`;

const Card = styled.div`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: ${$uw(0.5)};
    padding: ${$uw(0.75)};
    border-radius: 12px;
    background: ${$color('background')};
    border: 1px solid rgba(255, 255, 255, 0.12);
`;

const CardLabel = styled.span`
    font-size: 1.3rem;
    color: ${$color('primary')};
    text-transform: uppercase;
    letter-spacing: 0.4px;
`;

const CardValue = styled.span`
    font-size: 1.9rem;
    font-weight: 700;
    word-break: break-word;
`;

const Empty = styled.div`
    width: 100%;
    padding: 80px 12px;
    > h1 {
        text-align: center;
    }
`;
