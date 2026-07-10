import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import {
	TextInput,
	SelectInput,
	DateTimePicker,
	SubmitInput,
	Toggle,
	Icon,
	Option,
} from "@components";
import { ShelterTaskType, RecurrenceFreq, Weekday, ShelterPersonStatus } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";
import { AssignPetsModal, PickablePet } from "../components/AssignPetsModal";
import { useGetShelterTaskQuery } from "../operations/__generated__/getShelterTask.generated";
import { useCreateShelterTaskMutation } from "../operations/__generated__/createShelterTask.generated";
import { useUpdateShelterTaskMutation } from "../operations/__generated__/updateShelterTask.generated";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapQuery } from "../operations/__generated__/getShelterMap.generated";
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";
import { useListShelterPeopleQuery } from "../operations/__generated__/listShelterPeople.generated";

type FormValues = {
	task_type: ShelterTaskType;
	area?: string;
	shelter_box_id?: string;
	scheduled_at?: string;
	rec_freq?: RecurrenceFreq;
	rec_interval?: string;
	rec_weekday?: Weekday;
	rec_ordinal?: string;
	notes?: string;
};

const PET_TYPES = [
	ShelterTaskType.Grooming,
	ShelterTaskType.Medication,
	ShelterTaskType.Feeding,
	ShelterTaskType.Other,
];
const BOX_TYPES = [
	ShelterTaskType.Cleaning,
	ShelterTaskType.DeepCleaning,
	ShelterTaskType.Other,
];

export const AddShelterTask: React.FC = () => {
	const { id, taskId } = useParams<{ id: string; taskId?: string }>();
	const editing = !!taskId;
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const history = useHistory();
	const [isRecurring, setIsRecurring] = useState(false);
	const [pickedPet, setPickedPet] = useState<{ id: string; name: string } | null>(
		null
	);
	const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
	const [assigneeShelterPersonIds, setAssigneeShelterPersonIds] = useState<string[]>([]);

	const [createTask, { loading: creating }] = useCreateShelterTaskMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});
	const [updateTask, { loading: updating }] = useUpdateShelterTaskMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});
	const loading = creating || updating;

	const { data: taskData } = useGetShelterTaskQuery({
		skip: !editing,
		variables: { id: taskId as string },
	});
	const current = editing ? taskData?.getShelterTask?.shelter_task ?? undefined : undefined;

	const methods = useForm<FormValues>({ mode: "onSubmit" });

	// aree e box dello shelter (dalla mappa)
	const { data: mapsData } = useListShelterMapsQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 20,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});
	const mapId = (mapsData?.listShelterMaps?.items ?? []).filter(Boolean)[0]?.id;
	const { data: mapData } = useGetShelterMapQuery({
		skip: !mapId,
		fetchPolicy: "cache-and-network",
		variables: { id: mapId as string },
	});
	const areas = (mapData?.getShelterMap?.map?.areas ?? []).filter(
		(a): a is NonNullable<typeof a> => !!a
	);
	const boxes = (mapData?.getShelterMap?.map?.boxes ?? []).filter(
		(b): b is NonNullable<typeof b> => !!b
	);

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
	const shelterPets = (petsData?.listShelterPets?.items ?? []).filter(
		(p): p is NonNullable<typeof p> => !!p
	);

	// membri del canile assegnabili
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
	const teamMembers = (rolesData?.listShelterRoles?.items ?? [])
		.filter((r): r is NonNullable<typeof r> => !!r?.user)
		.map((r) => ({
			id: r.user.id,
			name: [r.user.first_name, r.user.last_name].filter(Boolean).join(" ") || r.user.id,
			kind: "user" as const,
		}))
		// un utente puo avere piu ruoli: dedup per user id
		.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

	// shelter people segnati come volontari, assegnabili anche loro alle task
	const { data: peopleData } = useListShelterPeopleQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: id, search: { page: 0, page_size: 200 } },
	});
	const volunteers = (peopleData?.listShelterPeople?.items ?? [])
		.filter(
			(p): p is NonNullable<typeof p> =>
				!!p && p.status === ShelterPersonStatus.Volunteer
		)
		.map((p) => ({
			id: p.id,
			name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.id,
			kind: "person" as const,
		}));

	const members = [...teamMembers, ...volunteers];

	const toggleAssignee = (m: { id: string; kind: "user" | "person" }) => {
		if (m.kind === "user") {
			setAssigneeIds((prev) =>
				prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id]
			);
		} else {
			setAssigneeShelterPersonIds((prev) =>
				prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id]
			);
		}
	};

	useEffect(() => {
		setPage({
			name: t(editing ? "shelters.tasks.edit" : "shelters.tasks.add"),
		});
	}, [editing]);

	useEffect(() => {
		if (!current) return;
		setIsRecurring(current.is_recurring);
		if (current.shelter_pet?.pet)
			setPickedPet({
				id: current.shelter_pet.id,
				name: current.shelter_pet.pet.name,
			});
		setAssigneeIds((current.assignees ?? []).map((u) => u.id));
		setAssigneeShelterPersonIds(
			(current.assignee_shelter_people ?? []).map((p) => p.id)
		);
		methods.reset({
			task_type: current.task_type,
			area: current.area ?? undefined,
			scheduled_at: current.scheduled_at ?? undefined,
			notes: current.notes ?? undefined,
			rec_freq: current.recurrence?.freq ?? undefined,
			rec_interval:
				current.recurrence?.interval != null
					? String(current.recurrence.interval)
					: undefined,
			rec_weekday: current.recurrence?.weekdays?.[0] ?? undefined,
			rec_ordinal:
				current.recurrence?.week_ordinal != null
					? String(current.recurrence.week_ordinal)
					: undefined,
		});
	}, [current?.id]);

	const typeOptions: Option[] = Object.values(ShelterTaskType).map((key) => ({
		value: key,
		label: t(`shelters.task_types.${key.toLowerCase()}`),
	}));

	const freqOptions: Option[] = Object.values(RecurrenceFreq).map((f) => ({
		value: f,
		label: t(`shelters.tasks.rec.${f.toLowerCase()}`),
	}));
	const weekdayOptions: Option[] = Object.values(Weekday).map((w) => ({
		value: w,
		label: t(`shelters.tasks.rec.weekdays.${w}`),
	}));
	const ordinalOptions: Option[] = ["1", "2", "3", "4", "5", "-1"].map((o) => ({
		value: o,
		label: t(`shelters.tasks.rec.ordinals.${o}`),
	}));

	const freq = methods.watch("rec_freq");
	const taskType = methods.watch("task_type");
	const needsPet = !!taskType && PET_TYPES.includes(taskType);
	const needsBox = !!taskType && BOX_TYPES.includes(taskType);

	const areaOptions: Option[] = areas
		.filter((a) => a.name)
		.map((a) => ({ value: a.name as string, label: a.name as string }));
	const boxOptions: Option[] = boxes.map((b) => ({
		value: b.id,
		label: b.label || "—",
	}));

	const openPetPicker = () => {
		const pickable: PickablePet[] = shelterPets.map((sp) => ({
			id: sp.id,
			name: sp.pet?.name ?? "-",
			pictureId: sp.pet?.main_picture?.id,
			borderColor: sp.pet?.main_picture?.main_color?.color,
		}));
		const sel = { current: [] as string[] };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: () => {
				const petId = sel.current[0];
				const found = shelterPets.find((sp) => sp.id === petId);
				setPickedPet(
					found ? { id: found.id, name: found.pet?.name ?? "-" } : null
				);
				closeModal();
			},
			children: (
				<AssignPetsModal
					pets={pickable}
					max={1}
					onChange={(ids) => (sel.current = ids)}
				/>
			),
		});
	};

	const onSubmit = methods.handleSubmit(async (data) => {
		const recurrence =
			isRecurring && data.rec_freq
				? {
						freq: data.rec_freq,
						interval: data.rec_interval
							? parseInt(data.rec_interval, 10)
							: 1,
						weekdays:
							data.rec_freq !== RecurrenceFreq.Daily && data.rec_weekday
								? [data.rec_weekday]
								: undefined,
						week_ordinal:
							data.rec_freq === RecurrenceFreq.Monthly && data.rec_ordinal
								? parseInt(data.rec_ordinal, 10)
								: undefined,
						start_at: data.scheduled_at,
				  }
				: undefined;

		if (editing) {
			const res = await updateTask({
				variables: {
					id: taskId as string,
					data: {
						task_type: data.task_type,
						area: data.area,
						assignee_ids: assigneeIds,
						assignee_shelter_person_ids: assigneeShelterPersonIds,
						scheduled_at: data.scheduled_at,
						is_recurring: isRecurring,
						recurrence,
						notes: data.notes,
					},
				},
			});
			if (!res.data?.updateShelterTask?.success) {
				toast.error(t("messages.errors.fetch"));
				return;
			}
			toast.success(t("shelters.tasks.updated_ok"));
			history.replace(`/shelters/detail/${id}/tasks`);
			return;
		}

		const res = await createTask({
			variables: {
				data: {
					shelter_id: id,
					task_type: data.task_type,
					area: data.area,
					assignee_ids: assigneeIds,
					assignee_shelter_person_ids: assigneeShelterPersonIds,
					shelter_pet_id: needsPet ? pickedPet?.id : undefined,
					shelter_box_id: needsBox ? data.shelter_box_id : undefined,
					scheduled_at: data.scheduled_at,
					is_recurring: isRecurring,
					recurrence,
					notes: data.notes,
				},
			},
		});
		if (!res.data?.createShelterTask?.success) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.tasks.created_ok"));
		history.replace(`/shelters/detail/${id}/tasks`);
	});

	return (
		<IonContent>
			<FormProvider {...methods}>
				<Form onSubmit={onSubmit}>
					<h3>
						{t(editing ? "shelters.tasks.edit" : "shelters.tasks.add")}
					</h3>

					<Field>
						<SelectInput
							name="task_type"
							options={typeOptions}
							required
							textLabel="shelters.tasks.type"
						/>
					</Field>

					<Field>
						<SelectInput
							name="area"
							options={areaOptions}
							textLabel="shelters.tasks.area"
						/>
					</Field>

					{!editing && needsPet && (
						<Field>
							<span>{t("shelters.tasks.pet")}</span>
							<PickBtn type="button" onClick={openPetPicker}>
								<Icon
									name={pickedPet ? "pawSharp" : "search"}
									color="primary"
									size="18px"
								/>
								<span>
									{pickedPet
										? pickedPet.name
										: t("shelters.map.assign_pet")}
								</span>
							</PickBtn>
						</Field>
					)}

					{!editing && needsBox && (
						<Field>
							<SelectInput
								name="shelter_box_id"
								options={boxOptions}
								textLabel="shelters.tasks.box"
							/>
						</Field>
					)}

					<Field>
						<DateTimePicker
							name="scheduled_at"
							type="dateTime"
							textLabel="shelters.tasks.scheduled_at"
						/>
					</Field>

					<Field>
						<span>{t("shelters.tasks.assignees")}</span>
						{members.length === 0 ? (
							<Muted>{t("shelters.tasks.no_members")}</Muted>
						) : (
							<Members>
								{members.map((m) => {
									const on =
										m.kind === "user"
											? assigneeIds.includes(m.id)
											: assigneeShelterPersonIds.includes(m.id);
									return (
										<MemberChip
											key={`${m.kind}-${m.id}`}
											type="button"
											$on={on}
											onClick={() => toggleAssignee(m)}
										>
											{on && (
												<Icon
													name="checkmark"
													color="light"
													size="14px"
												/>
											)}
											<span>{m.name}</span>
										</MemberChip>
									);
								})}
							</Members>
						)}
					</Field>

					<Inline>
						<span>{t("shelters.tasks.recurring")}</span>
						<Toggle value={isRecurring} onChange={(v) => setIsRecurring(v)} />
					</Inline>

					{isRecurring && (
						<>
							<Field>
								<SelectInput
									name="rec_freq"
									options={freqOptions}
									required
									textLabel="shelters.tasks.rec.freq"
								/>
							</Field>

							<Field>
								<TextInput
									name="rec_interval"
									textLabel="shelters.tasks.rec.interval"
								/>
							</Field>

							{(freq === RecurrenceFreq.Weekly ||
								freq === RecurrenceFreq.Monthly) && (
								<Field>
									<SelectInput
										name="rec_weekday"
										options={weekdayOptions}
										required
										textLabel="shelters.tasks.rec.weekday"
									/>
								</Field>
							)}

							{freq === RecurrenceFreq.Monthly && (
								<Field>
									<SelectInput
										name="rec_ordinal"
										options={ordinalOptions}
										required
										textLabel="shelters.tasks.rec.week_ordinal"
									/>
								</Field>
							)}
						</>
					)}

					<Field>
						<TextInput name="notes" textLabel="shelters.tasks.notes" />
					</Field>

					<SubmitInput color="primary" disabled={loading}>
						{t(editing ? "shelters.tasks.save" : "shelters.tasks.add")}
					</SubmitInput>
				</Form>
			</FormProvider>
		</IonContent>
	);
};

const PickBtn = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(1)};
	border: 1px solid ${$color("primary")};
	border-radius: ${$uw(1)};
	background: ${$color("background")};
	padding: ${$uw(1.25)} ${$uw(1.5)};
	cursor: pointer;
	> span {
		font-size: 1.5rem;
		font-weight: 600;
		color: ${$color("dark")};
	}
`;

const Form = styled.form`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${$uw(2.5)};
	padding: ${$cssTRBL(3, 1)};
	box-sizing: border-box;
	> h3 {
		margin: 0;
		color: ${$color("primary")};
	}
	.submit-input {
		margin-top: auto;
	}
`;

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Inline = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const Members = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(1)};
`;

const MemberChip = styled.button<{ $on: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.75)};
	border: 1px solid ${$color("primary")};
	border-radius: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.5)};
	cursor: pointer;
	background: ${({ $on }) => ($on ? $color("primary") : $color("background"))};
	> span {
		font-size: 1.4rem;
		font-weight: 600;
		color: ${({ $on }) => ($on ? $color("light") : $color("dark"))};
	}
`;

const Muted = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
`;
