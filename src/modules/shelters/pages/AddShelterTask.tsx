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
import { ShelterTaskType } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";
import { useCreateShelterTaskMutation } from "../operations/__generated__/createShelterTask.generated";

type FormValues = {
	task_type: ShelterTaskType;
	area?: string;
	scheduled_at?: string;
	recurrence_rule?: string;
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

	const onSubmit = methods.handleSubmit(async (data) => {
		const res = await createTask({
			variables: {
				data: {
					shelter_id: id,
					task_type: data.task_type,
					area: data.area,
					scheduled_at: data.scheduled_at,
					is_recurring: isRecurring,
					recurrence_rule: isRecurring ? data.recurrence_rule : undefined,
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
						<Field>
							<span>{t("shelters.tasks.recurrence_rule")}</span>
							<TextInput
								name="recurrence_rule"
								textLabel="shelters.tasks.recurrence_hint"
							/>
						</Field>
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
