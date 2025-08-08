import { IonButton, IonContent } from "@ionic/react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import {
    Option,
    Modal,
    FakeInput,
    SelectInput,
    SubmitInput,
    NumberInput,
    Toggle,
    DateTimePicker,
} from "@components";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import { BreedSeletor } from "../../components";
import { CoatLength, CustodyLevel, Gender, PetFamily } from "@types";
import { BREEDS, COAT_LENGHTS } from "@utils";
import { useAddPetToMeMutation } from "../../operations/__generated__/addPetToMe.generated";
import { useUpdatePetMutation } from "../../operations/__generated__/updatePet.generated";

export const Step3
 = React.memo(() => {
    const { setPage, fadeBackground, refetchDashboard } = useUserContext();
    const [breedText, setBreedText] = useState("");
    const [selectedBreed, setSelectedBreed] = useState<Option | null>(null);
    const [neutered, setNeutered] = useState(false);
    const [openBreedSelector, setOpenBreedSelector] = useState(false);

    const [addPetToMe, { loading }] = useUpdatePetMutation({
        onCompleted: async (data) => {
            if (!data.updatePet.pet?.id) return;
            console.log("here");
            refetchDashboard();
            
            history.push("/home");
        },
    });

    const [cookies, setCookies] = useCookies([
        "add_pet_step_1",
        "add_pet_step_2",
    ]);
    const history = useHistory();

    const methods = useForm<{
        birthday: string;
        weight_kg: string;
        neutered: boolean;
        family: PetFamily;
        breed: BREEDS | string;
        coat_length: COAT_LENGHTS;
        gender: Gender
    }>({
        mode: "onSubmit",
        defaultValues: {
            ...cookies.add_pet_step_2,
        },
    });

    const { t } = useTranslation();

    const coatOptions: Option[] = Object.values(COAT_LENGHTS).map((key) => ({
        value: key,
        label: t(`pets.coat_lengths.${key.toLowerCase()}`),
    }));

    const genderOptions: Option[] = Object.values(Gender).map((key) => ({
		value: key,
		label: t(`pets.gender_${key.toLowerCase()}`),
	}));

    useEffect(() => {
        setPage({ name: "step 3 di 3" });
        if (!cookies.add_pet_step_1) {
            return history.push("/pets/new/step1");
        }        
    }, []);

    const openBreedsModal = useCallback(() => {
        setOpenBreedSelector(true);
        fadeBackground(true);
    }, [breedText, selectedBreed, openBreedSelector]);

    const handleSubmit = methods.handleSubmit((data) => {
        data.breed = breedText;
        data.neutered = neutered;
        console.log(data);
        setCookies("add_pet_step_2", data);
        console.log({
            ...data,
            ...cookies.add_pet_step_1,
        });
        addPetToMe({
            variables: {      
                id: cookies.add_pet_step_1.pet_id,    
                data: {                    
                    weight_kg: parseFloat(data.weight_kg),
                    neutered: data.neutered,
                    gender: data.gender,
                    breed: data.breed,

                    coat_length: data.coat_length as unknown as CoatLength,
                },
            },
        });
        // history.push("/pets/new/step1");
    });

    return (
        <IonContent fullscreen>
            <Modal
                open={openBreedSelector}
                onClose={() => {
                    setOpenBreedSelector(false);
                    fadeBackground(false);
                }}
                onCancel={() => {
                    setOpenBreedSelector(false);
                    fadeBackground(false);
                }}
                onConfirm={() => {
                    setOpenBreedSelector(false);
                    fadeBackground(false);
                    console.log(
                        "selectedBreed",
                        selectedBreed,
                        "breedText",
                        breedText
                    );
                }}
            >
                <BreedSeletor
                    onSelected={(v) => {
                        setSelectedBreed(v);
                        if (!v) return;
                        setBreedText(v.label);
                        console.log("Selected breed:", v.label);
                    }}
                    changeBreedText={(v) => setBreedText(v)}
                    selectedBreed={selectedBreed}
                />
            </Modal>
            <FormProvider {...methods}>
                <Form onSubmit={handleSubmit}>
                    <Intro>
                        <h3
                            dangerouslySetInnerHTML={{
                                __html:
                                    t("pets.add_pet_page.step_3.intro", {
                                        name:
                                            cookies.add_pet_step_1?.name ?? "",
                                    }) ?? "",
                            }}
                        />
                    </Intro>
                    <Row>
                        <span>{t("pets.add_pet_page.step_3.breed")}</span>
                        <FakeInput
                            name="breed"                            
                            textLabel="pets.add_pet_page.step_3.insert_breed"
                            onClick={openBreedsModal}
                            value={breedText}
                        />
                    </Row>
                    <Row>
                        <span>{t("pets.add_pet_page.step_3.coat")}</span>
                        <SelectInput
                            name="coat_length"
                            required
                            options={coatOptions}
                            forceOptionsUp
                            textLabel="pets.add_pet_page.step_3.insert_coat"
                        />
                    </Row>
                    <Row>
                        <span>{t("pets.add_pet_page.step_3.weight")}</span>
                        <NumberInput
                            name="weight_kg"
                            required
                            textLabel="pets.add_pet_page.step_3.insert_weight"
                        />
                    </Row>
                    <Row>
						<span>{t("pets.add_pet_page.step_3.gender")}</span>
						<SelectInput
							name="gender"
							options={genderOptions}
							required
							textLabel="pets.add_pet_page.step_3.insert_gender"
						/>
					</Row>
                    <Row className="inline">
                        <span>
                            {t(
                                `pets.add_pet_page.step_3.neutered_${
                                    cookies?.add_pet_step_1?.gender == "FEMALE"
                                        ? "female"
                                        : "male"
                                }`
                            )}
                        </span>
                        <Toggle
                            value={neutered}
                            onChange={() => setNeutered(!neutered)}
                        />
                    </Row>
                    <Actions>

                    <SubmitInput color="primary">
                        {t("pets.add_pet_page.step_3.save")}
                    </SubmitInput>
                    <IonButton color="primary">
                        {t("pets.add_pet_page.step_3.skip")}
                    </IonButton>
                    </Actions>
                </Form>
            </FormProvider>
        </IonContent>
    );
});

const Form = styled.form`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    overflow-y: scroll;
    gap: ${$uw(2)};
    padding: ${$cssTRBL(4, 1, 0)};
`;

const Intro = styled.div`
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${$uw(2)};
    justify-content: space-between;
    > * {
        margin-bottom: ${$uw(1)};
    }
    &.inline {
        flex-direction: row;
        justify-content: space-between;
    }
`;

const Actions = styled.div`
    position: sticky;
    bottom: ${$uw(0)};
    display: flex;
    flex-direction: column;
    gap: ${$uw(1)};
    padding-bottom: ${$uw(1)};
    background-color: ${$color('background')};
    z-index: 999;
    * {
        width: 100%;
    }
`