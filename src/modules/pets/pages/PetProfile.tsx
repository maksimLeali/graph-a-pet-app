import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useParams, useHistory, useLocation } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import {
	useGetFullPetLazyQuery,
	GetFullPetQuery,
} from "../operations/__generated__/getFullPet.generated";
import { useUpdatePetMutation } from "../operations/__generated__/updatePet.generated";
import { useDeletePetMutation } from "../operations/__generated__/deletePet.generated";
import { useListPetWalkRatingsLazyQuery } from "../operations/__generated__/listPetWalkRatings.generated";
import { MinPetFragment } from "@graphql_generated/minPet.generated";

type FullPet = NonNullable<GetFullPetQuery["getPet"]["pet"]>;

import { useUserContext, useModal, useAppContext } from "@contexts";
import { config } from "@config";
import {
	Image2x,
	SelectInput,
	TextInput,
	NumberInput,
	DateTimePicker,
	Toggle,
	Icon,
	Option,
	AppointmentsList,
	MultiImageUploader,
	WalkRatingsSummaryCard, PullToRefresh } from "@components";
import { AppointmentFragment } from "@graphql_generated/appointment.generated";
import { BreedSeletor } from "../components";
import { PetImageEditor } from "../components/PetImageEditor";
import { Gender, CoatLength, PetUpdate, WalkRatingType } from "@types";
import { gendersColor } from "@utils";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

export const PetProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { setPage } = useUserContext();
	const [pet, setPet] = useState<FullPet>();
	const { t } = useTranslation();
	const location = useLocation();

	const [getPet, { loading }] = useGetFullPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getPet }) => {
			if (!getPet?.pet || getPet.error) return;
			setPet(getPet.pet);
		},
	});

	const loadPet = () =>
		getPet({
			variables: {
				id,
				date_from: dayjs().startOf("day").toISOString(),
				date_to: dayjs().add(7, "day").endOf("day").toISOString(),
			},
		});

	useEffect(() => {
		setPage({ name: t("home.profile") });
	}, []);

	// load su mount + a ogni navigazione (ritorno da evento eliminato → eventi freschi)
	useEffect(() => {
		loadPet();
	}, [id, location.key]);

	return (
		<IonContent>
		    <PullToRefresh />
			{pet ? (
				<PetDetailBody
					pet={pet}
					reload={loadPet}
					onSaved={(p) =>
						setPet((prev) => (prev ? { ...prev, ...p } : prev))
					}
				/>
			) : (
				<Header>
					<PetImage className={loading ? "skeleton" : ""} />
					<h2 className={loading ? "skeleton" : ""} />
				</Header>
			)}
		</IonContent>
	);
};

type detailProps = {
	pet: FullPet;
	reload: () => void;
	onSaved: (p: MinPetFragment) => void;
	// sezione extra iniettata sotto l'header (es. collocazione shelter)
	topSection?: React.ReactNode;
	// dove tornare dopo l'eliminazione (default lista pet personali)
	deleteRedirect?: string;
};

type EditableField = "name" | "gender" | "birthday" | "weight_kg" | "coat_length";

type WalkRatingAvg = { type: WalkRatingType; rating: number };

export const PetDetailBody: React.FC<detailProps> = ({
	pet,
	reload,
	onSaved,
	topSection,
	deleteRedirect = "/pets",
}) => {
	const { t } = useTranslation();
	const { t: breedT } = useTranslation("breeds");
	const { openModal, closeModal } = useModal();
	const { refetchDashboard } = useUserContext();
	const history = useHistory();
	const [imgOpen, setImgOpen] = useState(false);
	const [walkRatings, setWalkRatings] = useState<WalkRatingAvg[]>([]);

	const [fetchWalkRatings] = useListPetWalkRatingsLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ listWalkRatings }) => {
			const items = (listWalkRatings?.items ?? []).filter(
				(r): r is NonNullable<typeof r> => !!r
			);
			// average rating per type across all the pet's walks
			const acc = new Map<WalkRatingType, { sum: number; count: number }>();
			for (const r of items) {
				const cur = acc.get(r.type) ?? { sum: 0, count: 0 };
				acc.set(r.type, { sum: cur.sum + r.rating, count: cur.count + 1 });
			}
			setWalkRatings(
				Object.values(WalkRatingType)
					.filter((type) => acc.has(type))
					.map((type) => {
						const { sum, count } = acc.get(type)!;
						return {
							type,
							rating: Math.round((sum / count) * 10) / 10,
						};
					})
			);
		},
	});

	useEffect(() => {
		fetchWalkRatings({
			variables: {
				commonSearch: {
					filters: {
						join: [
							{
								key: "walks",
								value: {
									join: [
										{
											key: "treatments",
											value: {
												join: [
													{
														key: "health_cards",
														value: {
															lists: [
																{
																	key: "pet_id",
																	value: [pet.id],
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
					},
				},
			},
		});
	}, [pet.id]);
	const [galleryPics, setGalleryPics] = useState<
		{ url: string; type: string }[]
	>([]);

	const onPickGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;
		setGalleryPics(
			Array.from(files).map((f) => ({
				url: URL.createObjectURL(f),
				type: f.type,
			}))
		);
		e.target.value = "";
	};

	const methods = useForm<{
		name: string;
		gender: Gender;
		birthday: string;
		weight_kg: string;
		coat_length: CoatLength;
	}>({
		mode: "onSubmit",
		defaultValues: {
			name: pet.name,
			gender: pet.gender ?? undefined,
			birthday: pet.birthday ?? undefined,
			weight_kg: pet.weight_kg != null ? String(pet.weight_kg) : "",
			coat_length: pet.coat_length ?? undefined,
		},
	});

	useEffect(() => {
		methods.reset({
			name: pet.name,
			gender: pet.gender ?? undefined,
			birthday: pet.birthday ?? undefined,
			weight_kg: pet.weight_kg != null ? String(pet.weight_kg) : "",
			coat_length: pet.coat_length ?? undefined,
		});
	}, [pet]);

	const [updatePet] = useUpdatePetMutation({
		onCompleted: ({ updatePet }) => {
			if (!updatePet?.success || updatePet.error) {
				toast.error(
					updatePet?.error?.message
						? t(updatePet.error.message as I18NKey)
						: t("messages.errors.fetch")
				);
				return;
			}
			toast.success(t("messages.success.pet_updated"));
			if (updatePet.pet) onSaved(updatePet.pet);
		},
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const saveField = (data: PetUpdate) =>
		updatePet({ variables: { id: pet.id, data } });

	const [deletePet] = useDeletePetMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const confirmDelete = () =>
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				const res = await deletePet({ variables: { id: pet.id } });
				const del = res.data?.deletePet;
				if (!del?.success || del.error) {
					toast.error(t("messages.errors.fetch"));
					return;
				}
				toast.success(t("messages.success.pet_deleted"));
				refetchDashboard();
				closeModal();
				history.replace(deleteRedirect);
			},
			children: (
				<ConfirmBox>
					<ConfirmTitle>{t("pets.delete_title")}</ConfirmTitle>
					<ConfirmText>
						{t("pets.delete_confirm", { name: pet.name })}
					</ConfirmText>
				</ConfirmBox>
			),
		});

	const genderOptions: Option[] = Object.values(Gender).map((k) => ({
		value: k,
		label: t(`pets.gender_${k.toLowerCase()}` as I18NKey),
	}));

	const coatOptions: Option[] = Object.values(CoatLength).map((k) => ({
		value: k,
		label: t(`pets.coat_lengths.${k.toLowerCase()}` as I18NKey),
	}));

	const events = (pet.health_card?.treatments?.items ?? []).filter(Boolean);
	const pictures = (pet.pictures?.items ?? []).filter(Boolean);

	const openGallery = (startIndex: number) => {
		const medias = pictures.map((m) => ({ id: m!.id }));
		if (!medias.length) return;
		openModal({
			onClose: () => closeModal(),
			children: <GalleryPreview medias={medias} startIndex={startIndex} />,
		});
	};

	// annulla / X: ripristina il valore salvato
	const revert = (field: EditableField) => () => {
		methods.setValue(field, (pet as any)[field] ?? undefined);
		closeModal();
	};

	const openFieldEdit = (
		field: EditableField,
		inputNode: React.ReactNode,
		buildData: () => PetUpdate
	) => {
		openModal({
			onClose: revert(field),
			onCancel: revert(field),
			onConfirm: async () => {
				const ok = await methods.trigger(field);
				if (!ok) return;
				await saveField(buildData());
				closeModal();
			},
			children: (
				<FormProvider {...methods}>
					<ModalField>{inputNode}</ModalField>
				</FormProvider>
			),
		});
	};

	const openBreedEdit = () => {
		const initial: Option | null = pet.breed
			? { value: pet.breed, label: breedT(pet.breed.toLowerCase()) }
			: null;
		const ref = { current: initial };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				if (ref.current) {
					await saveField({ breed: String(ref.current.value) });
				}
				closeModal();
			},
			children: (
				<ModalField>
					<BreedEditor
						initial={initial}
						onChange={(o) => (ref.current = o)}
					/>
				</ModalField>
			),
		});
	};

	const openNeuteredEdit = () => {
		const ref = { current: !!pet.neutered };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				await saveField({ neutered: ref.current });
				closeModal();
			},
			children: (
				<ModalField>
					<NeuteredEditor
						initial={!!pet.neutered}
						onChange={(v) => (ref.current = v)}
						yes={t("pets.yes")}
						no={t("pets.no")}
					/>
				</ModalField>
			),
		});
	};

	return (
		<>
			<Header>
				<PetImage
					role="button"
					tabIndex={0}
					$borderColor={pet.main_picture?.main_color?.color}
					onClick={() => setImgOpen(true)}
				>
					{pet.main_picture ? (
						<Image2x id={pet.main_picture.id} />
					) : (
						<Fill />
					)}
				</PetImage>
				<NameRow
					role="button"
					tabIndex={0}
					$bg={pet.main_picture?.main_color?.color}
					$fg={pet.main_picture?.main_color?.contrast}
					onClick={() =>
						openFieldEdit(
							"name",
							<TextInput
								name="name"
								textLabel="pets.name"
								bgColor="light"
								required
							/>,
							() => ({ name: methods.getValues("name") })
						)
					}
				>
					<IconContainer>
						<Icon
							size="100%"
							color={gendersColor[pet.gender ?? Gender.NotSaid].color}
							name={gendersColor[pet.gender ?? Gender.NotSaid].iconName}
						/>
					</IconContainer>
					<span className="mainInfo">{pet.name}</span>
				</NameRow>
			</Header>

			{topSection}

			<Fields>
				<Row
					label={t("pets.gender")}
					value={
						pet.gender
							? t(`pets.gender_${pet.gender.toLowerCase()}` as I18NKey)
							: "—"
					}
					onEdit={() =>
						openFieldEdit(
							"gender",
							<SelectInput
								name="gender"
								options={genderOptions}
								bgColor="light"
								required
								textLabel="pets.gender"
							/>,
							() => ({ gender: methods.getValues("gender") })
						)
					}
				/>
				<Row
					label={t("pets.birthday")}
					value={pet.birthday ? dayjs(pet.birthday).format("ll") : "—"}
					onEdit={() =>
						openFieldEdit(
							"birthday",
							<DateTimePicker
								name="birthday"
								type="date"
								textLabel="pets.birthday"
								bgColor="light"
								required
							/>,
							() => ({
								birthday: dayjs(
									methods.getValues("birthday")
								).toISOString(),
							})
						)
					}
				/>
				<Row
					label={t("pets.weight")}
					value={pet.weight_kg != null ? `${pet.weight_kg} Kg` : "—"}
					onEdit={() =>
						openFieldEdit(
							"weight_kg",
							<NumberInput
								name="weight_kg"
								textLabel="pets.weight"
								bgColor="light"
								required
							/>,
							() => ({
								weight_kg: parseFloat(
									methods.getValues("weight_kg")
								),
							})
						)
					}
				/>
				<StatsLink
					type="button"
					onClick={() => history.push(`/pets/detail/${pet.id}/weight-stats`)}
				>
					{t("stats.weight_view_link")}
				</StatsLink>
				<Row
					full
					label={t("pets.breed")}
					value={pet.breed ? breedT(pet.breed.toLowerCase()) : "—"}
					onEdit={openBreedEdit}
				/>
				<Row
					full
					label={t("pets.coat")}
					value={
						pet.coat_length
							? t(
									`pets.coat_lengths.${pet.coat_length.toLowerCase()}` as I18NKey
							  )
							: "—"
					}
					onEdit={() =>
						openFieldEdit(
							"coat_length",
							<SelectInput
								name="coat_length"
								options={coatOptions}
								bgColor="light"
								required
								textLabel="pets.coat"
							/>,
							() => ({
								coat_length: methods.getValues("coat_length"),
							})
						)
					}
				/>
				<Row
					label={t("pets.neutered")}
					value={pet.neutered ? t("pets.yes") : t("pets.no")}
					onEdit={openNeuteredEdit}
				/>
			</Fields>

			{events.length > 0 && (
				<EventsSection>
					<SectionTitle>{t("pets.events_week")}</SectionTitle>
					<AppointmentsList
						appointments={events as AppointmentFragment[]}
					/>
				</EventsSection>
			)}

			{walkRatings.length > 0 && (
				<RatingsSection>
					<SectionTitle>{t("events.walk")}</SectionTitle>
					<WalkRatingsSummaryCard ratings={walkRatings} />
					<StatsLink
						type="button"
						onClick={() => history.push(`/pets/detail/${pet.id}/walking-stats`)}
					>
						{t("stats.view_link")}
					</StatsLink>
				</RatingsSection>
			)}

			<GallerySection>
				<SectionTitle>{t("pets.gallery")}</SectionTitle>
				<Gallery>
					{pictures.map((media, index) => (
						<GalleryItem
							key={media!.id}
							onClick={() => openGallery(index)}
						>
							<Image2x id={media!.id} />
						</GalleryItem>
					))}
				</Gallery>
				<GalleryAdd>
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={onPickGallery}
					/>
					<Icon name="add" color="light" />
				</GalleryAdd>
			</GallerySection>

			<PetImageEditor
				open={imgOpen}
				onClose={() => setImgOpen(false)}
				petId={pet.id}
				petName={pet.name}
				mediaId={pet.main_picture?.id}
				mainColors={pet.main_picture?.main_colors ?? undefined}
				mainColor={pet.main_picture?.main_color ?? undefined}
				onSaved={reload}
			/>

			<MultiImageUploader
				pictures={galleryPics}
				onClose={() => setGalleryPics([])}
				refId={pet.id}
				scope="pet_picture"
				onSaved={reload}
			/>

			<DangerZone>
				<DeleteButton type="button" onClick={confirmDelete}>
					<Icon name="trashOutline" color="danger" />
					<span>{t("actions.delete")}</span>
				</DeleteButton>
			</DangerZone>
		</>
	);
};

type rowProps = {
	label: string;
	value: string;
	onEdit: () => void;
	full?: boolean;
};

const Row: React.FC<rowProps> = ({ label, value, onEdit, full = false }) => (
	<Card
		className={full ? "full" : ""}
		role="button"
		tabIndex={0}
		onClick={onEdit}
	>
		<CardLabel>{label}</CardLabel>
		<CardValueRow>
			<CardValue>{value}</CardValue>
			<Chevron name="chevronForward" color="medium" />
		</CardValueRow>
	</Card>
);

type breedEditorProps = {
	initial: Option | null;
	onChange: (o: Option | null) => void;
};

const BreedEditor: React.FC<breedEditorProps> = ({ initial, onChange }) => {
	const [sel, setSel] = useState<Option | null>(initial);
	const [, setText] = useState("");
	return (
		<BreedSeletor
			selectedBreed={sel}
			onSelected={(o) => {
				setSel(o);
				onChange(o);
			}}
			changeBreedText={setText}
		/>
	);
};

type neuteredEditorProps = {
	initial: boolean;
	onChange: (v: boolean) => void;
	yes: string | null;
	no: string | null;
};

const NeuteredEditor: React.FC<neuteredEditorProps> = ({
	initial,
	onChange,
	yes,
	no,
}) => {
	const [val, setVal] = useState(initial);
	return (
		<ToggleRow>
			<span>{val ? yes : no}</span>
			<Toggle
				value={val}
				onChange={(v) => {
					setVal(v);
					onChange(v);
				}}
			/>
		</ToggleRow>
	);
};

type GalleryPreviewProps = {
	medias: { id?: string | null }[];
	startIndex: number;
};

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({
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
		? `${mediaBase}/${currentMedia.id}${
				webpSupported ? "?format=webp" : ""
			}`
		: undefined;

	return (
		<GalleryModalContent>
			<GalleryModalImage>
				{mediaSrc && <img src={mediaSrc} alt={currentMedia?.id ?? ""} />}
			</GalleryModalImage>
			<GalleryModalCounter>
				{activeIndex + 1}/{total}
			</GalleryModalCounter>
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
		</GalleryModalContent>
	);
};

const Gallery = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(1)} 12px 0;
	box-sizing: border-box;
`;

const GalleryItem = styled.div`
	width: calc(50% - ${$uw(0.5)});
	aspect-ratio: 1;
	border-radius: 12px;
	overflow: hidden;
	cursor: pointer;
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	> .img2x {
		width: 100%;
		height: 100%;
		transition: transform 0.25s ease;
	}
	&:active > .img2x {
		transform: scale(1.05);
	}
	@media (hover: hover) {
		&:hover > .img2x {
			transform: scale(1.05);
		}
	}
`;

const GallerySection = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding-bottom: ${$uw(2)};
	position: relative;
`;

const GalleryAdd = styled.label`
	position: absolute;
	right: ${$uw(2)};
	bottom: ${$uw(2)};
	width: ${$uw(3)};
	height: ${$uw(3)};
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
	border-radius: 999px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	cursor: pointer;
	z-index: 2;
	transition: transform 0.15s ease;
	> input {
		display: none;
	}
	> .icon {
		width: ${$uw(3)};
		height: ${$uw(3)};
	}
	&:active {
		transform: scale(0.92);
	}
`;

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

const Header = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(2)};
	padding: ${$uw(3)} 12px;
	box-sizing: border-box;
`;

const PetImage = styled.div<{ $borderColor?: string }>`
	width: 100%;
	max-width: 180px;
	aspect-ratio: 1/1;
	padding: 4px;
	box-sizing: border-box;
	background: ${({ $borderColor }) =>
		$borderColor
			? $color($borderColor)
			: `linear-gradient(135deg, ${$color('primary')}, ${$color('secondary')})`};
	border-radius: 260px;
	overflow: hidden;
	cursor: pointer;
	transition: transform 0.2s ease;
	> .img2x {
		width: 100%;
		height: 100%;
		border-radius: 260px;
		overflow: hidden;
		display: block;
	}
	&:active {
		transform: scale(0.97);
	}
	&.skeleton {
		background: none;
		padding: 0;
	}
`;

const Fill = styled.span`
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 260px;
	background: linear-gradient(135deg, ${$color('primary')}, ${$color('secondary')});
`;

const NameRow = styled.div<{ $bg?: string; $fg?: string }>`
	display: flex;
	align-items: center;
	position: relative;
	width: fit-content;
	font-size: 2rem;
	padding: 0 ${$uw(2)} 0 ${$uw(0.6)};
	height: ${$uw(2.5)};
	font-weight: 600;
	border-radius: 99px;
	background-color: ${({ $bg }) => $color($bg || 'primary')};
	color: ${({ $fg }) => $color($fg || 'dark')};
	cursor: pointer;
	transition: transform 0.15s ease;
	> span.mainInfo {
		height: auto;
		margin-bottom: 0;
		font-size: 1.8rem;
		font-weight: 800;
	}
	&:active {
		transform: scale(0.98);
	}
`;

const IconContainer = styled.div`
	width: ${$uw(1.5)};
	height: ${$uw(1.5)};
	flex: 0 0 ${$uw(1.5)};
	display: block;
	border-radius: 100px;
	background-color: ${$color('white')};
	margin-right: ${$uw(0.5)};
	padding: ${$uw(0.2)};
	box-sizing: border-box;
`;

const Fields = styled.div`
	width: 100%;
	padding: 0 12px ${$uw(4)};
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${$uw(2.5)} ${$uw(2)};
	align-items: start;
`;

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
	padding: ${$uw(1.25)};
	border-radius: 14px;
	background: ${$color('background')};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: pointer;
	transition: border-color 0.15s ease;
	&:active {
		border-color: ${$color('primary')};
	}
	@media (hover: hover) {
		&:hover {
			border-color: ${$color('primary')};
		}
	}
	&.full {
		grid-column: 1 / -1;
		order: 1;
	}
`;

const CardLabel = styled.span`
	font-size: 1.3rem;
	color: ${$color('primary')};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 6px;
	&::before {
		content: "";
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: ${$color('primary')};
	}
`;

const CardValueRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const CardValue = styled.span`
	font-size: 1.9rem;
	font-weight: 700;
	word-break: break-word;
`;

const Chevron = styled(Icon)`
	width: 18px;
	height: 18px;
	min-width: 18px;
	opacity: 0.6;
`;

const ToggleRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${$uw(2)} 0;
	> span {
		font-size: 1.8rem;
	}
`;

const ModalField = styled.div`
	width: 100%;
	padding: ${$uw(4)} ${$uw(2)} ${$uw(2)};
	box-sizing: border-box;
`;

const DangerZone = styled.div`
	width: 100%;
	padding: ${$uw(2)} 12px ${$uw(6)};
	box-sizing: border-box;
	display: flex;
	justify-content: center;
`;

const DeleteButton = styled.button`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1.25)} ${$uw(3)};
	border-radius: 999px;
	background: rgba(var(--ion-color-danger-rgb), 0.1);
	border: 1px solid rgba(var(--ion-color-danger-rgb), 0.4);
	color: ${$color("danger")};
	font-size: 1.6rem;
	font-weight: 700;
	cursor: pointer;
	transition: background 0.15s ease, transform 0.15s ease;
	> .icon {
		width: ${$uw(2)};
		height: ${$uw(2)};
	}
	&:active {
		transform: scale(0.97);
		background: rgba(var(--ion-color-danger-rgb), 0.18);
	}
`;

const ConfirmBox = styled.div`
	width: 100%;
	padding: ${$uw(2)} ${$uw(2)} ${$uw(1)};
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const ConfirmTitle = styled.h2`
	margin: 0;
	font-size: 2rem;
	color: ${$color("danger")};
`;

const ConfirmText = styled.p`
	margin: 0;
	font-size: 1.6rem;
	line-height: 1.4;
`;

const RatingsSection = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(4)};
`;

const StatsLink = styled.button`
	width: 100%;
	margin-top: ${$uw(0.75)};
	padding: 0;
	border: none;
	background: none;
	text-align: center;
	color: ${$color("primary")};
	text-decoration: underline;
	font-size: 1.4rem;
	font-weight: 600;
	cursor: pointer;
`;

const EventsSection = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding-bottom: ${$uw(2)};
	margin-bottom: ${$uw(6)};
`;

const SectionTitle = styled.h3`
	margin: 0 0 ${$uw(1.5)};
	padding: 0 12px;
	font-size: 1.5rem;
	color: ${$color('primary')};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	&::after {
		content: "";
		flex: 1;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(
			90deg,
			rgba(var(--ion-color-primary-rgb), 0.5),
			transparent
		);
	}
`;
