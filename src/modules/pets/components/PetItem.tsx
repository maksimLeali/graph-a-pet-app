import styled from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import gsap from "gsap";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { $breakPoint, $color, $cssTRBL, $uw } from "@theme";
import { Image2x, Icon, NewReportForm, SubOwnerList } from "@components";
import { gendersColor } from "@utils";
import { useDeletePetMutation } from "../operations/__generated__/deletePet.generated";
import { useModal, useUserContext } from "@contexts";
import { CustodyLevel, useDeleteOwnershipMutation } from "@types";
import { FormProvider, useForm } from "react-hook-form";
import { PetMinSubOwnerFragment } from "@graphql_generated/petMinSubOwner.generated";

type Prop = {
    pet: DashboardPetFragment;
    index: number;
    onShare?: (id: string) => void;
};

export const PetItem: React.FC<Prop> = ({ pet, index, onShare }) => {
    const [ready, setReady] = useState(false);
    const [imageReady, setImageReady] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { t: breedT } = useTranslation("breeds");
    const [mode, setMode] = useState<"view" | "edit" | null>();
    const { openModal, closeModal } = useModal();

    const { user, refetchDashboard } = useUserContext();

    const methods = useForm({
        mode: "onSubmit",
    });

    const ownership = useMemo(() => {
        const mine = pet.ownerships?.items.find((o) => o?.user.id === user.id);
        console.log(mine);
        return { id: mine?.id, type: mine?.custody_level };
    }, [pet]);

    const [deletePet, { loading: deleteLoading }] = useDeletePetMutation({
        onCompleted: (res) => {
            toast.success(t("pets.pet_list_page.deleted_pet_ok"));
            refetchDashboard();
            closeModal();
        },
    });
    const [deleteOwnerhsp, { loading: deleteOwnershipLoading }] =
        useDeleteOwnershipMutation({
            onCompleted: (res) => {
                toast.success(t("pets.pet_list_page.deleted_ownership_ok"));
                refetchDashboard();
                closeModal();
            },
        });

    useEffect(() => {
        if (imageReady || !pet.main_picture) {
            gsap.fromTo(
                itemRef.current,
                { opacity: 0, x: "-100px" }, // From left of 100px outside the screen
                { opacity: 1, x: 0, duration: 0.6, delay: 0.2 + index / 10 } // To original position with opacity transition
            );
        }
    }, [imageReady, index]);

    setTimeout(() => {
        setReady(true);
    }, 100);

    useEffect(() => {
        console.log(t("pet.age_years", { years: 3 }));
    }, []);

    const switchMode = useCallback(() => {
        setMode(mode == "edit" ? "view" : "edit");
    }, [mode]);

    const openDeletePet = useCallback(() => {
        openModal({
            onClose: () => closeModal(),
            onCancel: () => {
                closeModal();
            },
            onConfirm: async () => {
                if (ownership.type === CustodyLevel.Owner) {
                    deletePet({ variables: { id: pet.id } });
                    return;
                }
                deleteOwnerhsp({ variables: { id: ownership?.id ?? "" } });
            },
            children: (
                <Text>
                    {t(
                        ownership.type === CustodyLevel.Owner
                            ? "pets.pet_list_page.delete_pet"
                            : "pets.pet_list_page.delete_loan",
                        { name: pet.name }
                    )}
                </Text>
            ),
        });
    }, []);

    const openCoOwnerModal = useCallback(() => {
        openModal({
            onClose: () => closeModal(),
            children: (
                <SubOwnerList
                    ownerships={
                        (pet.ownerships?.items.filter(
                            (item) => item && item.user.id !== user.id
                        ) as PetMinSubOwnerFragment[]) ?? []
                    }
                    onSelected={(str) => {}}
                />
            ),
        });
    }, []);

    const openNewReportForm = useCallback(() => {
        openModal({
            onClose: () => {
                closeModal();
            },
            onCancel: () => {
                closeModal();
            },
            onConfirm: () => {
                console.log(methods.getValues());
                closeModal();
            },
            children: (
                <FormProvider {...methods}>
                    <NewReportForm />
                </FormProvider>
            ),
        });
    }, []);

    return (
        <Container
            ref={itemRef}
            bgColor={pet.main_picture?.main_color?.color}
            color={pet.main_picture?.main_color?.contrast}
            className={`${mode}`}
            onContextMenu={(e) => {
                e.preventDefault();
                switchMode();
            }}
        >
            {ready && pet.main_picture ? (
                <ImageWrapper className="image-wrapper custom-pet-border-color">
                    <Image2x
                        lazy
                        alt={`${pet.name} picture`}
                        id={pet.main_picture!.id}
                        onLoad={() => setImageReady(true)} // Set ready state to true when image is loaded
                    />
                    <DeleteWrapper
                        onClick={() => {
                            openDeletePet();
                        }}
                        className={`${mode}`}
                    >
                        <Icon name="trashOutline" />
                    </DeleteWrapper>
                </ImageWrapper>
            ) : (
                <ImageWrapper className="image-wrapper custom-pet-border-color">
                    <Ph />
                    <DeleteWrapper
                        onClick={() => {
                            openDeletePet();
                        }}
                        className={`${mode === "edit" ? "edit" : "view"}`}
                    >
                        <Icon name="trashOutline" />
                    </DeleteWrapper>
                </ImageWrapper>
            )}
            <InfoWrapper>
                <Name className="name custom-pet-color">
                    <IconContainer className="icon-container">
                        <Icon
                            size="100%"
                            color={gendersColor[pet.gender].color}
                            name={gendersColor[pet.gender].iconName}
                        ></Icon>
                    </IconContainer>
                    <span className="mainInfo">{pet.name}</span>
                </Name>
                <InfoBox className={`info-box custom-pet-border-color ${mode}`}>
                    <InfoRow>
                        <span>
                            {breedT(`${pet.body.breed.toLocaleLowerCase()}`)}
                        </span>
                    </InfoRow>
                    <InfoRow>
                        <span
                            dangerouslySetInnerHTML={{
                                __html:
                                    t("pets.age_years", {
                                        count: dayjs().diff(
                                            pet.birthday,
                                            "years"
                                        ),
                                    }) ?? "",
                            }}
                        />
                        <span
                            dangerouslySetInnerHTML={{
                                __html:
                                    t("pets.weight_kg", {
                                        weight_kg: pet.weight_kg,
                                    }) ?? "",
                            }}
                        />
                    </InfoRow>
                    <InfoRow>
                        {pet.neutered && (
                            <span className="sub">
                                {t(
                                    `pets.neutered_${
                                        pet.gender == "FEMALE"
                                            ? "female"
                                            : "male"
                                    }`
                                )}
                            </span>
                        )}
                    </InfoRow>
                    <ActionContainer className="actionContainer">
                        <Cancel onClick={() => setMode("view")}>
                            <Icon name="closeCircleOutline" />
                        </Cancel>
                        <ActionWrapper className="actionWrapper custom-pet-color">
                            <Action onClick={() => openCoOwnerModal()}>
                                <Icon name="peopleOutline" color="dark" />
                                <span>{t("home.co_owners")}</span>
                            </Action>
                            <Action onClick={openNewReportForm}>
                                <Icon
                                    className="icon"
                                    name="alertCircle"
                                    color="dark"
                                />
                                <span>{t("pets.pet_list_page.report")}</span>
                            </Action>
                            <Action>
                                <Icon
                                    name="informationCircleOutline"
                                    color="dark"
                                />
                                <span>{t("home.profile")}</span>
                            </Action>
                            {onShare &&
                                ownership.type === CustodyLevel.Owner && (
                                    <Action onClick={() => onShare(pet.id)}>
                                        <Icon name="shareOutline" />
                                        <span> {t("share")}</span>
                                    </Action>
                                )}
                        </ActionWrapper>
                    </ActionContainer>
                </InfoBox>
            </InfoWrapper>
        </Container>
    );
};

const Container = styled.div<{ bgColor?: string; color?: string }>`
    width: 100%;
    height: ${$uw(10)};
    /* background-color: ${({ bgColor }) => $color(bgColor || "primary")}; */
    margin-bottom: ${$uw(2)};
    opacity: 0;
    display: flex;
    border-radius: 99px 4px 4px 99px;
    position: relative;

    .image-wrapper {
        border: 4px solid ${({ bgColor }) => $color(bgColor || "primary")};
    }
    .icon-container {
        background-color: ${$color("white")};
    }
    .name {
        background-color: ${({ bgColor }) => $color(bgColor || "primary")};
        color: ${({ color }) => $color(color || "dark")};
    }
    .info-box {
        border-top: 2px solid ${({ bgColor }) => $color(bgColor || "primary")};
        background-color: ${$color("light-tint")};
        box-shadow: 1px 2px 2px 0px #6666;
        .dark & {
            box-shadow: none;
        }
    }
    .actionWrapper {
        background-color: ${({ bgColor }) => $color(bgColor || "primary")};
        color: ${({ color }) => $color(color || "dark")};
    }
`;

const ImageWrapper = styled.div`
    width: ${$uw(10)};
    height: ${$uw(10)};
    flex: 0 0 ${$uw(10)};
    aspect-ratio: 1;
    position: absolute;
    z-index: 3;
    border-left-width: 0;
    overflow: hidden;
    border-radius: 99px;
`;

const DeleteWrapper = styled.div`
    width: ${$uw(10)};
    height: ${$uw(10)};
    top: 0;
    flex: 0 0 ${$uw(10)};
    position: absolute;
    padding: ${$uw(2)};
    opacity: 0;
    z-index: -1;
    background-color: ${$color("danger")};
    &.edit {
        animation: petItemAppear 0.5s ease-in forwards;
        z-index: 10;
    }
    &.view {
        animation: petItemDisappear 0.5s ease-in forwards;
    }
    > * {
        height: 100%;
        width: 100%;
    }
`;

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Name = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
    font-size: 2rem;
    margin-left: ${$uw(5)};
    padding-left: ${$uw(5.5)};
    height: ${$uw(2.5)};
    font-weight: 600;
    padding-right: ${$uw(2)};
    border-radius: 0 99px 0px 0;
    > span.mainInfo {
        height: auto;
        margin-bottom: 0;
        font-size: 1.8rem;
        font-weight: 800;
    }   
`;

const InfoBox = styled.div`
    display: flex;
    padding: ${$uw(0.5)};
    width: ${$uw(24)};
    height: ${$uw(7.7)};
    margin-left: ${$uw(5)};
    padding-left: ${$uw(5.5)};
    position: relative;
    border-radius: 0 2px 2px 0px;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    box-sizing: border-box;
    span {
        height: ${$uw(1)};
        margin-bottom: ${$uw(0.5)};
    }
`;

const IconContainer = styled.div`
    width: ${$uw(1.5)};
    height: ${$uw(1.5)};
    display: block;
    border-radius: 100px;

    margin-right: ${$uw(0.5)};
    padding: ${$uw(0.2)};
`;

const InfoRow = styled.div`
    width: 100%;
    display: flex;
    gap: ${$uw(0.5)};

    margin-bottom: ${$uw(0.5)};
    justify-content: flex-start;
    &:last-child {
        margin-bottom: 0;
    }
    > .sub {
        font-size: 1.3rem;
    }
    ${$breakPoint(420)} {
        span {
            font-size: 1.4rem;
        }
    }
`;

const Ph = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${$color("light")};
`;

const ActionContainer = styled.div`
    width: 100%;
    height: ${$uw(10)};
    overflow: hidden;
    position: absolute;
    max-width: 0;
    top: ${$uw(-2.55)};
    left: 0;
    padding-top: ${$uw(2.55)};
    transition: max-width 0.5s ease-out .2s;
    .edit & {
        transition: max-width 0.5s ease-in;
        max-width: 100%;
    }
`;

const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${$uw(1)};
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    border-radius: 2px 0 2px 0;
    padding: ${$cssTRBL(1, 1, 1, 5.5)};
`;

const Cancel = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: ${$uw(1)};
    position: absolute;
    right: ${$uw(0.5)};
    top: ${$uw(0.5)};
    opacity: 0;
    transition: opacity 0.2s ease-out ;
    .edit & {
        opacity: 1;
        transition: opacity .2s ease-in .5s ;
    }
`;
const Action = styled.div`
    display: flex;
    gap: ${$uw(0.5)};
    align-items: center;
    height: ${$uw(2)};
    width: ${$uw(8)};
    opacity: 0;
    transition: opacity 0.2s ease-out ;
    .edit & {
        opacity: 1;
        transition: opacity .2s ease-in .5s;
    }
`;

const Text = styled.p`
    padding-left: ${$uw(2)};
    margin-bottom: ${$uw(2)};
`;
