import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import {
	TextInput,
	SelectInput,
	DateTimePicker,
	SubmitInput,
	Toggle,
	Option,
} from "@components";
import { ShelterTaskType, RecurrenceFreq, Weekday } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";
import { useCreateShelterTaskMutation } from "../operations/__generated__/createShelterTask.generated";

type FormValues = {
	task_type: ShelterTaskType;
	area?: string;
	scheduled_at?: string;
	rec_freq?: RecurrenceFreq;
	rec_interval?: string;
	rec_weekday?: Weekday;
	rec_ordinal?: string;
	notes?: string;
};

export const AddShelterTask: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const [isRecurring, setIsRecurring] = useState(false);

	const [createTask, { loading }] = useCreateShelterTaskMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const methods = useForm<FormValues>({ mode: "onSubmit" });

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
						<TextInput name="area" textLabel="shelters.tasks.area" />
					</Field>

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
