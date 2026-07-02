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
import { FullTreatmentFragment } from "@graphql_generated/fullTreatment.generated";

import { useUserContext, useModal } from "@contexts";
import {
	SpecialIconName,
	SpecialIcon,
	SelectInput,
	TextInput,
	DateTimePicker,
	Icon,
	Option,
} from "@components";
import { PetItem } from "../../pets/components/PetItem";
import { EventOption } from "../components/EventOption";
import { treatmentsColors } from "@utils";
import { TreatmentType, TreatmentUpdate } from "@types";
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
		setPage({ visible: false, name: "" });
		getEvent({ variables: { id } });
	}, []);

	return (
		<IonContent>
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

const Detail: React.FC<detailProps> = ({ event, onSaved }) => {
	const { t } = useTranslation();
	const { openModal, closeModal } = useModal();
	const history = useHistory();

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
	width: calc(100% - 2px);
	border: 2px solid ${$color('light-shade')};
	border-top: 0;
	border-left: 0;
	border-radius: 0 0 8px 0;
	box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	padding: 10px 12px;
	gap: 15px;
	padding-left: 12px;
`;
const Top = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 15px;
	box-sizing: border-box;
	align-items: center;
	min-height: 50px;
	cursor: pointer;
	border-radius: 12px;
	padding: ${$uw(0.5)};
	transition: background 0.15s ease;
	> h2 {
		margin: 0;
		min-height: 30px;
	}
	> *:last-child {
		margin-left: auto;
	}
	&:active {
		background: rgba(255, 255, 255, 0.08);
	}
`;

const IconWrapper = styled.div`
	width: 38px;
	aspect-ratio: 1;
	border-radius: 80px;
	height: fit-content;
	z-index: 1;
	padding: 8px;
	background-color: ${$color('light-shade')};
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

const NotesCard = styled(Card)`
	> p {
		padding: ${$uw(1)} 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
		margin: 0;
	}
	> h4 {
		margin: ${$uw(1)} 0 0;
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

const SkeletonP = styled.div`
	width: 100px;
	height: 19px;
`;
