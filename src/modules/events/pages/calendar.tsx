import { IonContent, IonRefresher, IonRefresherContent, RefresherEventDetail } from "@ionic/react";
import styled from "styled-components";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import "react-calendar/dist/Calendar.css";
import { Maybe } from "graphql/jsutils/Maybe";

import { I18NKey } from "@i18n";

import { AppointmentFragment } from "@graphql_generated/appointment.generated";
import { useListMyTreatmentsLazyQuery } from "../operations/__generated__/getMyAppointments.generated";
import { useCreateTreatmentMutation } from "../operations/__generated__/createTreatment.generated";
import { useCreateWalkMutation } from "../operations/__generated__/createWalk.generated";
import { useCreateWalkRatingMutation } from "../operations/__generated__/createWalkRating.generated";
import { useCreateCureMutation } from "../operations/__generated__/createCure.generated";

import { useUserContext, useModal } from "@contexts";
import { AppointmentsList, CustomCalendar } from "@components";
import { AddEventFormStep1, AddEventFormStep2 } from "../components/addEventForm";
import {
	FrequencyUnit,
	MutationCreateTreatmentArgs,
	TreatmentType,
	WalkRatingType,
} from "@types";
import { $color, $uw } from "@theme";

export const CalendarEvents: React.FC = () => {
	const { setPage, refetchDashboard} = useUserContext();
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


	const [getMyAppointments, { loading }] =
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

	const onMutationError = () => toast.error(t("messages.errors.fetch"));

	const [createTreatment, { loading: creationLoading }] =
		useCreateTreatmentMutation({ onError: onMutationError });
	const [createWalk] = useCreateWalkMutation({ onError: onMutationError });
	const [createWalkRating] = useCreateWalkRatingMutation({
		onError: onMutationError,
	});
	const [createCure] = useCreateCureMutation({ onError: onMutationError });

	const methods = useForm<
		MutationCreateTreatmentArgs & {
			notes: string;
			date_date: string;
			date_time: string;
			walk?: {
				distance_km?: string;
				ratings?: Partial<Record<WalkRatingType, number>>;
			};
			cure?: {
				frequency_times?: string;
				frequency_value?: string;
				frequency_unit?: FrequencyUnit;
			};
		}
	>({
		mode: "onSubmit",
	});
	const { openModal, closeModal } = useModal();

	const finishSuccess = () => {
		toast.success(t("messages.success.event_created"));
		methods.reset();
		closeModal();
		getMyAppointments();
		refetchDashboard();
	};

	const createEvent = methods.handleSubmit(
		async (data) => {
			const time = dayjs(data.date_time);
			const date = dayjs(data.date_date)
				.set("hour", time.hour())
				.set("minute", time.minute())
				.toISOString();
			const { health_card_id, name, type } = data.data;
			const notes = data.notes ? [data.notes] : undefined;

			try {
				// WALK: create walk (spawns its treatment) + optional overall rating
				if (type === TreatmentType.Walk) {
					const res = await createWalk({
						variables: {
							walk: {
								date,
								health_card_id,
								name,
								distance_km: Number(data.walk?.distance_km) || 0,
								...(notes ? { notes } : {}),
							},
						},
					});
					const w = res.data?.createWalk;
					if (!w?.success || w.error) {
						toast.error(t("messages.errors.fetch"));
						return;
					}
					if (w.walk?.id) {
						const ratings = data.walk?.ratings ?? {};
						await Promise.all(
							Object.values(WalkRatingType)
								.map((type) => ({
									type,
									rating: Number(ratings[type]),
								}))
								.filter(({ rating }) => rating)
								.map(({ type, rating }) =>
									createWalkRating({
										variables: {
											walkRating: {
												walk_id: w.walk!.id,
												type,
												rating,
											},
										},
									})
								)
						);
					}
					finishSuccess();
					return;
				}

				// CURE: create cure (spawns its treatment + recall chain via frequency)
				if (type === TreatmentType.Cure) {
					const res = await createCure({
						variables: {
							cure: {
								name,
								date,
								health_card_id,
								...(data.cure?.frequency_times
									? {
											frequency_times: Number(
												data.cure.frequency_times
											),
									  }
									: {}),
								...(data.cure?.frequency_value
									? {
											frequency_value: Number(
												data.cure.frequency_value
											),
									  }
									: {}),
								...(data.cure?.frequency_unit
									? { frequency_unit: data.cure.frequency_unit }
									: {}),
								...(notes ? { notes } : {}),
							},
						},
					});
					const c = res.data?.createCure;
					if (!c?.success || c.error) {
						toast.error(t("messages.errors.fetch"));
						return;
					}
					finishSuccess();
					return;
				}

				// default: plain treatment
				const res = await createTreatment({
					variables: {
						treatment: {
							health_card_id,
							name,
							type,
							date,
							...(notes ? { logs: notes } : {}),
							...(data.data.booster_date
								? { booster_date: data.data.booster_date }
								: {}),
						},
					},
				});
				const tr = res.data?.createTreatment;
				if (!tr?.success || tr.error) {
					toast.error(
						tr?.error?.message
							? t(tr.error.message as I18NKey)
							: t("messages.errors.fetch")
					);
					return;
				}
				finishSuccess();
			} catch {
				toast.error(t("messages.errors.fetch"));
			}
		},
		() => {
			toast.error(t("messages.errors.required"));
		}
	);

	const openAddCalendarModal = useCallback(() => {
		openModal({
			onClose: () => {
				closeModal();
			},
			onCancel: () => {
				closeModal();
			},
			onConfirm: () => {
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
							<AddEventFormStep2 />
						</FormProvider>
					),
				});
			},
			children: (
				<FormProvider {...methods}>
					<AddEventFormStep1 />
				</FormProvider>
			),
		});
	}, []);

	useEffect(() => {
		setPage({ visible: true, name: "Events" });
		getMyAppointments();
	}, []);

	const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
		setAppointments([])
		getMyAppointments()
		event.detail.complete();
	};

	return (
		<IonContent fullscreen>
			<IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
				<IonRefresherContent></IonRefresherContent>
			</IonRefresher>
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
	color: ${$color("primary")};
	text-decoration: underline;
	text-align: end;
	padding: 0 ${$uw(2)};
`;
