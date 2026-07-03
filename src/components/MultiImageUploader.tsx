import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Modal } from "./Modal";
import { Icon } from "./icons/Icon";
import { $color, $cssTRBL, $uw } from "@theme";
import { useCreateMediaMutation } from "./operations/__generated__/createMedia.generated";

export type Picture = { url: string; type: string };

type Props = {
	// immagini scelte dal parent (apre il modal quando > 0)
	pictures: Picture[];
	onClose: () => void;
	refId: string;
	scope: string;
	onSaved: () => void;
};

export const MultiImageUploader: React.FC<Props> = ({
	pictures,
	onClose,
	refId,
	scope,
	onSaved,
}) => {
	const { t } = useTranslation();
	const [items, setItems] = useState<Picture[]>(pictures);
	const [saving, setSaving] = useState(false);
	const [createMedia] = useCreateMediaMutation();

	useEffect(() => setItems(pictures), [pictures]);

	const close = () => {
		setItems([]);
		onClose();
	};

	const removePicture = (index: number) =>
		setItems((p) => p.filter((_, i) => i !== index));

	const uploadImage = async (image: Picture, index: number) => {
		const response = await fetch(image.url);
		const blob = await response.blob();
		const formData = new FormData();
		formData.append("file", blob, `${refId}_${Date.now()}_${index}.png`);
		formData.append("disable_colors", "true");
		const apiResponse = await axios.post(
			`${import.meta.env.VITE_MEDIA_URL}/upload`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } }
		);
		await createMedia({
			variables: {
				data: {
					type: image.type,
					scope,
					ref_id: refId,
					main_colors: [],
					url: apiResponse.data.public_url,
				},
			},
		});
	};

	const save = async () => {
		if (!items.length) {
			close();
			return;
		}
		try {
			setSaving(true);
			await Promise.all(items.map((img, i) => uploadImage(img, i)));
			toast.success(t("messages.success.pet_updated"));
			onSaved();
			setSaving(false);
			close();
		} catch (error) {
			console.error("Upload Error:", error);
			setSaving(false);
			toast.error(t("messages.errors.fetch"));
		}
	};

	return (
		<>
			<Modal
				open={items.length > 0}
				onClose={close}
				onCancel={close}
				onConfirm={save}
			>
				<PicturesContainer>
					{items.map((picture, i) => (
						<Thumb key={i}>
							<img src={picture.url} alt="preview" />
							<Remove onClick={() => removePicture(i)}>
								<Icon name="closeCircle" color="light" />
							</Remove>
						</Thumb>
					))}
				</PicturesContainer>
			</Modal>

			{saving && <Uploading>...</Uploading>}
		</>
	);
};

const PicturesContainer = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$cssTRBL(2)};
	box-sizing: border-box;
`;

const Thumb = styled.div`
	position: relative;
	width: calc(50% - ${$uw(0.5)});
	border-radius: 8px;
	overflow: hidden;
	background: ${$color("background")};
	> img {
		width: 100%;
		height: auto;
		display: block;
		object-fit: contain;
	}
`;

const Remove = styled.div`
	position: absolute;
	top: ${$uw(0.5)};
	right: ${$uw(0.5)};
	cursor: pointer;
	> .icon {
		width: ${$uw(2)};
		height: ${$uw(2)};
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
