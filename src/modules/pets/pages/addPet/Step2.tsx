import { IonContent } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../../contexts";
import { FormProvider, useForm } from "react-hook-form";

import { Gender, PetCreate, PetFamily } from "../../../../types";
import {
	SelectInput,
	TextInput,
	Option,
	SubmitInput,
	Toggle,
} from "../../../../components";
import styled from "styled-components";
import { $cssTRBL, $uw } from "../../../../utils/theme/functions";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { BREEDS } from "../../../../utils";
import { useHistory } from "react-router";

export const Step2 = React.memo(() => {
	const { setPage } = useUserContext();
	const [cookies, setCookies] = useCookies([
		"add_pet_step_1",
		"add_pet_step_2",
	]);

	const history = useHistory();

	const methods = useForm<{ breed: BREEDS }>({
		mode: "onSubmit",
		defaultValues: {
			...(cookies.add_pet_step_2 && {
				breed: cookies.add_pet_step_2.breed,
			}),
		},
	});
	const { t } = useTranslation();
	useEffect(() => {
		setPage({ name: "step 2 di 3" });
		if (!cookies.add_pet_step_1) {
			history.push("/pets/new/step1");
		}
	}, []);

	const breedOptions: Option[] = Object.values(BREEDS).map((key) => ({
		value: key,
		label: t(`pets.breeds.${key.toLowerCase()}`),
	}));

	return (
		<IonContent fullscreen>
			<FormProvider {...methods}>
				<Form
					onSubmit={methods.handleSubmit((data) => {
						console.log(data);
						setCookies("add_pet_step_2", data);
					})}
				>
					<Intro>
						<h3
							dangerouslySetInnerHTML={{
								__html:
									t("pets.add_pet_page.step_2.intro", {
										name:
											cookies.add_pet_step_1?.name ?? "",
									}) ?? "",
							}}
						/>
					</Intro>
					<Row>
						<span>{t("pets.add_pet_page.step_2.breed")}</span>
						<SelectInput
							name="breed"
							options={breedOptions}
							required
							textLabel="pets.add_pet_page.step_2.insert_breed"
						/>
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
