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
import { ShelterTaskType, RecurrenceFreq, Weekday } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";
import { AssignPetsModal, PickablePet } from "../components/AssignPetsModal";
import { useCreateShelterTaskMutation } from "../operations/__generated__/createShelterTask.generated";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapQuery } from "../operations/__generated__/getShelterMap.generated";
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";

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
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const history = useHistory();
	const [isRecurring, setIsRecurring] = useState(false);
	const [pickedPet, setPickedPet] = useState<{ id: string; name: string } | null>(
		null
	);

	const [createTask, { loading }] = useCreateShelterTaskMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

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

	useEffect(() => {
		setPage({ name: t("shelters.tasks.add") });
	}, []);

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
		const res = await createTask({
			variables: {
				data: {
					shelter_id: id,
					task_type: data.task_type,
					area: data.area,
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
					<h3>{t("shelters.tasks.add")}</h3>

					<Field>
						<span>{t("shelters.tasks.type")}</span>
						<SelectInput
							name="task_type"
							options={typeOptions}
							required
							textLabel="shelters.tasks.type"
						/>
					</Field>

					<Field>
						<span>{t("shelters.tasks.area")}</span>
						<SelectInput
							name="area"
							options={areaOptions}
							textLabel="shelters.tasks.area"
						/>
					</Field>

					{needsPet && (
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

					{needsBox && (
						<Field>
							<span>{t("shelters.tasks.box")}</span>
							<SelectInput
								name="shelter_box_id"
								options={boxOptions}
								textLabel="shelters.tasks.box"
							/>
						</Field>
					)}

					<Field>
						<span>{t("shelters.tasks.scheduled_at")}</span>
						<DateTimePicker
							name="scheduled_at"
							type="dateTime"
							textLabel="shelters.tasks.scheduled_at"
						/>
					</Field>

					<Inline>
						<span>{t("shelters.tasks.recurring")}</span>
						<Toggle value={isRecurring} onChange={(v) => setIsRecurring(v)} />
					</Inline>

					{isRecurring && (
						<>
							<Field>
								<span>{t("shelters.tasks.rec.freq")}</span>
								<SelectInput
									name="rec_freq"
									options={freqOptions}
									required
									textLabel="shelters.tasks.rec.freq"
								/>
							</Field>

							<Field>
								<span>{t("shelters.tasks.rec.interval")}</span>
								<TextInput
									name="rec_interval"
									textLabel="shelters.tasks.rec.interval"
								/>
							</Field>

							{(freq === RecurrenceFreq.Weekly ||
								freq === RecurrenceFreq.Monthly) && (
								<Field>
									<span>{t("shelters.tasks.rec.weekday")}</span>
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
									<span>{t("shelters.tasks.rec.week_ordinal")}</span>
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
						<span>{t("shelters.tasks.notes")}</span>
						<TextInput name="notes" textLabel="shelters.tasks.notes" />
					</Field>

					<SubmitInput color="primary" disabled={loading}>
						{t("shelters.tasks.add")}
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
