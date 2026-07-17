import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useLocation } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import { IonContent } from "@ionic/react";
import { useUserContext, useModal } from "@contexts";
import {
	Icon,
	Image2x,
	Option,
	SelectInput,
	TextInput,
	NumberInput,
	DateTimePicker,
	Toggle,
	AppointmentsList,
	MultiImageUploader,
	WalkRatingsSummaryCard,
	PullToRefresh,
} from "@components";
import { I18NKey } from "@i18n";
import {
	BoxStatus,
	CoatLength,
	Gender,
	PetUpdate,
	ShelterPersonStatus,
	WalkRatingType,
} from "@types";
import { gendersColor } from "@utils";
import { $color, $uw } from "@theme";
import { AppointmentFragment } from "@graphql_generated/appointment.generated";

import { GalleryPreview } from "../../pets/pages/PetProfile";
import { BreedSeletor } from "../../pets/components";
import { PetImageEditor } from "../../pets/components/PetImageEditor";
import {
	useGetFullPetLazyQuery,
	GetFullPetQuery,
} from "../../pets/operations/__generated__/getFullPet.generated";
import { useUpdatePetMutation } from "../../pets/operations/__generated__/updatePet.generated";
import { useDeletePetMutation } from "../../pets/operations/__generated__/deletePet.generated";
import { useGetLatestPetWeightQuery } from "../../pets/operations/__generated__/getLatestPetWeight.generated";
import { useDeleteMediaMutation } from "../../../components/operations/__generated__/deleteMedia.generated";
import {
	useGetShelterPetLazyQuery,
	GetShelterPetQuery,
} from "../operations/__generated__/getShelterPet.generated";
import {
	useGetCurrentBoxForPetLazyQuery,
	GetCurrentBoxForPetQuery,
} from "../operations/__generated__/getCurrentBoxForPet.generated";
import { useListShelterWalksQuery } from "../operations/__generated__/listShelterWalks.generated";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";
import { useListShelterPeopleQuery } from "../operations/__generated__/listShelterPeople.generated";
import { useSetShelterPetAssigneesMutation } from "../operations/__generated__/setShelterPetAssignees.generated";
import { useShelterAuthorization } from "../hooks/useShelterAuthorization";
import {
	SelectWalkerModal,
	type PickableMember,
	type WalkerSelection,
} from "../components/SelectWalkerModal";
import { DonateCard } from "../../donations/components/DonateCard";
import { PetFundingUrgencyControl } from "../components/detail/PetFundingUrgencyControl";

type WalkRatingAvg = { type: WalkRatingType; rating: number };

type ShelterPetInfo = NonNullable<
	GetShelterPetQuery["getShelterPet"]["shelter_pet"]
>;



type FullPet = NonNullable<GetFullPetQuery["getPet"]["pet"]>;
type CurrentBox = NonNullable<
	GetCurrentBoxForPetQuery["getCurrentBoxForPet"]["box"]
>;

type EditableField =
	| "name"
	| "gender"
	| "birthday"
	| "weight_kg"
	| "coat_length";

const STATUS_FILL: Record<string, string> = {
	AVAILABLE: "#2dd36f",
	NEEDS_CLEANING: "#4c8dff",
	OCCUPIED: "#ffc409",
	FULL: "#ff8a34",
	OUT_OF_SERVICE: "#92949c",
};

const STATUS_KEY: Record<BoxStatus, string> = {
	[BoxStatus.Available]: "shelters.map.available",
	[BoxStatus.NeedsCleaning]: "shelters.map.needs_cleaning",
	[BoxStatus.Occupied]: "shelters.map.occupied",
	[BoxStatus.Full]: "shelters.map.full",
	[BoxStatus.OutOfService]: "shelters.map.oos",
};

// iniziali per l'avatar del referente ("Mario Rossi" -> "MR")
const initialsOf = (name: string): string =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]!.toUpperCase())
		.join("");

export const ShelterPetDetail: React.FC = () => {
	// id = shelter id, petId = shelter_pet id
	const { id, petId } = useParams<{ id: string; petId: string }>();
	const { setPage, refetchDashboard } = useUserContext();
	const { t } = useTranslation();
	const { t: breedT } = useTranslation("breeds");
	const history = useHistory();
	const location = useLocation();
	const { openModal, closeModal } = useModal();

	const [pet, setPet] = useState<FullPet>();
	const [box, setBox] = useState<CurrentBox | null>(null);
	const [shelterPet, setShelterPet] = useState<ShelterPetInfo | null>(null);
	const [imgOpen, setImgOpen] = useState(false);
	const [galleryEdit, setGalleryEdit] = useState(false);
	const [galleryPics, setGalleryPics] = useState<
		{ url: string; type: string }[]
	>([]);

	const { can } = useShelterAuthorization(id);
	const canAssign = can("shelters.pets.update");

	const [getFullPet, { loading }] = useGetFullPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getPet }) => {
			if (!getPet?.pet || getPet.error) return;
			setPet(getPet.pet);
		},
	});

	const [getShelterPet] = useGetShelterPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getShelterPet }) => {
			const sp = getShelterPet?.shelter_pet;
			if (!sp?.pet?.id) return;
			setShelterPet(sp);
			getFullPet({
				variables: {
					id: sp.pet.id,
					date_from: dayjs().startOf("day").toISOString(),
					date_to: dayjs().add(7, "day").endOf("day").toISOString(),
				},
			});
		},
	});

	const [getCurrentBox] = useGetCurrentBoxForPetLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getCurrentBoxForPet }) =>
			setBox(getCurrentBoxForPet?.box ?? null),
	});

	// membri/volontari assegnabili come referente (stesse liste della modale walk).
	// la lista ruoli serve anche in sola lettura per mostrare il ruolo del referente
	const { data: rolesData } = useListShelterRolesMinQuery({
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
	const roleItems = (rolesData?.listShelterRoles?.items ?? []).filter(
		(r): r is NonNullable<typeof r> => !!r?.user
	);
	const teamMembers: PickableMember[] = roleItems
		.map((r) => ({
			id: r.user.id,
			name:
				[r.user.first_name, r.user.last_name].filter(Boolean).join(" ") ||
				r.user.id,
			kind: "user" as const,
		}))
		.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

	const { data: peopleData } = useListShelterPeopleQuery({
		skip: !id || !canAssign,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: id, search: { page: 0, page_size: 200 } },
	});
	const volunteers: PickableMember[] = (peopleData?.listShelterPeople?.items ?? [])
		.filter(
			(p): p is NonNullable<typeof p> =>
				!!p && p.status === ShelterPersonStatus.Volunteer
		)
		.map((p) => ({
			id: p.id,
			name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.id,
			kind: "person" as const,
		}));
	const members: PickableMember[] = [...teamMembers, ...volunteers];

	const [setAssignees] = useSetShelterPetAssigneesMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const saveAssignee = async (selection: WalkerSelection | null) => {
		const { data } = await setAssignees({
			variables: {
				shelter_pet_id: petId,
				user_ids: selection?.kind === "user" ? [selection.id] : [],
				shelter_person_ids:
					selection?.kind === "person" ? [selection.id] : [],
			},
		});
		const sp = data?.setShelterPetAssignees?.shelter_pet;
		if (sp) {
			setShelterPet((prev) => (prev ? { ...prev, ...sp } : prev));
			toast.success(t("shelters.assignee.saved_ok"));
		}
	};

	const assignedUser = shelterPet?.assigned_members?.[0];
	const assignedPerson = shelterPet?.assigned_shelter_people?.[0];
	const assignedName = assignedUser
		? [assignedUser.first_name, assignedUser.last_name]
				.filter(Boolean)
				.join(" ") || assignedUser.id
		: assignedPerson
		? [assignedPerson.first_name, assignedPerson.last_name]
				.filter(Boolean)
				.join(" ") || assignedPerson.id
		: null;
	// ruolo del referente: membro -> ruolo shelter, persona esterna -> volontario
	const assignedRoleKey: I18NKey | null = assignedUser
		? (() => {
				const r = roleItems.find(
					(x) => x.user.id === assignedUser.id
				)?.role;
				return r
					? (`shelters.roles.${r.toLowerCase()}` as I18NKey)
					: null;
		  })()
		: assignedPerson
		? ("shelters.roles.volunteer" as I18NKey)
		: null;

	const pickAssignee = () => {
		if (!canAssign) return;
		const defaultSelection: WalkerSelection | undefined = assignedUser
			? { id: assignedUser.id, kind: "user" }
			: assignedPerson
			? { id: assignedPerson.id, kind: "person" }
			: undefined;
		const sel = { current: defaultSelection ?? null };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: () => {
				saveAssignee(sel.current);
				closeModal();
			},
			children: (
				<SelectWalkerModal
					members={members}
					defaultSelection={defaultSelection}
					onChange={(selection) => (sel.current = selection)}
				/>
			),
		});
	};

	// media dei rating delle passeggiate del canile per questo shelter_pet
	const { data: walksData } = useListShelterWalksQuery({
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				filters: { fixed: [{ key: "shelter_pet_id", value: petId }] },
			},
		},
	});
	const walkRatings: WalkRatingAvg[] = (() => {
		const items = (walksData?.listShelterWalks?.items ?? []).filter(
			(w): w is NonNullable<typeof w> => !!w
		);
		const acc = new Map<WalkRatingType, { sum: number; count: number }>();
		for (const w of items) {
			for (const r of (w.ratings ?? []).filter(
				(r): r is NonNullable<typeof r> => !!r
			)) {
				const cur = acc.get(r.type) ?? { sum: 0, count: 0 };
				acc.set(r.type, {
					sum: cur.sum + r.rating,
					count: cur.count + 1,
				});
			}
		}
		return Object.values(WalkRatingType)
			.filter((type) => acc.has(type))
			.map((type) => {
				const { sum, count } = acc.get(type)!;
				return { type, rating: Math.round((sum / count) * 10) / 10 };
			});
	})();

	const { data: weightData } = useGetLatestPetWeightQuery({
		skip: !pet?.id,
		fetchPolicy: "cache-and-network",
		variables: { pet_id: pet?.id as string },
	});
	const latestWeight = weightData?.getLatestPetWeight?.weight;

	const load = () => {
		getShelterPet({ variables: { id: petId } });
		getCurrentBox({ variables: { shelter_pet_id: petId } });
	};

	useEffect(() => {
		setPage({ name: t("pages.shelters") });
	}, [petId]);

	// load su mount + a ogni navigazione (ritorno da mappa/evento): pattern location.key
	useEffect(() => {
		load();
	}, [petId, location.key]);

	// ------- editing scheda anagrafica (stesso pattern di PetProfile) -------

	const methods = useForm<{
		name: string;
		gender: Gender;
		birthday: string;
		weight_kg: string;
		coat_length: CoatLength;
	}>({
		mode: "onSubmit",
		defaultValues: {
			name: pet?.name ?? "",
			gender: pet?.gender ?? undefined,
			birthday: pet?.birthday ?? undefined,
			weight_kg: pet?.weight_kg != null ? String(pet.weight_kg) : "",
			coat_length: pet?.coat_length ?? undefined,
		},
	});

	useEffect(() => {
		if (!pet) return;
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
			if (updatePet.pet)
				setPet((prev) =>
					prev ? { ...prev, ...updatePet.pet } : prev
				);
		},
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const saveField = (data: PetUpdate) =>
		pet && updatePet({ variables: { id: pet.id, data } });

	const revert = (field: EditableField) => () => {
		methods.setValue(field, (pet as any)?.[field] ?? undefined);
		closeModal();
	};

	const openFieldEdit = (
		field: EditableField,
		inputNode: React.ReactNode,
		buildData: () => PetUpdate
	) => {
		if (!canAssign) return;
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

	const genderOptions: Option[] = Object.values(Gender).map((k) => ({
		value: k,
		label: t(`pets.gender_${k.toLowerCase()}` as I18NKey),
	}));
	const coatOptions: Option[] = Object.values(CoatLength).map((k) => ({
		value: k,
		label: t(`pets.coat_lengths.${k.toLowerCase()}` as I18NKey),
	}));

	const openBreedEdit = () => {
		if (!canAssign || !pet) return;
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
		if (!canAssign || !pet) return;
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

	// ------- galleria -------

	const pictures = (pet?.pictures?.items ?? []).filter(
		(m): m is NonNullable<typeof m> => !!m
	);

	const openGallery = (startIndex: number) => {
		if (galleryEdit) return;
		const medias = pictures.map((m) => ({ id: m.id }));
		if (!medias.length) return;
		openModal({
			onClose: () => closeModal(),
			children: <GalleryPreview medias={medias} startIndex={startIndex} />,
		});
	};

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

	const [deleteMedia] = useDeleteMediaMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const removePhoto = async (mediaId: string) => {
		const res = await deleteMedia({ variables: { id: mediaId } });
		const del = res.data?.deleteMedia;
		if (!del?.success || del.error) {
			toast.error(
				del?.error?.message
					? t(del.error.message as I18NKey)
					: t("messages.errors.fetch")
			);
			return;
		}
		toast.success(t("messages.success.photo_deleted"));
		load();
	};

	// uscita automatica dalla modalità modifica quando non resta nulla da gestire
	useEffect(() => {
		if (galleryEdit && pictures.length === 0) setGalleryEdit(false);
	}, [pictures.length]);

	// ------- eliminazione pet -------

	const [deletePet] = useDeletePetMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const confirmDelete = () =>
		pet &&
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
				history.replace(`/shelters/detail/${id}`);
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

	// ------- derivati per la UI -------

	const ageLabel = (() => {
		if (!pet?.birthday) return null;
		const years = dayjs().diff(dayjs(pet.birthday), "year");
		if (years >= 1)
			return t("shelters.overview.age" as I18NKey, { count: years });
		const months = Math.max(1, dayjs().diff(dayjs(pet.birthday), "month"));
		return t("shelters.overview.age_months" as I18NKey, { count: months });
	})();

	const genderLabel = pet?.gender
		? t(`pets.gender_${pet.gender.toLowerCase()}` as I18NKey)
		: null;
	const breedLabel = pet?.breed ? breedT(pet.breed.toLowerCase()) : null;
	const gender = pet?.gender ?? Gender.NotSaid;

	const openMap = () =>
		history.push(`/shelters/detail/${id}/map?pet=${petId}`);

	if (!pet) {
		return (
			<IonContent>
				<PullToRefresh />
				<Loading className={loading ? "skeleton" : ""} />
			</IonContent>
		);
	}

	return (
		<IonContent>
			<PullToRefresh />

			{/* ------- hero ------- */}
			<Hero>
				<HeroPhotoWrap>
					<HeroPhoto
						role="button"
						tabIndex={0}
						onClick={() => canAssign && setImgOpen(true)}
						$clickable={canAssign}
					>
						{pet.main_picture ? (
							<Image2x id={pet.main_picture.id} />
						) : (
							<PhotoFill>
								<Icon name="pawOutline" color="light" size="48px" />
							</PhotoFill>
						)}
					</HeroPhoto>
					<GenderBadge $c={$color(gendersColor[gender].color)}>
						<Icon
							name={gendersColor[gender].iconName}
							color="light"
							size="16px"
						/>
					</GenderBadge>
				</HeroPhotoWrap>
				<HeroName
					role={canAssign ? "button" : undefined}
					tabIndex={canAssign ? 0 : undefined}
					$clickable={canAssign}
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
					{pet.name}
				</HeroName>
				<HeroChips>
					{genderLabel && (
						<Chip>
							<ChipDot $c={$color(gendersColor[gender].color)} />
							{genderLabel}
						</Chip>
					)}
					{ageLabel && <Chip>{ageLabel}</Chip>}
					{breedLabel && <Chip>{breedLabel}</Chip>}
				</HeroChips>
			</Hero>

			<Body>
				{/* ------- donazioni (modulo invariato) ------- */}
				<Section>
					<SectionHead>
						<SectionTitle>
							{t("donations.pet_cta_title")}
						</SectionTitle>
					</SectionHead>
					<DonateCard shelterId={id} petId={pet.id} />
					<PetFundingUrgencyControl shelterId={id} petId={pet.id} />
				</Section>
				{/* ------- collocazione ------- */}
				<Section>
					<SectionHead>
						<SectionTitle>
							{t("shelters.placement.title")}
						</SectionTitle>
						<SectionAction type="button" onClick={openMap}>
							<Icon name="mapOutline" color="primary" size="16px" />
							<span>{t("shelters.placement.open_map")}</span>
						</SectionAction>
					</SectionHead>
					{box ? (
						<PlacedCard>
							<PlacedHead>
								<BoxLabel>{box.label}</BoxLabel>
								<StatusChip
									$c={
										STATUS_FILL[box.status] ??
										STATUS_FILL.AVAILABLE
									}
								>
									{t(STATUS_KEY[box.status] as I18NKey)}
								</StatusChip>
							</PlacedHead>
							<PlacedRows>
								{box.zone?.name && (
									<PlacedRow>
										<PlacedLabel>
											{t("shelters.placement.zone")}
										</PlacedLabel>
										<PlacedValue>{box.zone.name}</PlacedValue>
									</PlacedRow>
								)}
								<PlacedRow>
									<PlacedLabel>
										{t("shelters.placement.area")}
									</PlacedLabel>
									<PlacedValue>
										{box.area?.name ?? "—"}
									</PlacedValue>
								</PlacedRow>
								{(box.current_occupants ?? []).length > 0 && (
									<PlacedRow>
										<PlacedLabel>
											{t("shelters.placement.occupants")}
										</PlacedLabel>
										<Occupants>
											{(box.current_occupants ?? []).map(
												(o) => (
													<Occupant key={o.id}>
														<OccAvatar>
															{o.pet.main_picture ? (
																<Image2x
																	id={
																		o.pet
																			.main_picture
																			.id
																	}
																/>
															) : (
																<span>
																	{initialsOf(
																		o.pet.name
																	)}
																</span>
															)}
														</OccAvatar>
														<span>{o.pet.name}</span>
													</Occupant>
												)
											)}
										</Occupants>
									</PlacedRow>
								)}
							</PlacedRows>
						</PlacedCard>
					) : (
						<EmptyCard>
							<Icon name="mapOutline" color="medium" size="28px" />
							<span>{t("shelters.placement.not_placed")}</span>
							{canAssign && (
								<EmptyCta type="button" onClick={openMap}>
									{t("shelters.placement.assign_cta")}
								</EmptyCta>
							)}
						</EmptyCard>
					)}
				</Section>

				{/* ------- referente ------- */}
				<Section>
					<SectionHead>
						<SectionTitle>{t("shelters.assignee.title")}</SectionTitle>
					</SectionHead>
					{assignedName ? (
						<>
							<PersonCard
								role={canAssign ? "button" : undefined}
								tabIndex={canAssign ? 0 : undefined}
								$clickable={canAssign}
								onClick={pickAssignee}
							>
								<PersonAvatar>
									{initialsOf(assignedName)}
								</PersonAvatar>
								<PersonInfo>
									<PersonName>{assignedName}</PersonName>
									{assignedRoleKey && (
										<PersonRole>
											{t(assignedRoleKey)}
										</PersonRole>
									)}
								</PersonInfo>
								{canAssign && (
									<Chevron
										name="chevronForward"
										color="medium"
									/>
								)}
							</PersonCard>
							{canAssign && (
								<ClearLink
									type="button"
									onClick={() => saveAssignee(null)}
								>
									{t("shelters.assignee.clear")}
								</ClearLink>
							)}
						</>
					) : (
						<EmptyCard>
							<Icon
								name="personAddOutline"
								color="medium"
								size="28px"
							/>
							<span>{t("shelters.assignee.none")}</span>
							{canAssign && (
								<EmptyCta type="button" onClick={pickAssignee}>
									{t("shelters.assignee.assign")}
								</EmptyCta>
							)}
						</EmptyCard>
					)}
				</Section>

				{/* ------- scheda anagrafica ------- */}
				<Section>
					<SectionHead>
						<SectionTitle>{t("pets.info")}</SectionTitle>
					</SectionHead>
					<InfoGrid>
						<InfoCard
							label={t("pets.gender")}
							value={genderLabel ?? "—"}
							editable={canAssign}
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
									() => ({
										gender: methods.getValues("gender"),
									})
								)
							}
						/>
						<InfoCard
							label={t("pets.birthday")}
							value={
								pet.birthday
									? dayjs(pet.birthday).format("ll")
									: "—"
							}
							editable={canAssign}
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
						<InfoCard
							label={t("pets.weight")}
							value={
								latestWeight
									? `${latestWeight.weight_kg} Kg`
									: pet.weight_kg != null
									? `${pet.weight_kg} Kg`
									: "—"
							}
							editable={canAssign}
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
							extra={
								<CardLink
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										history.push(
											`/shelters/detail/${id}/pet/${petId}/weight-stats`
										);
									}}
								>
									{t("stats.weight_view_link")}
								</CardLink>
							}
						/>
						<InfoCard
							label={t("pets.neutered")}
							value={pet.neutered ? t("pets.yes") : t("pets.no")}
							editable={canAssign}
							onEdit={openNeuteredEdit}
						/>
						<InfoCard
							label={t("pets.breed")}
							value={breedLabel ?? "—"}
							editable={canAssign}
							onEdit={openBreedEdit}
						/>
						<InfoCard
							label={t("pets.coat")}
							value={
								pet.coat_length
									? t(
											`pets.coat_lengths.${pet.coat_length.toLowerCase()}` as I18NKey
									  )
									: "—"
							}
							editable={canAssign}
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
										coat_length:
											methods.getValues("coat_length"),
									})
								)
							}
						/>
					</InfoGrid>
				</Section>

				{/* ------- eventi settimana (invariato) ------- */}
				{(pet.health_card?.treatments?.items ?? []).filter(Boolean)
					.length > 0 && (
					<Section>
						<SectionHead>
							<SectionTitle>{t("pets.events_week")}</SectionTitle>
						</SectionHead>
						<AppointmentsList
							appointments={
								(pet.health_card?.treatments?.items ?? []).filter(
									Boolean
								) as AppointmentFragment[]
							}
						/>
					</Section>
				)}

				{/* ------- statistiche passeggiate (componente invariato) ------- */}
				{walkRatings.length > 0 && (
					<Section>
						<SectionHead>
							<SectionTitle>{t("events.walk")}</SectionTitle>
						</SectionHead>
						<WalkRatingsSummaryCard ratings={walkRatings} />
						<ClearLink
							type="button"
							onClick={() =>
								history.push(
									`/shelters/detail/${id}/pet/${petId}/walking-stats`
								)
							}
						>
							{t("stats.view_link")}
						</ClearLink>
					</Section>
				)}

				{/* ------- galleria ------- */}
				<Section>
					<SectionHead>
						<SectionTitle>
							{t("pets.gallery")}
							{pictures.length > 0 && (
								<CountBadge>{pictures.length}</CountBadge>
							)}
						</SectionTitle>
						{canAssign && pictures.length > 0 && (
							<SectionAction
								type="button"
								onClick={() => setGalleryEdit((v) => !v)}
							>
								<span>
									{galleryEdit
										? t("actions.done")
										: t("actions.edit")}
								</span>
							</SectionAction>
						)}
					</SectionHead>
					<GalleryGrid>
						{pictures.map((media, index) => (
							<GalleryTile
								key={media.id}
								onClick={() => openGallery(index)}
							>
								<Image2x id={media.id} />
								{galleryEdit && (
									<TileTrash
										type="button"
										aria-label={t("actions.delete") ?? ""}
										onClick={(e) => {
											e.stopPropagation();
											removePhoto(media.id);
										}}
									>
										<Icon
											name="trashOutline"
											color="light"
											size="16px"
										/>
									</TileTrash>
								)}
							</GalleryTile>
						))}
						{canAssign && !galleryEdit && (
							<AddTile>
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={onPickGallery}
								/>
								<Icon name="add" color="primary" size="28px" />
								<span>{t("pets.add_photo")}</span>
							</AddTile>
						)}
					</GalleryGrid>
				</Section>

				{canAssign && (
					<DangerZone>
						<DeleteButton type="button" onClick={confirmDelete}>
							<Icon name="trashOutline" color="danger" />
							<span>{t("actions.delete")}</span>
						</DeleteButton>
					</DangerZone>
				)}
			</Body>

			<PetImageEditor
				open={imgOpen}
				onClose={() => setImgOpen(false)}
				petId={pet.id}
				petName={pet.name}
				mediaId={pet.main_picture?.id}
				mainColors={pet.main_picture?.main_colors ?? undefined}
				mainColor={pet.main_picture?.main_color ?? undefined}
				onSaved={load}
			/>

			<MultiImageUploader
				pictures={galleryPics}
				onClose={() => setGalleryPics([])}
				refId={pet.id}
				scope="pet_picture"
				onSaved={load}
			/>
		</IonContent>
	);
};

// ------- sotto-componenti -------

type infoCardProps = {
	label: string;
	value: string;
	editable: boolean;
	onEdit: () => void;
	extra?: React.ReactNode;
};

const InfoCard: React.FC<infoCardProps> = ({
	label,
	value,
	editable,
	onEdit,
	extra,
}) => (
	<Card
		role={editable ? "button" : undefined}
		tabIndex={editable ? 0 : undefined}
		$clickable={editable}
		onClick={() => editable && onEdit()}
	>
		<CardLabel>{label}</CardLabel>
		<CardValueRow>
			<CardValue>{value}</CardValue>
			{editable && <Chevron name="chevronForward" color="medium" />}
		</CardValueRow>
		{extra}
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

// ------- stili -------

const Loading = styled.div`
	width: 100%;
	height: 40dvh;
`;

const Hero = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(1.25)};
	padding: ${$uw(3)} 12px ${$uw(2)};
`;

const HeroPhotoWrap = styled.div`
	position: relative;
`;

const HeroPhoto = styled.div<{ $clickable: boolean }>`
	width: 148px;
	height: 148px;
	box-sizing: border-box;
	border-radius: 50%;
	overflow: hidden;
	border: 3px solid ${$color("success")};
	box-shadow: 0 0 24px rgba(var(--ion-color-success-rgb), 0.35);
	cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
	transition: transform 0.2s ease;
	> .img2x {
		width: 100%;
		height: 100%;
		display: block;
	}
	&:active {
		transform: ${({ $clickable }) => ($clickable ? "scale(0.97)" : "none")};
	}
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const PhotoFill = styled.span`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--ion-color-primary-rgb), 0.25);
`;

const GenderBadge = styled.span<{ $c: string }>`
	position: absolute;
	right: 4px;
	bottom: 4px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: ${({ $c }) => $c};
	border: 2px solid ${$color("background")};
`;

const HeroName = styled.h1<{ $clickable: boolean }>`
	margin: 0;
	font-size: 2.6rem;
	font-weight: 800;
	color: ${$color("text-color")};
	text-align: center;
	cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const HeroChips = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: ${$uw(0.75)};
`;

const Chip = styled.span`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.4)} ${$uw(1)};
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.25);
	color: ${$color("text-color")};
	font-size: 1.3rem;
	font-weight: 600;
`;

const ChipDot = styled.span<{ $c: string }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${({ $c }) => $c};
`;

const Body = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(6)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(3)};
`;

const Section = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const SectionHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	min-height: ${$uw(2.5)};
`;

const SectionTitle = styled.h3`
	margin: 0;
	font-size: 1.5rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
`;

const CountBadge = styled.span`
	min-width: 22px;
	height: 22px;
	padding: 0 6px;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.12);
	color: ${$color("primary")};
	font-size: 1.2rem;
	font-weight: 700;
	letter-spacing: 0;
`;

const SectionAction = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	min-height: 44px;
	padding: 0 ${$uw(0.5)};
	border: none;
	background: none;
	color: ${$color("primary")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
`;

const PlacedCard = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
	padding: ${$uw(1.5)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const PlacedHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const BoxLabel = styled.span`
	font-size: 2rem;
	font-weight: 800;
	word-break: break-word;
`;

const StatusChip = styled.span<{ $c: string }>`
	flex: 0 0 auto;
	font-size: 1.3rem;
	font-weight: 700;
	color: #1c1c1c;
	padding: ${$uw(0.4)} ${$uw(1)};
	border-radius: 999px;
	background: ${({ $c }) => $c};
`;

const PlacedRows = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const PlacedRow = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const PlacedLabel = styled.span`
	flex: 0 0 auto;
	font-size: 1.3rem;
	color: ${$color("medium")};
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-weight: 600;
`;

const PlacedValue = styled.span`
	font-size: 1.6rem;
	font-weight: 700;
	text-align: right;
	word-break: break-word;
`;

const Occupants = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: ${$uw(0.5)};
`;

const Occupant = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
	> span:last-child {
		font-size: 1.5rem;
		font-weight: 600;
	}
`;

const OccAvatar = styled.span`
	width: 28px;
	height: 28px;
	flex: 0 0 28px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--ion-color-primary-rgb), 0.15);
	color: ${$color("primary")};
	font-size: 1.1rem;
	font-weight: 700;
	> .img2x {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

const EmptyCard = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(2)} ${$uw(1.5)};
	border-radius: 14px;
	border: 1px dashed rgba(var(--ion-color-medium-rgb), 0.5);
	color: ${$color("medium")};
	font-size: 1.5rem;
	text-align: center;
`;

const EmptyCta = styled.button`
	min-height: 44px;
	padding: 0 ${$uw(2.5)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
	transition: transform 0.15s ease;
	&:active {
		transform: scale(0.97);
	}
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const PersonCard = styled.div<{ $clickable: boolean }>`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1.25)};
	padding: ${$uw(1.25)} ${$uw(1.5)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
	transition: border-color 0.15s ease;
	&:active {
		border-color: ${({ $clickable }) =>
			$clickable ? $color("primary") : "rgba(var(--ion-color-primary-rgb), 0.2)"};
	}
`;

const PersonAvatar = styled.span`
	width: ${$uw(3)};
	height: ${$uw(3)};
	flex: 0 0 ${$uw(3)};
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(var(--ion-color-primary-rgb), 0.15);
	color: ${$color("primary")};
	font-size: 1.6rem;
	font-weight: 800;
`;

const PersonInfo = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`;

const PersonName = styled.span`
	font-size: 1.7rem;
	font-weight: 700;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const PersonRole = styled.span`
	font-size: 1.3rem;
	color: ${$color("medium")};
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-weight: 600;
`;

const ClearLink = styled.button`
	width: 100%;
	margin: 0;
	padding: ${$uw(0.5)} 0;
	border: none;
	background: none;
	text-align: center;
	color: ${$color("primary")};
	text-decoration: underline;
	font-size: 1.4rem;
	font-weight: 600;
	cursor: pointer;
`;

const InfoGrid = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${$uw(1)};
	align-items: stretch;
`;

const Card = styled.div<{ $clickable: boolean }>`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
	padding: ${$uw(1.25)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
	transition: border-color 0.15s ease;
	&:active {
		border-color: ${({ $clickable }) =>
			$clickable ? $color("primary") : "rgba(var(--ion-color-primary-rgb), 0.2)"};
	}
`;

const CardLabel = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	font-weight: 600;
`;

const CardValueRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(0.75)};
`;

const CardValue = styled.span`
	font-size: 1.7rem;
	font-weight: 700;
	word-break: break-word;
`;

const CardLink = styled.button`
	align-self: flex-start;
	padding: 0;
	border: none;
	background: none;
	color: ${$color("primary")};
	text-decoration: underline;
	font-size: 1.3rem;
	font-weight: 600;
	cursor: pointer;
`;

const Chevron = styled(Icon)`
	width: 18px;
	height: 18px;
	min-width: 18px;
	opacity: 0.6;
`;

const GalleryGrid = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${$uw(1)};
`;

const GalleryTile = styled.div`
	position: relative;
	width: 100%;
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
	@media (prefers-reduced-motion: reduce) {
		> .img2x {
			transition: none;
		}
	}
`;

const TileTrash = styled.button`
	position: absolute;
	top: ${$uw(0.5)};
	right: ${$uw(0.5)};
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 50%;
	background: ${$color("danger")};
	cursor: pointer;
	transition: transform 0.15s ease;
	&:active {
		transform: scale(0.92);
	}
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const AddTile = styled.label`
	width: 100%;
	aspect-ratio: 1;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.5)};
	border-radius: 12px;
	border: 1px dashed rgba(var(--ion-color-primary-rgb), 0.45);
	color: ${$color("primary")};
	font-size: 1.3rem;
	font-weight: 700;
	cursor: pointer;
	> input {
		display: none;
	}
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
	padding-top: ${$uw(1)};
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
	@media (prefers-reduced-motion: reduce) {
		transition: none;
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
