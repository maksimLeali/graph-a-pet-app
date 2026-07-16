import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent, IonTextarea } from "@ionic/react";
import { useParams, useHistory } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import { useGetTreatmentLazyQuery } from "../operations/__generated__/getAppointment.generated";
import { useUpdateTreatmentMutation } from "../operations/__generated__/updateTreatment.generated";
import { useDeleteTreatmentMutation } from "../operations/__generated__/deleteTreatment.generated";
import { useGetWalkByTreatmentLazyQuery } from "../operations/__generated__/getWalkByTreatment.generated";
import { FullTreatmentFragment } from "@graphql_generated/fullTreatment.generated";

import { useUserContext, useModal } from "@contexts";
import {
	SpecialIconName,
	SpecialIcon,
	SelectInput,
	TextInput,
	DateTimePicker,
	Icon,
	Option, PullToRefresh } from "@components";
import { PetItem } from "../../pets/components/PetItem";
import { EventOption } from "../components/EventOption";
import { treatmentsColors } from "@utils";
import { TreatmentType, TreatmentUpdate, WalkRatingType } from "@types";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

type props = {};

export const EventDetails: React.FC<props> = () => {
	const { id } = useParams<{ id: string }>();

	const { setPage } = useUserContext();
	const [event, setEvent] = useState<FullTreatmentFragment>();
	const { t } = useTranslation();
	const [getEvent, { loading }] = useGetTreatmentLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ getTreatment }) => {
			if (!getTreatment?.treatment || getTreatment.error) {
				return;
			}
			setEvent(getTreatment.treatment);
		},
	});
	useEffect(() => {
		setPage({ visible: true, name: "" });
		setEvent(undefined);
		getEvent({ variables: { id } });
	}, [id]);

	return (
		<IonContent>
		    <PullToRefresh />
			{event ? (
				<Detail event={event} onSaved={setEvent} />
			) : (
				<Header>
					<Top>
						<IconWrapper className={loading ? "skeleton" : ""} />
						<h2 className={loading ? "skeleton" : ""} />
					</Top>
					<SkeletonP className={loading ? "skeleton" : ""} />
				</Header>
			)}
		</IonContent>
	);
};

type detailProps = {
	event: FullTreatmentFragment;
	onSaved: (t: FullTreatmentFragment) => void;
};

type EditableField = "name" | "type" | "date";

const walkRatingLabels: Record<WalkRatingType, string> = {
	[WalkRatingType.Overall]: "Generale",
	[WalkRatingType.Behavior]: "Comportamento",
	[WalkRatingType.Calm]: "Calma",
	[WalkRatingType.Aggression]: "Aggressività",
	[WalkRatingType.LeashPulling]: "Tiro al guinzaglio",
};

type WalkRatingItem = { type: WalkRatingType; rating: number };

const Detail: React.FC<detailProps> = ({ event, onSaved }) => {
	const { t } = useTranslation();
	const { openModal, closeModal } = useModal();
	const { refetchDashboard } = useUserContext();
	const history = useHistory();

	const [walkRatings, setWalkRatings] = useState<WalkRatingItem[]>([]);
	const [fetchWalkRatings] = useGetWalkByTreatmentLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({ listWalks }) => {
			const walk = listWalks?.items?.[0];
			const items = (walk?.ratings?.items ?? [])
				.filter((r): r is NonNullable<typeof r> => !!r && !!r.rating)
				.map((r) => ({ type: r.type, rating: r.rating }));
			setWalkRatings(items);
		},
	});

	useEffect(() => {
		if (event.type === TreatmentType.Walk) {
			fetchWalkRatings({
				variables: {
					commonSearch: {
						filters: {
							lists: [
								{ key: "treatment_id", value: [event.id] },
							],
						},
					},
				},
			});
		} else {
			setWalkRatings([]);
		}
	}, [event.id, event.type]);

	const methods = useForm<{
		name: string;
		type: TreatmentType;
		date: string;
	}>({
		mode: "onSubmit",
		defaultValues: {
			name: event.name,
			type: event.type,
			date: event.date,
		},
	});

	// riallinea il form quando l'evento salvato cambia
	useEffect(() => {
		methods.reset({
			name: event.name,
			type: event.type,
			date: event.date,
		});
	}, [event]);

	const [updateTreatment] = useUpdateTreatmentMutation({
		onCompleted: ({ updateTreatment }) => {
			if (!updateTreatment?.success || updateTreatment.error) {
				toast.error(
					updateTreatment?.error?.message
						? t(updateTreatment.error.message as I18NKey)
						: t("messages.errors.fetch")
				);
				return;
			}
			toast.success(t("messages.success.event_updated"));
			if (updateTreatment.treatment) {
				onSaved(updateTreatment.treatment);
			}
		},
		onError: () => {
			toast.error(t("messages.errors.fetch"));
		},
	});

	const saveField = (data: TreatmentUpdate) =>
		updateTreatment({ variables: { id: event.id, data } });

	const [deleteTreatment] = useDeleteTreatmentMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const runDelete = async (ids: string[]) => {
		const results = await Promise.all(
			ids.map((id) => deleteTreatment({ variables: { id } }))
		);
		const ok = results.every(
			(r) =>
				r.data?.deleteTreatment?.success &&
				!r.data.deleteTreatment.error
		);
		if (!ok) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("messages.success.event_deleted"));
		refetchDashboard();
		closeModal();
		const petId = event.health_card?.pet?.id;
		history.replace(petId ? `/pets/detail/${petId}` : "/");
	};

	const confirmDelete = () => {
		const relatedIds = (event.related ?? [])
			.map((r) => r?.id)
			.filter((id): id is string => !!id);
		const hasRelated = relatedIds.length > 0;
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: hasRelated ? undefined : () => runDelete([event.id]),
			customActions: hasRelated
				? [
						{
							text: t("events.delete_this"),
							bgColor: "medium",
							txtColor: "light",
							action: () => runDelete([event.id]),
						},
						{
							text: t("events.delete_all"),
							bgColor: "danger",
							txtColor: "light",
							action: () =>
								runDelete([event.id, ...relatedIds]),
						},
				  ]
				: [],
			children: (
				<ConfirmBox>
					<ConfirmTitle>{t("events.delete_title")}</ConfirmTitle>
					<ConfirmText>
						{t("events.delete_confirm", { name: event.name })}
					</ConfirmText>
					{hasRelated && (
						<ConfirmHint>
							{t("events.delete_related_hint")}
						</ConfirmHint>
					)}
				</ConfirmBox>
			),
		});
	};

	const typeOptions: Option[] = Object.values(TreatmentType).map((key) => ({
		value: key,
		label: t(`events.${key.toLowerCase()}` as I18NKey),
		render: (
			<EventOption
				iconName={key.toLowerCase() as SpecialIconName}
				color={treatmentsColors[key.toUpperCase() as TreatmentType]}
				label={t(`events.${key.toLowerCase()}` as I18NKey)}
			/>
		),
	}));

	// annulla / X: ripristina il valore salvato e chiude senza salvare
	const revert = (field: EditableField) => () => {
		methods.setValue(field, event[field] as never);
		closeModal();
	};

	const openFieldEdit = (
		field: EditableField,
		inputNode: React.ReactNode,
		buildData: () => TreatmentUpdate
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

	const openNotesEdit = () => {
		const initial = (event.logs ?? []).filter(Boolean).join("\n");
		const ref = { current: initial };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				const logs = ref.current
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean);
				await saveField({ logs });
				closeModal();
			},
			children: (
				<ModalField>
					<NotesEditor
						initial={initial}
						onChange={(v) => (ref.current = v)}
					/>
				</ModalField>
			),
		});
	};

	// annulla / X header: ripristina nome + tipo salvati
	const revertHeader = () => {
		methods.setValue("name", event.name);
		methods.setValue("type", event.type);
		closeModal();
	};

	const editHeader = () =>
		openModal({
			onClose: revertHeader,
			onCancel: revertHeader,
			onConfirm: async () => {
				const ok = await methods.trigger(["name", "type"]);
				if (!ok) return;
				await saveField({
					name: methods.getValues("name"),
					type: methods.getValues("type"),
				});
				closeModal();
			},
			children: (
				<FormProvider {...methods}>
					<ModalField>
						<TextInput
							name="name"
							textLabel="events.name"
							bgColor="light"
							required
						/>
						<SelectInput
							name="type"
							options={typeOptions}
							bgColor="light"
							required
							textLabel="events.type"
						/>
					</ModalField>
				</FormProvider>
			),
		});

	const editDate = () =>
		openFieldEdit(
			"date",
			<DateTimePicker
				name="date"
				type="dateTime"
				textLabel="events.date_time_from"
				bgColor="light"
				required
			/>,
			() => ({ date: dayjs(methods.getValues("date")).toISOString() })
		);

	const pet = event.health_card?.pet;
	const logs = (event.logs ?? []).filter(Boolean);

	// prev/next occurrence from the booster chain (related)
	const related = (event.related ?? []).filter(
		(r): r is NonNullable<typeof r> & { date: string } => !!r?.date
	);
	const current = dayjs(event.date);
	const prev = related
		.filter((r) => dayjs(r.date).isBefore(current))
		.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())[0];
	const next = related
		.filter((r) => dayjs(r.date).isAfter(current))
		.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())[0];

	return (
		<>
			<Header>
				<Top role="button" tabIndex={0} onClick={editHeader}>
					<IconWrapper>
						<SpecialIcon
							name={
								event.type.toLocaleLowerCase() as SpecialIconName
							}
							color={treatmentsColors[event.type]}
						/>
					</IconWrapper>
					<h2>{event.name}</h2>
					<Chevron name="chevronForward" color="medium" />
				</Top>
			</Header>

			<Fields>
				<Card role="button" tabIndex={0} onClick={editDate}>
					<CardLabel>{t("events.date_time_from")}</CardLabel>
					<CardValueRow>
						<CardValue>
							{dayjs(event.date).format("dddd ll, HH:mm")}
						</CardValue>
						<Chevron name="chevronForward" color="medium" />
					</CardValueRow>
				</Card>

				{(prev || next) && (
					<RecurrenceCard>
						<CardLabel>{t("events.recurrences")}</CardLabel>
						{prev && (
							<RecurrenceRow
								role="button"
								tabIndex={0}
								onClick={() =>
									history.push(`/events/${prev.id}`)
								}
							>
								<RecurrenceName>
									{t("events.previous")}
								</RecurrenceName>
								<CardValue>
									{dayjs(prev.date).format("dddd ll, HH:mm")}
								</CardValue>
								<Chevron name="chevronForward" color="medium" />
							</RecurrenceRow>
						)}
						{next && (
							<RecurrenceRow
								role="button"
								tabIndex={0}
								onClick={() =>
									history.push(`/events/${next.id}`)
								}
							>
								<RecurrenceName>
									{t("events.next")}
								</RecurrenceName>
								<CardValue>
									{dayjs(next.date).format("dddd ll, HH:mm")}
								</CardValue>
								<Chevron name="chevronForward" color="medium" />
							</RecurrenceRow>
						)}
					</RecurrenceCard>
				)}

				<NotesCard role="button" tabIndex={0} onClick={openNotesEdit}>
					<NotesHead>
						<CardLabel>{t("events.notes")}</CardLabel>
						<Chevron name="chevronForward" color="medium" />
					</NotesHead>
					{logs.length ? (
						logs.map((l, i) => <p key={i}>{l}</p>)
					) : (
						<h4>{t("events.general.no_events")}</h4>
					)}
				</NotesCard>

				{event.type === TreatmentType.Walk && walkRatings.length > 0 && (
					<RatingsCard>
						<CardLabel>{t("events.walk")}</CardLabel>
						<RatingsGrid>
							{walkRatings.map((r) => (
								<RatingItem key={r.type}>
									<RatingName>
										{walkRatingLabels[r.type]}
									</RatingName>
									<RatingValue>
										<Icon name="star" color="primary" />
										<span>{r.rating}</span>
									</RatingValue>
								</RatingItem>
							))}
						</RatingsGrid>
					</RatingsCard>
				)}
			</Fields>

			{pet && (
				<PetBox
					role="button"
					tabIndex={0}
					onClick={() => history.push(`/pets/detail/${pet.id}`)}
				>
					<PetItem readOnly pet={pet} index={0} />
				</PetBox>
			)}

			<DangerZone>
				<DeleteButton
					type="button"
					onClick={confirmDelete}
				>
					<Icon name="trashOutline" color="danger" />
					<span>{t("actions.delete")}</span>
				</DeleteButton>
			</DangerZone>
		</>
	);
};

type notesEditorProps = {
	initial: string;
	onChange: (v: string) => void;
};

const NotesEditor: React.FC<notesEditorProps> = ({ initial, onChange }) => {
	const [val, setVal] = useState(initial);
	return (
		<IonTextarea
			value={val}
			autoGrow
			rows={4}
			onIonInput={(e) => {
				const v = e.detail.value ?? "";
				setVal(v);
				onChange(v);
			}}
		/>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	background: ${$color('background')};
	border-bottom: 2px solid ${$color('primary')};
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	padding: ${$uw(2)} 12px;
	gap: 15px;
`;
const Top = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 15px;
	box-sizing: border-box;
	align-items: center;
	min-height: 50px;
	cursor: pointer;
	border-radius: 14px;
	padding: ${$uw(0.5)};
	transition: background 0.15s ease;
	> h2 {
		margin: 0;
		min-height: 30px;
		letter-spacing: 0.3px;
	}
	> *:last-child {
		margin-left: auto;
	}
	&:active {
		background: rgba(var(--ion-color-primary-rgb), 0.1);
	}
`;

const IconWrapper = styled.div`
	width: 46px;
	aspect-ratio: 1;
	border-radius: 80px;
	height: fit-content;
	z-index: 1;
	padding: 10px;
	background: ${$color('background')};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
	box-sizing: border-box;
	align-items: center;
	justify-content: center;
	> * {
		width: 100%;
	}
`;

const PetBox = styled.div`
	width: 100%;
	padding: ${$uw(3)} 12px 0;
	box-sizing: border-box;
	cursor: pointer;
`;

const Fields = styled.div`
	width: 100%;
	padding: ${$uw(3)} 12px 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(2)};
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

const RecurrenceCard = styled(Card)`
	cursor: default;
	gap: ${$uw(1)};
	&:active,
	@media (hover: hover) {
		&:hover {
			border-color: rgba(var(--ion-color-primary-rgb), 0.16);
		}
	}
`;

const RecurrenceRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(0.5)} 0;
	border-top: 1px solid rgba(var(--ion-color-primary-rgb), 0.14);
	cursor: pointer;
	> *:nth-child(2) {
		margin-left: auto;
	}
	&:active {
		opacity: 0.7;
	}
`;

const RecurrenceName = styled.span`
	font-size: 1.5rem;
	color: ${$color("medium")};
`;

const NotesCard = styled(Card)`
	> p {
		padding: ${$uw(1)} 0;
		border-bottom: 1px solid rgba(var(--ion-color-primary-rgb), 0.14);
		margin: 0;
	}
	> h4 {
		margin: ${$uw(1)} 0 0;
	}
`;

const RatingsCard = styled(Card)`
	cursor: default;
	gap: ${$uw(1)};
	&:active {
		border-color: rgba(var(--ion-color-primary-rgb), 0.2);
	}
	@media (hover: hover) {
		&:hover {
			border-color: rgba(var(--ion-color-primary-rgb), 0.2);
		}
	}
`;

const RatingsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${$uw(1)} ${$uw(2)};
`;

const RatingItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(0.5)} 0;
	border-bottom: 1px solid rgba(var(--ion-color-primary-rgb), 0.12);
`;

const RatingName = styled.span`
	font-size: 1.5rem;
	color: ${$color("medium")};
	word-break: break-word;
`;

const RatingValue = styled.span`
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
	font-size: 1.8rem;
	font-weight: 700;
	white-space: nowrap;
	> .icon {
		width: ${$uw(1.75)};
		height: ${$uw(1.75)};
	}
`;

const NotesHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: ${$uw(1)};
`;

const Chevron = styled(Icon)`
	width: 18px;
	height: 18px;
	min-width: 18px;
	opacity: 0.6;
`;

const ModalField = styled.div`
	width: 100%;
	padding: ${$uw(4)} ${$uw(2)} ${$uw(2)};
	box-sizing: border-box;
`;

const DangerZone = styled.div`
	width: 100%;
	padding: ${$uw(4)} 12px ${$uw(6)};
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

const ConfirmHint = styled.p`
	margin: ${$uw(0.5)} 0 0;
	font-size: 1.5rem;
	line-height: 1.4;
	color: ${$color("medium")};
`;

const SkeletonP = styled.div`
	width: 100px;
	height: 19px;
`;
