import Calendar from "react-calendar";
import styled from "styled-components";
import { useSwipe } from "../hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { Maybe } from "graphql/jsutils/Maybe";
import _ from "lodash";

type props = {
    appointments?: AppointmentFragment[] | Maybe<AppointmentFragment>[],
    onStartDateChange: (startDate: Date)=> void
};

export const CustomCalendar: React.FC<props> = ({ appointments = [], onStartDateChange }) => {
    const [activeStartDate, setActiveStartDate] = useState(
        dayjs().startOf("month").toDate()
    );
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

    const updateStartDate = useCallback(()=> {
        console.log('pippo')
        onStartDateChange(activeStartDate)
    }, [activeStartDate])
        
    useEffect(()=> {
        updateStartDate()
    }, [activeStartDate])
   
    const periodsWithEvents = useMemo(
        () =>
          _((appointments ) ?? [])
            .map((ev) => ({
              color: ev?.health_card?.pet.main_picture?.main_color?.color ?? 'var(--ion-color-primary)',
            //   color: ev?.health_card?.pet.main_picture?.main_color?.color ?? 'var(--ion-color-primary)',
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
        return periodsWithEvents
          .filter(
            ({ from, to }) =>
              selected.endOf("day").isAfter(from) &&
              selected.startOf("day").isBefore(to)
          )
          .map((p) => p.event);
      }, [periodsWithEvents, selectedDay]);

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
                locale="ita"
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveStartDate(activeStartDate ?? new Date())
                }
                onChange={(dates: any) => {
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
                tileContent={({date})=> {
                    const day =  dayjs(date).set("hour", 12);
                    const activePeriod = periodsWithEvents.filter(
                        ({ from, to }) => day.isAfter(from) && day.isBefore(to)
                      );
                    return  activePeriod.length > 0 ? (
                        <CircleContainer>
                          {activePeriod.map((date, i) => (
                            <Circle key={i} color={date.color} />
                          ))}
                        </CircleContainer>
                      ) : (
                       <></>
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
    background-color: var(--ion-background-color);
    width: 100%;
    border: none;
    padding: 40px 12px;
    .react-calendar__month-view__days__day {
        flex: 0 0 12% !important;
        margin: 0 1.14%;
        aspect-ratio: 1/1;
        &.react-calendar__month-view__days__day--weekend {
            color: var(--ion-color-primary);
        }
        &.react-calendar__month-view__days__day--neighboringMonth {
            opacity: 0.5;
        }
    }
    .react-calendar__month-view__weekdays__weekday {
        > * {
            text-decoration: unset !important;
        }
    }
    .react-calendar__month-view__weekdays__weekday--weekend {
        color: var(--ion-color-primary);
    }
    .react-calendar__tile {
        color: var(--ion-color-dark);
        position: relative;
        &:hover {
            background-color: var(--ion-color-secondary-trasparent);
        }
    }
    .react-calendar__tile--active,
    .react-calendar__tile--hasActive {
        background-color: var(--ion-color-primary-trasparent) !important;
    }
    .react-calendar__tile--now {
        background-color: var(--ion-color-secondary);
        color: var(--ion-color-light);

        .dark & {
            color: var(--ion-color-dark);
        }
    }

    .react-calendar__navigation__label {
        color: var(--ion-color-dark);
        &:hover,
        &:focus,
        &:disabled {
            background-color: var(--ion-color-secondary-trasparent) !important;
        }
    }
`;


const CircleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  position: absolute;
  justify-content: center;
  padding-right:5px;
  bottom: 0;
`;

const Circle = styled.div<{ color: string }>`
  width: 9px;
  height: 9px;
  border: 1px solid var(--ion-color-medium-shade);
  border-radius: 10px;
  background-color: ${(props) => props.color};
  margin-top: 0.2em;
`;