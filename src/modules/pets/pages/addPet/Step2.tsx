import { IonButton, IonContent } from "@ionic/react";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Chip, Modal } from "@components";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import { ImageCanvas } from "../../components/ImageCanvas";
import axios from "axios";
import { useCreateMediaMutation } from "../../../../components/operations/__generated__/createMedia.generated";
import { MainColor, Media } from "@types";
// import { useCreateMediaMutation } from "@graphql_generated/createMedia.generated";

export const Step2 = React.memo(() => {
    const { setPage, fadeBackground, refetchDashboard } = useUserContext();
    const [openEditImage, setEditImage] = useState(false);
    const [media, setMedia] = useState<{
        type: string;
        scope: string;
        ref_id: string;
        main_colors: MainColor[];
        main_color: MainColor;
        url: string;
    }>();
    const [cookies, setCookies, removeCookie] = useCookies([
        "add_pet_step_1",
        "add_pet_step_2",
    ]);
    const [petColor, setPetColor] = useState({
        color: "primary",
        contrast: "#ffffff",
    });
    const [prevImageURL, setPrevImageURL] = useState<string | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const history = useHistory();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [createMedia, {loading}] = useCreateMediaMutation({
        onCompleted: () => {
            refetchDashboard();            
            setIsUploading(false);
            history.push("/");
        },
        onError: () => {
            setIsUploading(false);
        },
    });
    const { t } = useTranslation();

    useEffect(() => {
        setPage({ name: "step 2 di 2" });
        if (!cookies.add_pet_step_1) {
            return history.push("/pets/new/step1");
        }
    }, []);


    const handleCreateMedia = useCallback(async ()=>{
        if(!cookies.add_pet_step_1.pet_id || !media) return
        await createMedia({variables: {data: {
            ...media,
            ref_id: cookies.add_pet_step_1.pet_id,
            main_color: petColor
        }}})

        history.push("/pets/new/step3")
    },[media, petColor])

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

    const chooseColors= useMemo(()=>{
        if(!media?.main_colors || isUploading) return [
            {
                color: "gray",
                contrast: "#FFFFFF",
                key: 'gray1'
            },
            {
                color: "gray",
                contrast: "#FFFFFF",
                key: 'gray2'
                
            },
            {
                color: "gray",
                contrast: "#FFFFFF",
            },
            {
                color: "gray",
                contrast: "#FFFFFF",
            },
            {
                color: "gray",
                contrast: "#FFFFFF",
            },
            {
                color: "gray",
                contrast: "#FFFFFF",
            },
        ]
        return [
            media.main_colors[3],
            media.main_colors[1],
            media.main_colors[0],
            {
                color: "primary",
                contrast: "#FFFFFF",
                id: "no_color"
            },
            media.main_colors[2],
            media.main_colors[4],

        ]
    }, [media?.main_colors, isUploading])

    const uploadImage = async () => {
        try {
            if (!croppedImageURL) return;
            setIsUploading(true);

            // Convert base64 URL to Blob
            const response = await fetch(croppedImageURL);
            const blob = await response.blob();

            // Prepare FormData
            const formData = new FormData();
            formData.append(
                "file",
                blob,
                `${cookies.add_pet_step_1.pet_id}.png`
            );

            // API Call
            const apiResponse = await axios.post(
                `https://graph-a-pet.makso.me/media/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "User-Agent": "insomnia/8.6.1",
                    },
                }
            );
            const mediaData = apiResponse.data;
            setMedia({
                type: "png",
                scope: "pet_main_picture",
                ref_id: cookies.add_pet_step_1.pet_id,
                main_colors: mediaData.main_colors,
                main_color: mediaData.main_colors[0],
                url: mediaData.public_url,
            });
            setPetColor(mediaData.main_colors[0])
            console.log("Upload Success:", apiResponse.data);
            setIsUploading(false);
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
                    uploadImage();
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
                            __html: t("pets.add_pet_page.step_2.intro") ?? "",
                        }}
                    />
                </Intro>
                <Col>
                    <ImageTaker
                        $petColor={petColor.color}
                        $uploaded={!!media}
                        onClick={() =>
                            fileInputRef?.current
                                ? fileInputRef.current.click()
                                : undefined
                        }
                    >
                        <input
                            type="file"
                            accept="image/*;capture=camera"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        {croppedImageURL && (
                            <img src={croppedImageURL} alt="Cropped" />
                        )}
                    </ImageTaker>
                
                
                    <Chip
                        label={cookies.add_pet_step_1?.name}
                        color={petColor.color}
                    />
                
                {chooseColors.length > 0 && (
                    <Row>
                        {chooseColors.map((mainColor, i) => (
                            <Dot
                                disabled={!media}
                                key={`${mainColor.color}_${i}`}
                                $mainColor={mainColor.color}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPetColor(mainColor);
                                }}
                            />
                        ))}
                    </Row>
                )}
                </Col>
                { media && 
                    <IonButton
                        color="primary"
                        onClick={(e)=>{
                            e.preventDefault();
                            handleCreateMedia();
                        }}
                        disabled={isUploading || loading}
                    >
                        {isUploading
                            ? "Uploading..."
                            : t("pets.add_pet_page.step_2.save_picture")}
                    </IonButton>
                }
                <IonButton
                    disabled={isUploading || loading}
                    onClick={(e) => {
                        e.preventDefault();
                        return history.push("/pets/new/step3");
                    }}
                >
                    {t("pets.add_pet_page.step_2.skip")}
                </IonButton>
            </Container>
        </IonContent>
    );
});

const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: ${$cssTRBL(1, 1, 2)};
    display: flex;
    flex-direction: column;
    
    overflow-y: scroll;    
    gap: ${$uw(2)};
`;

const Intro = styled.div`
    width: 100%;
    margin-bottom: ${$uw(2)};
`;

const Row = styled.div`
    display: flex;
    justify-content: center;
    gap: ${$uw(3)};
    &.space{
        margin-bottom: ${$uw(4)};
    }
    
`;
const Col = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${$uw(2)};
    margin-bottom: auto;
    /* margin-bottom: ${$uw(4)}; */
    
    
`;

const ImageTaker = styled.div<{ $petColor: string; $uploaded: boolean }>`
    width: ${$uw(20)};
    height: ${$uw(20)};
    display: flex;
    align-items: center;
    align-self: center;
    justify-content: center;
    background-color: ${$color("background-color")};
    border: 3px ${({ $uploaded }) => ($uploaded ? "solid" : "dashed")} ${({ $petColor }) => $color($petColor)};
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

const Dot = styled.span<{ $mainColor: string, disabled: boolean }>`
    width: ${$uw(1.5)};
    height: ${$uw(1.5)};
    border: 1px solid ${$color("dark")};
    background-color: ${({ $mainColor }) => $color($mainColor)};
    border-radius: 100%;
    ${({disabled})=> disabled? "pointer-events: none;" : ""}
    ${({disabled})=> disabled? "opacity: .5;" : ""}
`;
