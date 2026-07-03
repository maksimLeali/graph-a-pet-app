import { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Modal } from "./Modal";
import { Image2x } from "./Image2x";
import { $color, $uw } from "@theme";
import { ImageCanvas } from "../modules/pets/components/ImageCanvas";
import { useCreateMediaMutation } from "./operations/__generated__/createMedia.generated";
import { useUpdateMediaMutation } from "./operations/__generated__/updateMedia.generated";

type Props = {
	open: boolean;
	onClose: () => void;
	refId: string;
	scope: string;
	// se presente, la vecchia media viene demossa a questo scope (per le "main")
	demote?: { mediaId: string; scope: string };
	// media da mostrare in anteprima quando non c'è una nuova immagine
	previewMediaId?: string;
	onSaved: (newMediaId: string) => void;
};

export const SimpleImageEditor: React.FC<Props> = ({
	open,
	onClose,
	refId,
	scope,
	demote,
	previewMediaId,
	onSaved,
}) => {
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [prevImageURL, setPrevImageURL] = useState<string | null>(null);
	const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
	const [mode, setMode] = useState<"picker" | "crop">("picker");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { t } = useTranslation();
	const [createMedia, { loading: creating }] = useCreateMediaMutation();
	const [updateMedia, { loading: updating }] = useUpdateMediaMutation();

	const reset = () => {
		setUploadedUrl(null);
		setImageURL(null);
		setPrevImageURL(null);
		setCroppedImageURL(null);
		setMode("picker");
	};

	const close = () => {
		reset();
		onClose();
	};

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (!file) return;
		const tempImageURL = URL.createObjectURL(file);
		if (!tempImageURL) return;
		if (imageURL) setPrevImageURL(imageURL);
		setImageURL(tempImageURL);
		setMode("crop");
	};

	const uploadImage = async () => {
		try {
			if (!croppedImageURL) return;
			setIsUploading(true);
			const response = await fetch(croppedImageURL);
			const blob = await response.blob();
			const formData = new FormData();
			formData.append("file", blob, `${refId}.png`);
			const apiResponse = await axios.post(
				`${import.meta.env.VITE_MEDIA_URL}/upload`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			setUploadedUrl(apiResponse.data.public_url);
			setIsUploading(false);
		} catch (error) {
			console.error("Upload Error:", error);
			setIsUploading(false);
			toast.error(t("messages.errors.fetch"));
		}
	};

	const save = async () => {
		try {
			if (!uploadedUrl) {
				close();
				return;
			}
			// demota la vecchia principale (se richiesto)
			if (demote) {
				await updateMedia({
					variables: {
						id: demote.mediaId,
						data: { scope: demote.scope },
					},
				});
			}
			const res = await createMedia({
				variables: {
					data: {
						url: uploadedUrl,
						scope,
						ref_id: refId,
						type: "png",
					},
				},
			});
			const newId = res.data?.createMedia?.media?.id;
			if (!newId) throw new Error();
			toast.success(t("messages.success.pet_updated"));
			onSaved(newId);
		} catch {
			toast.error(t("messages.errors.fetch"));
		}
		close();
	};

	return (
		<>
			<Modal
				open={open}
				onClose={
					mode === "crop"
						? () => {
								setImageURL(prevImageURL);
								setMode("picker");
						  }
						: close
				}
				onCancel={
					mode === "crop"
						? () => {
								setImageURL(prevImageURL);
								setCroppedImageURL(prevImageURL);
								setMode("picker");
						  }
						: close
				}
				onConfirm={
					mode === "crop"
						? () => {
								setMode("picker");
								uploadImage();
						  }
						: save
				}
			>
				{mode === "crop" ? (
					<ImageCanvas
						imageUrl={imageURL ?? ""}
						onCropChange={(cropped) => setCroppedImageURL(cropped)}
					/>
				) : (
					<Col>
						<ImageTaker
							onClick={(e) => {
								e.stopPropagation();
								fileInputRef.current?.click();
							}}
						>
							<input
								type="file"
								accept="image/*;capture=camera"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
							{croppedImageURL || imageURL ? (
								<img
									src={(croppedImageURL ?? imageURL) as string}
									alt="preview"
								/>
							) : previewMediaId ? (
								<Image2x id={previewMediaId} />
							) : null}
						</ImageTaker>
					</Col>
				)}
			</Modal>

			{(isUploading || creating || updating) && <Uploading>...</Uploading>}
		</>
	);
};

const Col = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: ${$uw(2)};
	padding: ${$uw(2)} 0;
`;

const ImageTaker = styled.div`
	width: ${$uw(20)};
	height: ${$uw(20)};
	display: flex;
	align-items: center;
	align-self: center;
	justify-content: center;
	background-color: ${$color("background-color")};
	border: 3px solid ${$color("primary")};
	cursor: pointer;
	border-radius: 999px;
	text-align: center;
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const Uploading = styled.div`
	position: fixed;
	inset: 0;
	z-index: 300;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	color: ${$color("light")};
	background: rgba(0, 0, 0, 0.4);
`;
