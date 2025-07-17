import { IonContent } from "@ionic/react";
import React, { useEffect } from "react";
import { FormProvider, useForm ,Controller } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Gender, PetCreate, PetFamily } from "@types";
import { SelectInput, TextInput, Option, SubmitInput } from "@components";
import { $cssTRBL, $uw } from "@theme";
import { useUserContext } from "@contexts";

export const Step1 =() => {
	const { setPage } = useUserContext();
	const [cookies, setCookies] = useCookies(["add_pet_step_1"]);

	const methods = useForm<
		Pick<PetCreate, "name" | "gender"> & { family: PetFamily }
	>({
		mode: "onSubmit",
		defaultValues: {
			...(cookies.add_pet_step_1 && {
				name: cookies.add_pet_step_1.name,
				family: cookies.add_pet_step_1.family,
				gender: cookies.add_pet_step_1.gender,
			}),
		},
	});
	const history = useHistory();
	const { t } = useTranslation();
	useEffect(() => {
		setPage({ name: "step 1 di 3" });
	}, []);

	const gender_ = methods.watch('gender')

	useEffect(()=>{
		console.log('gender', gender_)
	}, [gender_])
	const genderOptions: Option[] = Object.values(Gender).map((key) => ({
		value: key,
		label: t(`pets.gender_${key.toLowerCase()}`),
	}));


	return (
		<IonContent fullscreen>
			<FormProvider {...methods}>
				<Form
					onSubmit={methods.handleSubmit((data) => {
						console.log(data);
						setCookies("add_pet_step_1", data);
						history.push("/pets/new/step2");
					})}
				>
					<Intro>
						<h3>{t("pets.add_pet_page.step_1.intro")}</h3>
					</Intro>
					<Row>
						<span>{t("pets.add_pet_page.step_1.name")}</span>
						<TextInput
							name="name"
							required
							textLabel="pets.add_pet_page.step_1.insert_name"
						/>
					</Row>
					<Row>
						<span>{t("pets.add_pet_page.step_1.gender")}</span>
						<SelectInput
							name="gender"
							options={genderOptions}
							required
							textLabel="pets.add_pet_page.step_1.insert_gender"
						/>
					</Row>
					

					<SubmitInput color="primary">
						{t("pets.add_pet_page.step_1.continue")}
					</SubmitInput>
				</Form>
			</FormProvider>
		</IonContent>
	);
};

const Form = styled.form`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: ${$uw(1)};
	padding: ${$cssTRBL(0, 1)};
`;

const Intro = styled.div`
	width: 100%;
	margin-bottom: ${$uw(5)};
`;

const Row = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(3)};
`;
