import { IonContent } from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Modal } from "@components";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import { ImageCanvas } from "../../components/ImageCanvas";

export const Step3 = React.memo(() => {
	const { setPage, fadeBackground } = useUserContext();
	const [openEditImage, setEditImage] = useState(false);

	const [cookies, setCookies] = useCookies([
		"add_pet_step_1",
		"add_pet_step_2",
		"add_pet_step_3",
	]);
	const [prevImageURL, setPrevImageURL] = useState<string | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null); // Store the cropped image
	const history = useHistory();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const methods = useForm<any>({
		mode: "onSubmit",
		defaultValues: {
			...(cookies.add_pet_step_3 && {
				breed: cookies.add_pet_step_3.breed,
			}),
		},
	});

	const { t } = useTranslation();

	useEffect(() => {
		setPage({ name: "step 3 di 3" });
		if (!cookies.add_pet_step_1) {
			history.push("/pets/new/step1");
		}
	}, []);

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			const tempImageURL = URL.createObjectURL(file);
			if (tempImageURL) {
				if (imageURL) setPrevImageURL(imageURL);
				setImageURL(tempImageURL);
				setEditImage(true);
				fadeBackground(true);
			}
		}
	};

	return (
		<IonContent fullscreen>
			<Modal
				open={openEditImage}
				onClose={() => {
					setImageURL(prevImageURL);
					setEditImage(false);
					fadeBackground(false);
				}}
				onConfirm={() => {
					setEditImage(false);
					fadeBackground(false);
				}}
				onCancel={() => {
					setImageURL(prevImageURL);
					setEditImage(false);
					fadeBackground(false);
				}}
			>
				<ImageCanvas
					imageUrl={imageURL ?? ""}
					onCropChange={(croppedImageData) => {
						console.log("Cropped Image Data:", croppedImageData);
						setCroppedImageURL(croppedImageData); // Update the cropped image data
					}}
				/>
			</Modal>

			<Container>
				<Intro>
					<h3
						dangerouslySetInnerHTML={{
							__html:
								t("pets.add_pet_page.step_3.intro", {
									name: cookies.add_pet_step_1?.name ?? "",
								}) ?? "",
						}}
					/>
				</Intro>
				<Row>
					<ImageTaker
						onClick={() =>
							fileInputRef?.current
								? fileInputRef.current.click()
								: undefined
						}
					>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
						{croppedImageURL && (
							<img src={croppedImageURL} alt="Cropped" />
						)}
					</ImageTaker>
				</Row>
			</Container>
		</IonContent>
	);
});

const Container = styled.div`
	width: 100%;
	height: 100%;
	padding-top: ${$uw(6)};
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
	background-color: ${$color("background-color")};
	border: 2px dashed ${$color("primary")};
	cursor: pointer;
	border-radius: 999px;
	text-align: center;
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		height: 100%;
	}
`;
