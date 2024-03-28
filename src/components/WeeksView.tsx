import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { Maybe } from "../types";
import _ from "lodash";
import { AppointmentsList, WeeksSkeleton } from "./";
import { $cssTRBL, $uw } from "../utils/theme/functions";

type props = {
  fromDate: Date;
  loading?: boolean;
  appointments?: AppointmentFragment[] | Maybe<AppointmentFragment>[];
};

export const WeeksView: React.FC<props> = ({
  fromDate,
  appointments = [],
  loading = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [now, setNow] = useState<Date>();

  const periodsWithEvents = useMemo(
    () =>
      _(appointments ?? [])
        .map((ev) => ({
          color:
            ev?.health_card?.pet.main_picture?.main_color?.color ??
            "var(--ion-color-primary)",
          from: dayjs(ev?.date).startOf("day"),
          to: dayjs(ev?.date).endOf("day"),
          event: ev,
        }))
        .orderBy((item) => item.event?.date, ["asc"])
        .value(),
    [appointments]
  );

  const dayEvents = useMemo(() => {
    const selected = dayjs(selectedDay);
    return _(periodsWithEvents)
      .filter(({ from, to }) =>
        selected
          ? selected.endOf("day").isAfter(from) &&
            selected.startOf("day").isBefore(to)
          : dayjs(now).endOf("day").isAfter(from) &&
            dayjs(now).startOf("day").isBefore(to)
      )
      .orderBy((item) => item.event!.date, ["asc"])
      .map((p) => p.event)
      .value();
  }, [periodsWithEvents, selectedDay]);

  useEffect(() => {
    [...Array(14)].map((el, i) => {
      if (dayjs(fromDate).add(i, "d").date() == dayjs().date()) {
        setNow(new Date());
      }
    });
  }, []);
  // const [endDay,setEndDay]= useState(dayjs().add(1,'w').endOf('week'))

  return (
    <Container>
      {loading ? (
        <WeeksSkeleton />
      ) : (
        <WeeksContainer className="list-shadow">
          {[...Array(14)].map((el, i) => {
            const date = dayjs(fromDate).add(i, "d");
            const isNow = date.isSame(dayjs(), "day");
            const selected =
              selectedDay && date.isSame(dayjs(selectedDay), "day");
            const day = dayjs(date).set("hour", 12);
            const activePeriod = periodsWithEvents.filter(
              ({ from, to }) => day.isAfter(from) && day.isBefore(to)
            );
            return (
              <DateContainer key={i}>
                <span
                  key={i}
                  onClick={() => {
                    setSelectedDay(date.toDate());
                  }}
                  className={`${isNow ? "now" : ""} ${
                    selected ? "selected" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: date.format("ddd <br> D"),
                  }}
                />
                {activePeriod.length > 0 && (
                  <CircleContainer key={"#" + i + "00"}>
                    {activePeriod.map((item, i) => (
                      <Circle key={item.color + i} color={item.color} />
                    ))}
                  </CircleContainer>
                )}
              </DateContainer>
            );
          })}
        </WeeksContainer>
      )}
      <AppointmentsList
        loading={loading}
        appointments={dayEvents.map((dayEvent) => dayEvent)}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const WeeksContainer = styled.div`
  height: ${$uw(5)};
  overflow-x: scroll;
  padding: ${$cssTRBL(1, 0, 1, 1)};
  display: flex;
  justify-content: space-between;

  width: 100%;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: var(--ion-color-medium);
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const DateContainer = styled.div`
  width: ${$uw(3.2)};
  flex: 0 0 ${$uw(3.2)};
  margin-right: calc(${$uw(9.6)} / 8);
  > span {
    text-align: center;
    display: flex;
    border-radius: 10px;
    height: ${$uw(3)};
    padding: 4px 0;
    font-size: 1.4rem;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-dark);
    &.now {
      background-color: var(--ion-color-secondary);
      color: var(--ion-color-light);
      .dark & {
        color: var(--ion-color-dark);
      }
    }
    &.selected {
      background-color: var(--ion-color-primary);
      color: var(--ion-color-light);
      .dark & {
        color: var(--ion-color-dark);
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
  border: 1px solid var(--ion-color-dark);
  border-radius: 10px;
  background-color: ${(props) => props.color};
  margin-top: 0.2em;
`;
