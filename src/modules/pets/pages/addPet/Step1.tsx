import { IonContent } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm ,Controller } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { CustodyLevel, Gender, PetCreate, PetFamily, useAddPetToMeMutation } from "@types";
import { SelectInput, TextInput, Option, SubmitInput, DateTimePicker, Toggle, PullToRefresh } from "@components";
import { $cssTRBL, $uw } from "@theme";
import { useUserContext } from "@contexts";

export const Step1 =() => {
	const { setPage, refetchDashboard } = useUserContext();
	const [cookies, setCookies] = useCookies(["add_pet_step_1"]);
	const [noDay, setNoDay] = useState(false);
	const methods = useForm<
		Pick<PetCreate, "name" | "birthday" > 
	>({
		mode: "onSubmit",
		defaultValues: {
			...(cookies.add_pet_step_1 && {
				name: cookies.add_pet_step_1.name,
				birthday: cookies.add_pet_step_1.birthday
			}),
		},
	});
	const history = useHistory();
	const { t } = useTranslation();
	useEffect(() => {
		setPage({ name: "step 1 di 2" });
	}, []);

	const [addPetToMe, { loading }] = useAddPetToMeMutation({
        onCompleted: async (data) => {
            if (!data.addPetToMe.data?.pet.id) return;
            console.log("here");
            refetchDashboard();
			setCookies("add_pet_step_1", {
				...cookies.add_pet_step_1,
				pet_id: data.addPetToMe.data.pet.id,
			});	
            history.push("/pets/new/step2");
        },
    });



	return (
		<IonContent fullscreen>
		    <PullToRefresh />
			<FormProvider {...methods}>
				<Form
					onSubmit={methods.handleSubmit((data) => {		
						setCookies("add_pet_step_1", {
							...cookies.add_pet_step_1,
							...data
						});				
						addPetToMe({variables: {
							custodyLevel: CustodyLevel.Owner,
							data : {
								name: data.name,
								birthday: data.birthday,
							}
						}})
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
                        <span
                            dangerouslySetInnerHTML={{
                                __html:
                                    t(
                                        `pets.add_pet_page.step_1.birthday`,
                                    ) ?? "",
                            }}
                        />
                        <DateTimePicker
                            name="birthday"
                            textLabel="pets.add_pet_page.step_1.insert_birthday"
                            type="date"
							noDay={noDay}
                            required							
                        />
                    </Row>		
					<Row>
                        <span
                            dangerouslySetInnerHTML={{
                                __html:
                                    t(
                                        `pets.add_pet_page.step_1.no_day`,
                                    ) ?? "",
                            }}
                        />
                        <Toggle value={noDay} onChange={(v)=> setNoDay(v)} />
						<span> {t('pets.add_pet_page.step_1.no_day_warning')} </span>
                    </Row>						
					<SubmitInput color="primary" disabled={loading} >
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
	padding: ${$cssTRBL(2, 1)};
	.submit-input {
		margin-top: auto;		
	}
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
