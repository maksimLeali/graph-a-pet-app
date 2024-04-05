import { IonContent } from "@ionic/react";
import styled from "styled-components";
import { AppointmentsList, CustomCalendar, Icon } from "../../../components";
import "react-calendar/dist/Calendar.css";
import { useUserContext, useModal } from "../../../contexts";

import { useCallback, useEffect, useState } from "react";
import { useListMyTreatmentsLazyQuery } from "../operations/__generated__/getMyAppointments.generated";
import { AppointmentFragment } from "../../../components/operations/__generated__/appointment.generated";
import { Maybe } from "graphql/jsutils/Maybe";
import dayjs from "dayjs";
import { AddEventForm } from "../components/addEventForm";
import { FormProvider, useForm } from "react-hook-form";
import { MutationCreateTreatmentArgs } from "../../../types";
import { useCreateTreatmentMutation } from "../operations/__generated__/createTreatment.generated";
import { useTranslation } from "react-i18next";
import { $uw } from "../../../utils/theme/functions";

export const CalendarEvents: React.FC = () => {
	const { setPage, refetchDashboard } = useUserContext();
	const [appointments, setAppointments] = useState<
		Maybe<AppointmentFragment>[]
	>([]);
	const [events, setEvents] = useState<
		AppointmentFragment[] | Maybe<AppointmentFragment>[] | undefined
	>([]);
	const [dateSelected, setDateSelected] = useState<Date>();
	const [fromDate, setFromDate] = useState(
		dayjs().startOf("month").startOf("week").toISOString()
	);
	const [toDate, setToDate] = useState(
		dayjs().endOf("month").endOf("week").toISOString()
	);

	const { t } = useTranslation();

	const [getMyAppointments, { loading, refetch }] =
		useListMyTreatmentsLazyQuery({
			fetchPolicy: "no-cache",
			variables: {
				commonSearch: {
					page_size: 50,
					order_by: "date",
					order_direction: "desc",
					filters: {
						ranges: [
							{
								key: "date",
								value: {
									min: fromDate,
									max: toDate,
								},
							},
						],
						join: [
							{
								key: "health_cards",
								value: {
									join: [
										{
											key: "pets",
											value: {
												join: [
													{
														key: "ownerships",
														value: {
															lists: [
																{
																	key: "custody_level",
																	value: [
																		"OWNER",
																		"SUB_OWNER",
																		"PET_SITTER",
																	],
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
			onCompleted: ({ listMyTreatments }) => {
				if (
					!listMyTreatments?.items?.length ||
					listMyTreatments.error
				) {
					return;
				}
				setAppointments(listMyTreatments.items);
			},
		});

	useEffect(() => {
		methods.setValue(
			"date_date",
			dateSelected ? dayjs(dateSelected).toISOString() : undefined!
		);
	}, [dateSelected]);
	const [createTreatment, { loading: creationLoading }] =
		useCreateTreatmentMutation({
			onCompleted: ({ createTreatment }) => {
				console.log(createTreatment);
				if (!createTreatment || createTreatment.error) {
					return;
				}

				methods.setValue("date_date", undefined!);
				methods.setValue("date_time", undefined!);
				methods.setValue("notes", undefined!);
				methods.setValue("data.name", undefined!);
				methods.setValue("data.type", undefined!);
				methods.setValue("data.health_card_id", undefined!);
				getMyAppointments();
				refetchDashboard();
				closeModal();
			},
		});

	const methods = useForm<
		MutationCreateTreatmentArgs & {
			notes: string;
			date_date: string;
			date_time: string;
		}
	>({
		mode: "onSubmit",
	});
	const { openModal, closeModal } = useModal();

	const createEvent = methods.handleSubmit((data) => {
		const time = dayjs(data.date_time);
		const date = dayjs(data.date_date)
			.set("hour", time.hour())
			.set("minute", time.minute())
			.toISOString();
		createTreatment({
			variables: {
				treatment: {
					health_card_id: data.data.health_card_id,
					name: data.data.name,
					type: data.data.type,
					date,
					logs: [data.notes],
					...(data.data.booster_date
						? { booster_date: data.data.booster_date }
						: {}),
				},
			},
		});
	});

	const openAddCalendarModal = useCallback(() => {
		openModal({
			onClose: () => {
				closeModal();
			},
			onCancel: () => {
				closeModal();
			},
			onConfirm: () => {
				createEvent();
			},
			children: (
				<FormProvider {...methods}>
					<AddEventForm />
				</FormProvider>
			),
		});
	}, []);

	useEffect(() => {
		setPage({ visible: true, name: "Events" });
		getMyAppointments();
	}, []);

	return (
		<IonContent fullscreen>
			<CustomCalendar
				appointments={appointments}
				onDateSelected={(date) => setDateSelected(date)}
				setDayEvents={(events) => setEvents(events)}
				onStartDateChange={(v) => {
					setAppointments([]);
					setFromDate(dayjs(v).startOf("week").toISOString());
					setToDate(
						dayjs(v).add(1, "week").endOf("month").toISOString()
					);
				}}
			/>
			<AddEventCta onClick={openAddCalendarModal}>
				{t("events.add_event")}
			</AddEventCta>
			{events && (
				<AppointmentsList
					loading={loading}
					appointments={events as AppointmentFragment[]}
				/>
			)}
		</IonContent>
	);
};

const AddEventCta = styled.div`
	width: 100%;
	color: var(--ion-color-primary);
	text-decoration: underline;
	text-align: end;
	padding: 0 ${$uw(2)};
`;
