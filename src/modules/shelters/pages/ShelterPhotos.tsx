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
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";

const PET_IMAGE_SCOPES = ["pet_main_picture", "pet_picture"];

export const ShelterPhotos: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pictures, setPictures] = useState<Picture[]>([]);
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const toggle = (petId: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			next.has(petId) ? next.delete(petId) : next.add(petId);
			return next;
		});

	useEffect(() => {
		setPage({ name: t("shelters.photos.title") });
	}, []);

	const { data: petsData } = useListShelterPetsMinQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});

	const pets = (petsData?.listShelterPets?.items ?? [])
		.filter((p): p is NonNullable<typeof p> => !!p)
		.map((sp) => sp.pet);
	const petIds = pets.map((p) => p.id);

	// 1 sola chiamata: immagini shelter + immagini pet.
	// scope IN [shelter_images, ...pet] AND ref_id IN [shelterId, ...petIds];
	// i ref_id sono univoci per entità, niente combinazioni spurie.
	const { data, refetch } = useListShelterMediasQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 500,
				order_by: "created_at",
				order_direction: "desc",
				filters: {
					lists: [
						{ key: "scope", value: ["shelter_images", ...PET_IMAGE_SCOPES] },
						{ key: "ref_id", value: [id, ...petIds] },
					],
				},
			},
		},
	});

	const allItems = (data?.listMedias?.items ?? []).filter(
		(m): m is NonNullable<typeof m> => !!m
	);
	const shelterMedias = allItems.filter((m) => m.scope === "shelter_images");
	const medias = allItems.filter((m) => m.scope !== "shelter_images");

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

	// raggruppa per cane, mantiene l'ordine dei pet dello shelter
	const byPet = new Map<string, typeof medias>();
	medias.forEach((m) => {
		const arr = byPet.get(m.ref_id) ?? [];
		arr.push(m);
		byPet.set(m.ref_id, arr);
	});
	const groups = pets
		.map((pet) => ({ pet, medias: byPet.get(pet.id) ?? [] }))
		.filter((g) => g.medias.length > 0);

	// carosello unico: foto shelter + foto pet (con tag del pet)
	const carousel: GallerySlide[] = [
		...shelterMedias.map((m) => ({ id: m.id })),
		...groups.flatMap((g) =>
			g.medias.map((m) => ({ id: m.id, petName: g.pet.name }))
		),
	];

	const openGallery = (mediaId: string) => {
		const startIndex = carousel.findIndex((s) => s.id === mediaId);
		if (startIndex < 0) return;
		openModal({
			onClose: closeModal,
			children: (
				<GalleryPreview medias={carousel} startIndex={startIndex} />
			),
		});
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

			{shelterMedias.length > 0 && (
				<PetSection>
					<Grid>
						{shelterMedias.map((m) => (
							<Cell
								key={m.id}
								role="button"
								tabIndex={0}
								onClick={() => openGallery(m.id)}
							>
								<Image2x id={m.id} />
							</Cell>
						))}
					</Grid>
				</PetSection>
			)}

			{groups.length === 0 && shelterMedias.length === 0 && (
				<Empty>{t("shelters.photos.empty")}</Empty>
			)}

			{groups.map(({ pet, medias: petMedias }) => {
				const isOpen = expanded.has(pet.id);
				return (
					<PetSection key={pet.id}>
						<PetTitle
							type="button"
							onClick={() => toggle(pet.id)}
						>
							<Chevron
								name="chevronForwardOutline"
								color="primary"
								className={isOpen ? "open" : ""}
							/>
							<span>{pet.name}</span>
							<Count>{petMedias.length}</Count>
						</PetTitle>
						{isOpen && (
							<Grid>
								{petMedias.map((m) => (
									<Cell
										key={m.id}
										role="button"
										tabIndex={0}
										onClick={() => openGallery(m.id)}
									>
										<Image2x id={m.id} />
									</Cell>
								))}
							</Grid>
						)}
					</PetSection>
				);
			})}

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

const PetSection = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(0.5)} 12px 0;
`;

const PetTitle = styled.button`
	width: 100%;
	margin: 0 0 ${$uw(0.5)};
	padding: 0;
	background: none;
	border: none;
	cursor: pointer;
	font-size: 1.5rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
	> span {
		font-weight: 700;
	}
`;

const Chevron = styled(Icon)`
	width: ${$uw(1.5)};
	height: ${$uw(1.5)};
	transition: transform 0.15s ease;
	&.open {
		transform: rotate(90deg);
	}
`;

const Count = styled.span`
	min-width: ${$uw(2.5)};
	height: ${$uw(2.5)};
	padding: 0 ${$uw(0.75)};
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.15);
	color: ${$color("primary")};
	font-size: 1.3rem;
	font-weight: 700;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 3px;
	padding-bottom: ${$uw(1)};
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

type GallerySlide = { id: string; petName?: string };

type GalleryPreviewProps = {
	medias: GallerySlide[];
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
				{currentMedia?.petName && (
					<PetTag>{currentMedia.petName}</PetTag>
				)}
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
	position: relative;
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

const PetTag = styled.span`
	position: absolute;
	top: ${$uw(0.75)};
	right: ${$uw(0.75)};
	max-width: 60%;
	padding: ${$uw(0.4)} ${$uw(0.9)};
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.3rem;
	font-weight: 700;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
