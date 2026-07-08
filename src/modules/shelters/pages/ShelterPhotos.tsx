import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal, useAppContext } from "@contexts";
import { Icon, Image2x, MultiImageUploader, Picture } from "@components";
import { config } from "@config";
import { $color, $uw } from "@theme";

import { useListShelterMediasQuery } from "../operations/__generated__/listShelterMedias.generated";

export const ShelterPhotos: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pictures, setPictures] = useState<Picture[]>([]);

	useEffect(() => {
		setPage({ name: t("shelters.photos.title") });
	}, []);

	const { data, refetch } = useListShelterMediasQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				order_by: "created_at",
				order_direction: "desc",
				filters: {
					fixed: [
						{ key: "scope", value: "shelter_images" },
						{ key: "ref_id", value: id },
					],
				},
			},
		},
	});

	const medias = (data?.listMedias?.items ?? []).filter(
		(m): m is NonNullable<typeof m> => !!m
	);

	const openGallery = (startIndex: number) => {
		if (!medias.length) return;
		openModal({
			onClose: closeModal,
			children: (
				<GalleryPreview
					medias={medias.map((m) => ({ id: m.id }))}
					startIndex={startIndex}
				/>
			),
		});
	};

	const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;
		setPictures(
			Array.from(files).map((f) => ({
				url: URL.createObjectURL(f),
				type: f.type,
			}))
		);
		e.target.value = "";
	};

	return (
		<IonContent>
			<Header>
				<h2>{t("shelters.photos.title")}</h2>
				<AddButton
					type="button"
					onClick={() => fileInputRef.current?.click()}
				>
					<Icon name="add" color="light" size="18px" />
					<span>{t("shelters.photos.add")}</span>
				</AddButton>
			</Header>

			<Grid>
				{medias.map((m, i) => (
					<Cell
						key={m.id}
						role="button"
						tabIndex={0}
						onClick={() => openGallery(i)}
					>
						<Image2x id={m.id} />
					</Cell>
				))}
				{medias.length === 0 && (
					<Empty>{t("shelters.photos.empty")}</Empty>
				)}
			</Grid>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				style={{ display: "none" }}
				onChange={onPickFiles}
			/>

			<MultiImageUploader
				pictures={pictures}
				onClose={() => setPictures([])}
				refId={id}
				scope="shelter_images"
				onSaved={() => {
					setPictures([]);
					refetch();
				}}
			/>
		</IonContent>
	);
};

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 3px;
	padding-bottom: ${$uw(10)};
`;

const Cell = styled.div`
	aspect-ratio: 1/1;
	overflow: hidden;
	cursor: pointer;
	> .img2x {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

type GalleryPreviewProps = {
	medias: { id?: string | null }[];
	startIndex: number;
};

const GalleryPreview: React.FC<GalleryPreviewProps> = ({
	medias,
	startIndex,
}) => {
	const { webpSupported } = useAppContext();
	const total = medias.length;
	const normalize = (value: number) => ((value % total) + total) % total;
	const [activeIndex, setActiveIndex] = useState(() => normalize(startIndex));

	if (total === 0) return null;

	const goTo = (delta: number) =>
		setActiveIndex((prev) => normalize(prev + delta));

	const currentMedia = medias[activeIndex];
	const mediaBase = config.baseUrl?.replace("graphql", "media");
	const mediaSrc = currentMedia?.id
		? `${mediaBase}/${currentMedia.id}${webpSupported ? "?format=webp" : ""}`
		: undefined;

	return (
		<GalleryModalContent>
			<GalleryModalImage>
				{mediaSrc && <img src={mediaSrc} alt={currentMedia?.id ?? ""} />}
			</GalleryModalImage>
			<GalleryModalCounter>
				{activeIndex + 1}/{total}
			</GalleryModalCounter>
			{total > 1 && (
				<>
					<GalleryModalArrow
						type="button"
						className="left"
						onClick={() => goTo(-1)}
					>
						<Icon name="chevronBackOutline" color="light" />
					</GalleryModalArrow>
					<GalleryModalArrow
						type="button"
						className="right"
						onClick={() => goTo(1)}
					>
						<Icon name="chevronForwardOutline" color="light" />
					</GalleryModalArrow>
				</>
			)}
		</GalleryModalContent>
	);
};

const GalleryModalContent = styled.div`
	position: relative;
	width: 100%;
	min-height: 60dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${$uw(2)} ${$uw(2)} ${$uw(4)};
	box-sizing: border-box;
`;

const GalleryModalImage = styled.div`
	width: 100%;
	height: min(60dvh, ${$uw(50)});
	display: flex;
	align-items: center;
	justify-content: center;
	> img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
`;

const GalleryModalArrow = styled.button`
	position: absolute;
	bottom: ${$uw(1)};
	border: none;
	background: ${$color("dark")};
	width: ${$uw(3)};
	height: ${$uw(3)};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	&.left {
		left: 50%;
		transform: translateX(calc(-100% - ${$uw(0.5)}));
	}
	&.right {
		left: 50%;
		transform: translateX(${$uw(0.5)});
	}
`;

const GalleryModalCounter = styled.span`
	position: absolute;
	bottom: ${$uw(1)};
	right: ${$uw(2)};
	color: ${$color("primary")};
`;

const Empty = styled.p`
	grid-column: span 3;
	text-align: center;
	color: ${$color("medium")};
	padding: ${$uw(4)} 0;
	font-size: 1.5rem;
`;

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(3)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const AddButton = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	border: none;
	border-radius: 999px;
	padding: ${$uw(0.75)} ${$uw(1.25)};
	background: ${$color("primary")};
	color: ${$color("light")};
	cursor: pointer;
	> span {
		font-size: 1.4rem;
		font-weight: 600;
	}
`;
