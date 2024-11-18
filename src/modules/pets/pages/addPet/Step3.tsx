import { IonButton, IonContent } from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Modal } from "@components";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import { ImageCanvas } from "../../components/ImageCanvas";
import axios from "axios";
import { useCreateMediaMutation } from "../../../../components/operations/__generated__/createMedia.generated";
// import { useCreateMediaMutation } from "@graphql_generated/createMedia.generated";

export const Step3 = React.memo(() => {
    const { setPage, fadeBackground, refetchDashboard } = useUserContext();
    const [openEditImage, setEditImage] = useState(false);

    const [cookies, setCookies, removeCookie] = useCookies(["add_pet_step_1", "add_pet_step_2"]);
    const [prevImageURL, setPrevImageURL] = useState<string | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const history = useHistory();
    const fileInputRef = useRef<HTMLInputElement>(null);
	const [createMedia, loading] = useCreateMediaMutation({onCompleted: ()=>{
		refetchDashboard()
		removeCookie("add_pet_step_1")
		removeCookie("add_pet_step_2")
		setIsUploading(false);
		history.push("/")
	}, onError:()=>{
		setIsUploading(false);
	}})
    const { t } = useTranslation();

    useEffect(() => {
        setPage({ name: "step 3 di 3" });
        if (!cookies.add_pet_step_1) {
            return history.push("/pets/new/step1");
        }
        if (!cookies.add_pet_step_2) {
            return history.push("/pets/new/step2");
        }
		console.log(cookies.add_pet_step_2)
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

    const uploadImage = async () => {
        try {
            
			if(!croppedImageURL) return
			setIsUploading(true);

            // Convert base64 URL to Blob
            const response = await fetch(croppedImageURL);
            const blob = await response.blob();

            // Prepare FormData
            const formData = new FormData();
            formData.append("file", blob, `${cookies.add_pet_step_2.pet_id}.png`);

            // API Call
            const apiResponse = await axios.post("https://graph-a-pet.makso.me/media/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "User-Agent": "insomnia/8.6.1",
                },
            });
			const mediaData = apiResponse.data;
			createMedia({variables: { data : {
				type:"png",
				scope: "pet_main_picture",
				ref_id: cookies.add_pet_step_2.pet_id,
				main_colors: mediaData.main_colors,
				main_color: mediaData.main_colors[0],
				url: mediaData.public_url,

			}}})
            console.log("Upload Success:", apiResponse.data);
            
        } catch (error) {
            console.error("Upload Error:", error);          
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
                    setCroppedImageURL(prevImageURL);
                    setEditImage(false);
                    fadeBackground(false);
                }}
            >
                <ImageCanvas
                    imageUrl={imageURL ?? ""}
                    onCropChange={(croppedImageData) => {
                        setCroppedImageURL(croppedImageData);
                    }}
                />
            </Modal>

            <Container>
                <Intro>
                    <h3
                        dangerouslySetInnerHTML={{
                            __html: t("pets.add_pet_page.step_3.intro", {
                                name: cookies.add_pet_step_1?.name ?? "",
                            }) ?? "",
                        }}
                    />
                </Intro>
                <Row>
                    <ImageTaker
                        onClick={() =>
                            fileInputRef?.current ? fileInputRef.current.click() : undefined
                        }
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        {croppedImageURL && <img src={croppedImageURL} alt="Cropped" />}
                    </ImageTaker>
                </Row>
                <IonButton color="primary" onClick={uploadImage} disabled={isUploading}>
                    {isUploading ? "Uploading..." : t("pets.add_pet_page.step_3.continue")}
                </IonButton>
                <IonButton  disabled={isUploading} >{t("pets.add_pet_page.step_3.skip")}</IonButton>
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
