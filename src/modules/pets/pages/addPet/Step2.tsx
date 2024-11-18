import { IonButton, IonContent } from "@ionic/react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Option, Modal, FakeInput, SelectInput, SubmitInput, NumberInput, Toggle, DateTimePicker } from "@components";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import { BreedSeletor } from "../../components";
import { CoatLength, CoatPattern, CustodyLevel, PetFamily } from "@types";
import { BREEDS, COAT_LENGHTS } from "@utils";
import { useAddPetToMeMutation } from "../../operations/__generated__/addPetToMe.generated";

export const Step2 = React.memo(() => {
	const { setPage, fadeBackground } = useUserContext();
	const [breedText, setBreedText] = useState("");
	const [neutered, setNeutered] = useState(false);
	const [selectedBreed, setSelectedBreed] = useState<Option | null>(null);
	const [openBreedSelector, setOpenBreedSelector] = useState(false);
	
	const [addPetToMe, { loading }] = useAddPetToMeMutation({onCompleted: async (data)=>{		
		if(!data.addPetToMe.data?.pet.id) return
		setCookies('add_pet_step_2', {...cookies.add_pet_step_2, pet_id : data.addPetToMe.data.pet.id})
		history.push("/pets/new/step3");
	}})

	const [cookies, setCookies] = useCookies([
		"add_pet_step_1",
		"add_pet_step_2",
	]);
	const history = useHistory();

	const methods = useForm<{ birthday: string; weight_kg: string; neutered: boolean; family: PetFamily; breed: BREEDS | string; coat_length: COAT_LENGHTS }>({
		mode: "onSubmit",
		defaultValues: {
			...(cookies.add_pet_step_2)

		},
	});

	const { t } = useTranslation();

	const familyOptions: Option[] = Object.values(PetFamily).map((key) => ({
		value: key,
		label: t(`pets.pet_family.${key.toLowerCase()}`),
	}));
	const coatOptions: Option[] = Object.values(COAT_LENGHTS).map((key) => ({
		value: key,
		label: t(`pets.coat_lengths.${key.toLowerCase()}`),
	}));

	useEffect(() => {
		setPage({ name: "step 2 di 3" });
		if (!cookies.add_pet_step_1) {
			return history.push("/pets/new/step1");
		}
		if (cookies.add_pet_step_2) {
			setBreedText(cookies.add_pet_step_2.breed)
			setNeutered(cookies.add_pet_step_2.neutered ? true : false)
		}
	}, []);

	const openBreedsModal = useCallback(() => {
		setOpenBreedSelector(true);
		fadeBackground(true);
	}, [breedText, selectedBreed, openBreedSelector]);


	const handleSubmit= methods.handleSubmit((data) => {
		data.breed = breedText;
		data.neutered = neutered;
		console.log(data)
		setCookies("add_pet_step_2", data);
		console.log(({
			...data,
			...cookies.add_pet_step_1
		}))
		addPetToMe({variables: {
			custodyLevel: CustodyLevel.Owner,
			data: {
				name: cookies.add_pet_step_1.name!,
				gender:cookies.add_pet_step_1.gender!,
				birthday: data.birthday,
				weight_kg: parseFloat(data.weight_kg),
				neutered: data.neutered,
				body: {
					family: data.family,
					breed: data.breed,
					coat: {
						length: data.coat_length as unknown as CoatLength,
						pattern: CoatPattern.Solid,
						colors:[]
					}
				}
			}
		}})	
		history.push("/pets/new/step1");
	})

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
				<Form
					onSubmit={handleSubmit}
				>
					<Intro>
						<h3
							dangerouslySetInnerHTML={{
								__html:
									t("pets.add_pet_page.step_2.intro", {
										name: cookies.add_pet_step_1?.name ?? "",
									}) ?? "",
							}}
						/>
					</Intro>
					<Row>
						<span>{t("pets.add_pet_page.step_2.family")}</span>
						<SelectInput
							name="family"
							options={familyOptions}
							required
							textLabel="pets.add_pet_page.step_2.insert_family"
						/>
					</Row>
					<Row>
						<span>{t("pets.add_pet_page.step_2.breed")}</span>
						<FakeInput
							name="breed"
							required
							textLabel="pets.add_pet_page.step_2.insert_breed"
							onClick={openBreedsModal}
							value={breedText}

						/>
					</Row>
					<Row>
						<span>{t("pets.add_pet_page.step_2.coat")}</span>
						<SelectInput
							name="coat_length"
							required
							options={coatOptions}
							forceOptionsUp
							textLabel="pets.add_pet_page.step_2.insert_coat"
						/>
					</Row>
					<Row>
						<span>{t("pets.add_pet_page.step_2.weight")}</span>
						<NumberInput
							name="weight_kg"
							required
							textLabel="pets.add_pet_page.step_2.insert_weight"
						/>
					</Row>
					<Row>
						<span
							dangerouslySetInnerHTML={{
								__html:
									t(`pets.add_pet_page.step_2.birthday_${cookies?.add_pet_step_1?.gender == "FEMALE" ? 'female' : "male"}`, {
										name: cookies.add_pet_step_1?.name ?? "",
									}) ?? "",
							}}
						/>
						<DateTimePicker
							name="birthday"
							textLabel="pets.add_pet_page.step_2.insert_birthday"
							type="date"
							required
						/>
					</Row>
					<Row className="inline">
						<span>{t(`pets.add_pet_page.step_2.neutered_${cookies?.add_pet_step_1?.gender == 'FEMALE' ? 'female' : 'male'}`)}</span>
						<Toggle value={neutered} onChange={() => setNeutered(!neutered)} />

					</Row>
					<SubmitInput color="primary">
						{t("pets.add_pet_page.step_2.continue")}
					</SubmitInput>
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
	padding: ${$cssTRBL(4, 1)};
	
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
	&.inline{
		flex-direction: row;
		justify-content: space-between;
	}
`;
