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
} from "@components";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
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

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			const imageURL = URL.createObjectURL(file);
			if (imageURL) {

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
			<Container>
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
							t("pets.add_pet_page.step_2.picture")
						)}
					</ImageTaker>
				</Row>
				<Row>
					<span>{t("pets.add_pet_page.step_2.breed")}</span>
					<FakeInput
						name="breed"
						textLabel="pets.add_pet_page.step_2.breed"
						onClick={openBreedsModal}
						value={breedText}
					/>
				</Row>
			</Container>
		</IonContent>
	);
});

const Container = styled.div`
	width: 100%;
	height: 100%;
	padding-top:${$uw(6)};
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow-y: scroll;
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
	width: ${$uw(24)};
	height: ${$uw(24)};
	display: flex;
	margin-bottom: ${$uw(3)};
	align-items: center;
	align-self: center;
	justify-content: center;
	background-color: ${$color('background-color')};
	border: 2px dashed ${$color('primary')};
	cursor: pointer;
	border-radius: 999px;
	text-align: center;
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}
`;
