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
    onStartDateChange: (startDate: Date)=> void,
    setDayEvents: (events : AppointmentFragment[]) => void
};

export const CustomCalendar: React.FC<props> = ({ appointments = [], onStartDateChange, setDayEvents }) => {
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

      useEffect(()=> {
        if(dayEvents?.length){
            setDayEvents(dayEvents as AppointmentFragment[])
            return
        }
        setDayEvents([])
      }, [dayEvents])

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
                tileContent={(val)=> {
                    console.log(val)
                    const date = val.date;
                    const day =  dayjs(date).set("hour", 12);
                    const activePeriod = periodsWithEvents.filter(
                        ({ from, to }) => day.isAfter(from) && day.isBefore(to)
                      );
                    return  activePeriod.length > 0 ? (
                        <TileContainer className="tile-container">
                            <span>{date.getDate()}</span>
                        <CircleContainer>
                          {activePeriod.map((date, i) => (
                              <Circle key={i} color={date.color} />
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
    
    .react-calendar__tile--active,
    .react-calendar__tile--hasActive {
        > .tile-container { 
            span {
                background-color: var(--ion-color-primary-trasparent) !important;
            }
        }
    }
    .react-calendar__tile--now {
        > .tile-container {
            > span {

                background-color: var(--ion-color-secondary);
                color: var(--ion-color-light);
                .dark & {
                    color: var(--ion-color-dark);
                }
            }
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
    .react-calendar__tile {
        color: var(--ion-color-dark);
        position: relative;
        > .tile-container {
            display: none;
        }
        &.react-calendar__month-view__days__day{
            padding:0;
            background-color:none!important;
            background: none!important;;
            display: flex;
            margin-bottom: 5px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            > .tile-container {
                display:flex
            }
            > abbr {
                display: none
            }
        }
    }
`;


const CircleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right:5px;
  gap: 1px;
  bottom: 0;
`;

const Circle = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border: 1px solid var(--ion-color-dark-shade);
  border-radius: 10px;
  background-color: ${(props) => props.color};
  margin-top: 0.2em;
`;

const TileContainer = styled.div`
    width:100%;
    height:100%;
    flex-direction: column;
    gap:2px;
    justify-content: center;
    align-items: center;
    > span {
        color: var(--ion-color-dark);
        display: flex;
        justify-content: center;
        align-items: center;
        width:30px;
        aspect-ratio:1;
        box-sizing:border-box;
        border-radius: 10px;
        margin-bottom: 0;
    }
    &.empty {
        > span {
            margin-bottom: 14px;
        }
    }
`