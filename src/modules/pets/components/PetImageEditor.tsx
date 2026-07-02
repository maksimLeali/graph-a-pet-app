import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Chip, Modal, Image2x } from "@components";
import { $color, $uw } from "@theme";
import { ImageCanvas } from "./ImageCanvas";
import { useCreateMediaMutation } from "../../../components/operations/__generated__/createMedia.generated";
import { useUpdateMediaMutation } from "../../../components/operations/__generated__/updateMedia.generated";
import { MainColor } from "@types";

type Color = { color: string; contrast: string };

type Props = {
	open: boolean;
	onClose: () => void;
	petId: string;
	petName?: string;
	mediaId?: string;
	mainColors?: Color[];
	mainColor?: Color;
	onSaved: () => void;
};

const GRAY: Color = { color: "gray", contrast: "#FFFFFF" };

export const PetImageEditor: React.FC<Props> = ({
	open,
	onClose,
	petId,
	petName,
	mediaId,
	mainColors,
	mainColor,
	onSaved,
}) => {
	const [petColor, setPetColor] = useState<Color>(
		mainColor ?? { color: "primary", contrast: "#ffffff" }
	);
	const [media, setMedia] = useState<{
		type: string;
		scope: string;
		ref_id: string;
		main_colors: MainColor[];
		main_color: MainColor;
		url: string;
	}>();
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [prevImageURL, setPrevImageURL] = useState<string | null>(null);
	const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
	const [mode, setMode] = useState<"picker" | "crop">("picker");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { t } = useTranslation();
	const [createMedia, { loading: creating }] = useCreateMediaMutation();
	const [updateMedia, { loading: updating }] = useUpdateMediaMutation();

	// colori disponibili: quelli della nuova immagine, altrimenti quelli correnti
	const sourceColors = media?.main_colors ?? mainColors;

	const chooseColors = useMemo<Color[]>(() => {
		if (!sourceColors?.length || isUploading) {
			return Array.from({ length: 6 }, () => GRAY);
		}
		return [
			sourceColors[3] ?? GRAY,
			sourceColors[1] ?? GRAY,
			sourceColors[0] ?? GRAY,
			{ color: "primary", contrast: "#FFFFFF" },
			sourceColors[2] ?? GRAY,
			sourceColors[4] ?? GRAY,
		];
	}, [sourceColors, isUploading]);

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
			formData.append("file", blob, `${petId}.png`);
			const apiResponse = await axios.post(
				`${import.meta.env.VITE_MEDIA_URL}/upload`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			const mediaData = apiResponse.data;
			setMedia({
				type: "png",
				scope: "pet_main_picture",
				ref_id: petId,
				main_colors: mediaData.main_colors,
				main_color: mediaData.main_colors[0],
				url: mediaData.public_url,
			});
			setPetColor(mediaData.main_colors[0]);
			setIsUploading(false);
		} catch (error) {
			console.error("Upload Error:", error);
			setIsUploading(false);
		}
	};

	const save = async () => {
		// ripulisci da __typename ecc. (l'input accetta solo color/contrast)
		const clean = (c: Color) => ({ color: c.color, contrast: c.contrast });
		try {
			if (media) {
				// prima demota la vecchia (così resta una sola pet_main_picture)
				if (mediaId) {
					await updateMedia({
						variables: {
							id: mediaId,
							data: { scope: "pet_picture" },
						},
					});
				}
				// poi crea la nuova principale
				const res = await createMedia({
					variables: {
						data: {
							url: media.url,
							scope: "pet_main_picture",
							ref_id: petId,
							type: "png",
							main_colors: media.main_colors.map(clean),
							main_color: clean(petColor),
						},
					},
				});
				if (!res.data?.createMedia?.media) throw new Error();
			} else if (mediaId) {
				// solo cambio colore
				const res = await updateMedia({
					variables: {
						id: mediaId,
						data: { main_color: clean(petColor) },
					},
				});
				if (!res.data?.updateMedia?.success) throw new Error();
			} else {
				onClose();
				return;
			}
			toast.success(t("messages.success.pet_updated"));
			onSaved();
		} catch {
			toast.error(t("messages.errors.fetch"));
		}
		onClose();
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
						: onClose
				}
				onCancel={
					mode === "crop"
						? () => {
								setImageURL(prevImageURL);
								setCroppedImageURL(prevImageURL);
								setMode("picker");
						  }
						: onClose
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
							$petColor={petColor.color}
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
									alt="pet"
								/>
							) : mediaId ? (
								<Image2x id={mediaId} />
							) : null}
						</ImageTaker>

						{petName && (
							<Chip label={petName} color={petColor.color} />
						)}

						<Row>
							{chooseColors.map((c, i) => (
								<Dot
									key={`${c.color}_${i}`}
									$mainColor={c.color}
									$disabled={!sourceColors?.length}
									onClick={(e) => {
										e.preventDefault();
										setPetColor(c);
									}}
								/>
							))}
						</Row>
					</Col>
				)}
			</Modal>

			{(isUploading || creating || updating) && (
				<Uploading>...</Uploading>
			)}
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

const Row = styled.div`
	display: flex;
	justify-content: center;
	gap: ${$uw(3)};
`;

const ImageTaker = styled.div<{ $petColor: string }>`
	width: ${$uw(20)};
	height: ${$uw(20)};
	display: flex;
	align-items: center;
	align-self: center;
	justify-content: center;
	background-color: ${$color("background-color")};
	border: 3px solid ${({ $petColor }) => $color($petColor)};
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

const Dot = styled.span<{ $mainColor: string; $disabled: boolean }>`
	width: ${$uw(1.5)};
	height: ${$uw(1.5)};
	border: 1px solid ${$color("dark")};
	background-color: ${({ $mainColor }) => $color($mainColor)};
	border-radius: 100%;
	cursor: pointer;
	${({ $disabled }) => ($disabled ? "pointer-events: none; opacity: .5;" : "")}
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
