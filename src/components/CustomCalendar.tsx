import Calendar from "react-calendar";
import styled from "styled-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Maybe } from "graphql/jsutils/Maybe";
import _ from "lodash";

import { useSwipe } from "@hooks";
import { AppointmentFragment } from "@graphql_generated/appointment.generated";
import { $color } from "@theme";
import { useTranslation } from "react-i18next";

type props = {
	appointments?: AppointmentFragment[] | Maybe<AppointmentFragment>[];
	onStartDateChange: (startDate: Date) => void;
	setDayEvents: (events: AppointmentFragment[]) => void;
	onDateSelected: (date?: Date) => void;
};

export const CustomCalendar: React.FC<props> = ({
	appointments = [],
	onStartDateChange,
	setDayEvents,
	onDateSelected,
}) => {
	const [activeStartDate, setActiveStartDate] = useState(
		dayjs().startOf("month").toDate()
	);

	const { i18n } = useTranslation();

	const [selectedDay, setSelectedDay] = useState<Date>();

	const onLeft = useCallback(
		() =>
			setActiveStartDate((active) =>
				dayjs(active).add(1, "month").startOf("month").toDate()
			),
		[]
	);
	const onRight = useCallback(
		() =>
			setActiveStartDate((active) =>
				dayjs(active).subtract(1, "month").startOf("month").toDate()
			),
		[]
	);

	const updateStartDate = useCallback(() => {
		onStartDateChange(activeStartDate);
	}, [activeStartDate]);

	useEffect(() => {
		updateStartDate();
	}, [activeStartDate]);

	const periodsWithEvents = useMemo(
		() =>
			_(appointments ?? [])
				.map((ev) => ({
					color:
						ev?.health_card?.pet.main_picture?.main_color?.color ??
						"primary",
					from: dayjs(ev?.date).startOf("day"),
					to: dayjs(ev?.date).endOf("day"),
					event: ev,
				}))
				.sortBy("from")
				.reverse()
				.value(),
		[appointments]
	);

	const dayEvents = useMemo(() => {
		const selected = dayjs(selectedDay);
		if (!selectedDay || selected.year() < 1990)
			return periodsWithEvents.map((p) => p.event);
		return periodsWithEvents
			.filter(
				({ from, to }) =>
					selected.endOf("day").isAfter(from) &&
					selected.startOf("day").isBefore(to)
			)
			.map((p) => p.event);
	}, [periodsWithEvents, selectedDay]);

	useEffect(() => {
		if (selectedDay && selectedDay?.getFullYear() > 1990) {
			onDateSelected(selectedDay);
			return;
		}
		onDateSelected(undefined);
	}, [selectedDay]);
	useEffect(() => {
		if (dayEvents?.length) {
			setDayEvents(dayEvents as AppointmentFragment[]);
			return;
		}
		setDayEvents([]);
	}, [dayEvents]);

	const { handleTouchStart, handleTouchMove } = useSwipe({
		onLeft,
		onRight,
	});

	return (
		<Container
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
		>
			<MyCalendar
				locale={i18n.language}
				activeStartDate={activeStartDate}
				onActiveStartDateChange={({ activeStartDate }) =>
					setActiveStartDate(activeStartDate ?? new Date())
				}
				onChange={(dates: any) => {
					console.log("change", dates);
					const newDate = _.isArray(dates) ? dates[0] : dates;
					if (dayjs(newDate).diff(dayjs(selectedDay), "days") === 0) {
						setSelectedDay(
							dayjs(newDate).subtract(100, "years").toDate()
						);
					} else {
						setSelectedDay(newDate);
					}
				}}
				value={selectedDay}
				tileContent={(val) => {
					const date = val.date;
					const day = dayjs(date).set("hour", 12);
					const activePeriod = periodsWithEvents.filter(
						({ from, to }) => day.isAfter(from) && day.isBefore(to)
					);
					return activePeriod.length > 0 ? (
						<TileContainer
							key={date.toISOString()}
							className="tile-container"
						>
							<span>{date.getDate()}</span>
							<CircleContainer>
								{activePeriod.map((date, i) => (
									<Circle key={i} color={date.color} className="custom-pet-color"/>
								))}
							</CircleContainer>
						</TileContainer>
					) : (
						<TileContainer className="tile-container empty">
							<span>{date.getDate()}</span>
						</TileContainer>
					);
				}}
			/>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	display: block;
`;

const MyCalendar = styled(Calendar)`
	background-color: ${$color("background-color")};
	width: 100%;
	border: none;
	padding: 40px 12px;
	* {
		text-transform: capitalize;
	}
	.react-calendar__month-view__weekdays__weekday{
		> * {
			text-transform: uppercase;
		}
	}
	.react-calendar__month-view__days__day {
		flex: 0 0 12% !important;
		margin: 0 2.14%;
		aspect-ratio: 1/1;
		&.react-calendar__month-view__days__day--weekend {
			color: ${$color("primary")};
		}
		&.react-calendar__month-view__days__day--neighboringMonth {
			opacity: 0.5;
		}
	}

	.react-calendar__month-view__weekdays__weekday {
		> * {
			text-decoration: unset !important;
			font-size: 1.2rem;
		}
	}
	.react-calendar__month-view__weekdays__weekday--weekend {
		color: ${$color("primary")};
	}

	.react-calendar__tile--active,
	.react-calendar__tile--hasActive {
		> .tile-container {
			span {
				background-color: ${$color("primary-trasparent")} !important;
			}
		}
	}
	.react-calendar__tile--now {
		background-color: ${$color("secondary")};
		abbr {
			color: ${$color("light")}!important;
			.dark & {
				color: ${$color("dark")}!important;
			}
		}
		> .tile-container {
			> span {
				background-color: ${$color("secondary")};
				color: ${$color("light")}!important;
				.dark & {
					color: ${$color("dark")}!important;
				}
			}
		}
	}

	.react-calendar__navigation__arrow {
		color: ${$color("dark")};
	}
	.react-calendar__tile--hasActive {
		background-color: ${$color("primary-trasparent")};
	}

	.react-calendar__navigation
		button:enabled:hover.react-calendar__navigation__arrow,
	.react-calendar__navigation
		button:enabled:focus.react-calendar__navigation__arrow {
		background-color: unset !important;
	}

	.react-calendar__navigation__label {
		color: ${$color("dark")};
		text-transform: capitalize;
		&:hover,
		&:focus,
		&:disabled {
			background-color: ${$color("secondary-trasparent")} !important;
		}
	}
	.react-calendar__tile {
		color: ${$color("dark")};
		position: relative;
		> .tile-container {
			display: none;
		}
		&.react-calendar__month-view__days__day {
			padding: 0;
			background-color: none !important;
			background: none !important;
			display: flex;
			margin-bottom: 5px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			> .tile-container {
				display: flex;
			}
			> abbr {
				display: none;
			}
		}
	}
`;

const CircleContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	padding-right: 5px;
	gap: 1px;
	bottom: 0;
`;

const Circle = styled.div<{ color: string }>`
	width: 8px;
	height: 8px;
	border: 1px solid ${$color("dark-shade")};
	border-radius: 10px;
	background-color: ${({ color }) => $color(color)};
	margin-top: 0.2em;
`;

const TileContainer = styled.div`
	width: 100%;
	height: 100%;
	flex-direction: column;
	gap: 2px;
	justify-content: center;
	align-items: center;
	> span {
		color: ${$color("dark")};
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		aspect-ratio: 1;
		box-sizing: border-box;
		border-radius: 10px;
		margin-bottom: 0;
	}
	&.empty {
		> span {
			margin-bottom: 14px;
		}
	}
`;
