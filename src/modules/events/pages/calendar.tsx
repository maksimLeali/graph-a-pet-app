import { IonContent } from "@ionic/react";
import styled from "styled-components";
import { AppointmentsList, CustomCalendar } from "../../../components";
import "react-calendar/dist/Calendar.css";
import { useUserContext } from "../../../contexts";
import { useEffect, useState } from "react";
import { useListMyTreatmentsLazyQuery } from "../operations/__generated__/getMyAppointments.generated";
import { AppointmentFragment } from "../../../components/operations/__generated__/appointment.generated";
import { Maybe } from "graphql/jsutils/Maybe";
import dayjs from "dayjs";

export const CalendarEvents: React.FC = () => {
    const { setPage } = useUserContext();
    const [appointments, setAppointments] = useState<
        Maybe<AppointmentFragment>[]
    >([]);
    const [events, setEvents] = useState<AppointmentFragment[]|Maybe<AppointmentFragment>[] | undefined>([])

    const [fromDate,setFromDate] = useState(dayjs().startOf('month').startOf('week').toISOString())
    const [toDate,setToDate] = useState(dayjs().endOf('month').endOf('week').toISOString())

    const [getMyAppointments] = useListMyTreatmentsLazyQuery({
        variables: {
            commonSearch: {
                page_size: 50,
                order_by: 'date',
                order_direction: 'desc',
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
            if (!listMyTreatments?.items?.length || listMyTreatments.error) {
                console.error("errore");
                return;
            }
            setAppointments(listMyTreatments.items);
        },
    });

    
      
    useEffect(() => {
        setPage({ visible: true, name: "Events" });
        getMyAppointments();
    }, []);

    return (
        <IonContent fullscreen>
            <CustomCalendar appointments={appointments} setDayEvents={(events)=> setEvents(events)} onStartDateChange={(v)=> {setAppointments([]); setFromDate(dayjs(v).startOf('week').toISOString()); setToDate(dayjs(v).add(1,'week').endOf('month').toISOString())}} />
            {events && <AppointmentsList appointments={events as AppointmentFragment[]}/>}
        </IonContent>
    );
};
