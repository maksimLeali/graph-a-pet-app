import { IonContent } from "@ionic/react";
import styled from "styled-components";
import { CustomCalendar } from "../../../components";
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

    const [fromDate,setFromDate] = useState(dayjs().startOf('month').toISOString())
    const [toDate,setToDate] = useState(dayjs().endOf('month').toISOString())

    const [getMyAppointments] = useListMyTreatmentsLazyQuery({
        variables: {
            commonSearch: {
                page_size: 50,
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
        setPage({ visible: false, name: "Events" });
        getMyAppointments();
    }, []);

    return (
        <IonContent fullscreen>
            <CustomCalendar appointments={appointments} onStartDateChange={(v)=> {console.log(v.toISOString()) ;setAppointments([]); setFromDate(dayjs(v).startOf('week').toISOString()); setToDate(dayjs(v).add(1,'week').endOf('month').toISOString())}} />
        </IonContent>
    );
};
