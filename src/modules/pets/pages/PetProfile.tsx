import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useParams } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import {
	useGetFullPetLazyQuery,
	GetFullPetQuery,
} from "../operations/__generated__/getFullPet.generated";
import { useUpdatePetMutation } from "../operations/__generated__/updatePet.generated";
import { MinPetFragment } from "@graphql_generated/minPet.generated";

type FullPet = NonNullable<GetFullPetQuery["getPet"]["pet"]>;

import { useUserContext, useModal } from "@contexts";
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
} from "@components";
import { AppointmentFragment } from "@graphql_generated/appointment.generated";
import { BreedSeletor } from "../components";
import { PetImageEditor } from "../components/PetImageEditor";
import { Gender, CoatLength, PetUpdate } from "@types";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

export const PetProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { setPage } = useUserContext();
	const [pet, setPet] = useState<FullPet>();
	const { t } = useTranslation();

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
		loadPet();
	}, []);

	return (
		<IonContent>
			{pet ? (
				<Detail
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
};

type EditableField = "name" | "gender" | "birthday" | "weight_kg" | "coat_length";

const Detail: React.FC<detailProps> = ({ pet, reload, onSaved }) => {
	const { t } = useTranslation();
	const { t: breedT } = useTranslation("breeds");
	const { openModal, closeModal } = useModal();
	const [imgOpen, setImgOpen] = useState(false);

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
					<h2>{pet.name}</h2>
					<Chevron name="chevronForward" color="medium" />
				</NameRow>
			</Header>

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

			{pictures.length > 0 && (
				<EventsSection>
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
				</EventsSection>
			)}

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

const GalleryPreview: React.FC<GalleryPreviewProps> = ({
	medias,
	startIndex,
}) => {
	const total = medias.length;
	const normalize = (value: number) => ((value % total) + total) % total;
	const [activeIndex, setActiveIndex] = useState(() => normalize(startIndex));

	if (total === 0) return null;

	const goTo = (delta: number) =>
		setActiveIndex((prev) => normalize(prev + delta));

	const currentMedia = medias[activeIndex];

	return (
		<GalleryModalContent>
			<GalleryModalImage>
				{currentMedia?.id && <Image2x id={currentMedia.id} />}
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
	border-radius: 8px;
	overflow: hidden;
	cursor: pointer;
	> .img2x {
		width: 100%;
		height: 100%;
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
	> .img2x {
		width: 100%;
		height: 100%;
	}
`;

const GalleryModalArrow = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
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
		left: ${$uw(1)};
	}
	&.right {
		right: ${$uw(1)};
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
	border: 2px solid ${({ $borderColor }) => $color($borderColor || 'primary')};
	border-radius: 260px;
	overflow: hidden;
	cursor: pointer;
	> .img2x {
		width: 100%;
		height: 100%;
	}
	&.skeleton {
		border: 0;
	}
`;

const Fill = styled.span`
	width: 100%;
	height: 100%;
	display: block;
	background-color: ${$color('primary')};
`;

const NameRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.5)} ${$uw(1)};
	border-radius: 12px;
	background: ${$color('background')};
	border: 1px solid rgba(255, 255, 255, 0.12);
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease;
	> h2 {
		margin: 0;
		text-transform: uppercase;
	}
	&:active {
		border-color: ${$color('primary')};
	}
	@media (hover: hover) {
		&:hover {
			border-color: ${$color('primary')};
		}
	}
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
	padding: ${$uw(0.75)};
	border-radius: 12px;
	background: ${$color('background')};
	border: 1px solid rgba(255, 255, 255, 0.12);
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease;
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
	letter-spacing: 0.4px;
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

const EventsSection = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding-bottom: ${$uw(2)};
`;

const SectionTitle = styled.h3`
	margin: 0;
	padding: 0 12px;
	font-size: 1.5rem;
	color: ${$color('primary')};
	text-transform: uppercase;
`;
