import { IonButton, IonContent } from "@ionic/react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";

import {
	SelectInput,
	TextInput,
	Option,
	SubmitInput,
	FileInput,
	Modal,
	FakeInput,
} from "@components";
import { useUserContext } from "@contexts";
import { $cssTRBL, $uw } from "@theme";
import { BREEDS } from "@utils";
import { BreedSeletor } from "../../components";

export const Step2 = React.memo(() => {
	const { setPage, fadeBackground } = useUserContext();
	const [breedText, setBreedText] = useState("");
	const [selectedBreed, setSelectedBreed] = useState<Option | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [cookies, setCookies] = useCookies([
		"add_pet_step_1",
		"add_pet_step_2",
	]);
	const [imageURL, setImageURL] = useState<string | null>(null);

	const history = useHistory();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const openBreedsModal = useCallback(() => {
		setOpenModal(true);
		fadeBackground(true);
	}, [breedText, selectedBreed, openModal]);

	const handleFileChange = (event:any) => {
		const file = event.target.files[0];
		if (file) {
			const imageURL = URL.createObjectURL(file);
			if(imageURL){

				setImageURL(imageURL);
			}
		}
	};

	return (
		<IonContent fullscreen>
			<Modal
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					fadeBackground(false);
				}}
				onCancel={() => {
					setOpenModal(false);
					fadeBackground(false);
				}}
				onConfirm={() => {
					setOpenModal(false);
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
					<ImageTaker onClick={() => fileInputRef?.current ? fileInputRef.current.click() : undefined}>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
						{imageURL ? (
							<img
								src={imageURL}
								alt="Selected"
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						) : (
							t("pets.add_pet_page.step_2.upload_image")
						)}
					</ImageTaker>
					<Row>
						<span>{t("pets.add_pet_page.step_2.breed")}</span>
						<FakeInput
							name="breed"
							textLabel="pets.add_pet_page.step_2.breed"
							onClick={openBreedsModal}
							value={breedText}
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

const ImageTaker = styled.div`
	width: 100%;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
	border: 2px dashed #ccc;
	cursor: pointer;
	text-align: center;
	padding: ${$uw(2)};
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		height: auto;
	}
`;
