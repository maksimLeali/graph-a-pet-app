import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import {
	TextInput,
	SelectInput,
	DateTimePicker,
	SubmitInput,
	Option, PullToRefresh } from "@components";
import { Gender } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";
import { PetImageEditor } from "../../pets/components/PetImageEditor";

import { useCreatePetMutation } from "../operations/__generated__/createPet.generated";
import { useCreateShelterPetMutation } from "../operations/__generated__/createShelterPet.generated";

type FormValues = {
	name: string;
	gender?: Gender;
	birthday?: string;
};

export const AddShelterPet: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();

	const [createPet, { loading: creatingPet }] = useCreatePetMutation();
	const [createShelterPet, { loading: linking }] =
		useCreateShelterPetMutation();

	const [created, setCreated] = useState<{ id: string; name: string } | null>(
		null
	);
	const [editorOpen, setEditorOpen] = useState(false);

	const methods = useForm<FormValues>({ mode: "onSubmit" });

	useEffect(() => {
		setPage({ name: t("shelters.add_pet") });
	}, []);

	const genderOptions: Option[] = Object.values(Gender).map((key) => ({
		value: key,
		label: t(`pets.gender_${key.toLowerCase()}`),
	}));

	const back = () => history.replace(`/shelters/detail/${id}`);

	const onSubmit = methods.handleSubmit(async (data) => {
		const petRes = await createPet({
			variables: {
				data: {
					name: data.name.trim(),
					gender: data.gender,
					birthday: data.birthday,
				},
			},
		});
		const pet = petRes.data?.createPet;
		if (!pet?.success || !pet.pet) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		const linkRes = await createShelterPet({
			variables: {
				data: { shelter_id: id, pet_id: pet.pet.id },
			},
		});
		const link = linkRes.data?.createShelterPet;
		if (!link?.success || link.error) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("messages.success.pet_added"));
		setCreated({ id: pet.pet.id, name: pet.pet.name });
		setEditorOpen(true);
	});

	const loading = creatingPet || linking;

	return (
		<IonContent>
		    <PullToRefresh />
			<FormProvider {...methods}>
				<Form onSubmit={onSubmit}>
					<Intro>
						<h3>{t("shelters.add_pet")}</h3>
					</Intro>

					<Field>
						<TextInput
							name="name"
							required
							textLabel="pets.add_pet_page.step_1.insert_name"
						/>
					</Field>

					<Field>
						<SelectInput
							name="gender"
							options={genderOptions}
							required
							textLabel="pets.add_pet_page.step_3.insert_gender"
						/>
					</Field>

					<Field>
						<DateTimePicker
							name="birthday"
							type="date"
							noDay
							required
							textLabel="pets.add_pet_page.step_1.insert_birthday"
						/>
					</Field>

					<SubmitInput color="primary" disabled={loading}>
						{t("shelters.add_pet")}
					</SubmitInput>
				</Form>
			</FormProvider>

			{created && (
				<PetImageEditor
					open={editorOpen}
					onClose={() => {
						setEditorOpen(false);
						back();
					}}
					petId={created.id}
					petName={created.name}
					onSaved={() => {
						setEditorOpen(false);
						back();
					}}
				/>
			)}
		</IonContent>
	);
};

const Form = styled.form`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${$uw(3)};
	padding: ${$cssTRBL(3, 1)};
	box-sizing: border-box;
	.submit-input {
		margin-top: auto;
	}
`;

const Intro = styled.div`
	width: 100%;
	> h3 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;
