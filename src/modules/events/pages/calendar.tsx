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

export const CalendarEvents: React.FC = () => {
    const { setPage } = useUserContext();
    const [appointments, setAppointments] = useState<
        Maybe<AppointmentFragment>[]
    >([]);
    const [events, setEvents] = useState<AppointmentFragment[]|Maybe<AppointmentFragment>[] | undefined>([])

    const [fromDate,setFromDate] = useState(dayjs().startOf('month').startOf('week').toISOString())
    const [toDate,setToDate] = useState(dayjs().endOf('month').endOf('week').toISOString())

    const [getMyAppointments, {loading}] = useListMyTreatmentsLazyQuery({
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
                return;
            }
            setAppointments(listMyTreatments.items);
        },
    });

    const methods = useForm<MutationCreateTreatmentArgs>({ mode: "onSubmit" });
    const { openModal, closeModal } = useModal()


    const createEvent = ()=> {
        console.log(methods.getValues());
    }

    const openAddCalendarModal= useCallback(()=> {
        openModal({
            onClose:()=> {closeModal()},
            onCancel: ()=> {closeModal()},
            onSubmit:(data)=>{createEvent()},
            children: 
                <FormProvider {...methods} >
                    
                        <AddEventForm />
                    
                </FormProvider>
        })
    }, [])

    useEffect(() => {
        setPage({ visible: true, name: "Events" });
        getMyAppointments();
    }, []);

    return (
        <IonContent fullscreen>
            <CustomCalendar appointments={appointments} setDayEvents={(events)=> setEvents(events)} onStartDateChange={(v)=> {setAppointments([]); setFromDate(dayjs(v).startOf('week').toISOString()); setToDate(dayjs(v).add(1,'week').endOf('month').toISOString())}} />
            {events && <AppointmentsList loading={loading} appointments={events as AppointmentFragment[]}/>}
            <AddButton onClick={openAddCalendarModal}>
                <Icon name="addCircleOutline" color="dark-tint" size ="50px" />
            </AddButton>
        </IonContent>
    );
};


const AddButton = styled.div`
    width:60px;
    height: 60px;
    padding: 5px;
    border-radius: 30px;
    position: fixed;
    bottom: 130px; 
    left: calc(50% + var(--max-width)/2 - 84px);
    background-color: var(--ion-color-light-shade);
    box-sizing: border-box;
    @media only screen and (max-width: 420px) {
        right: 24px; 
        left: unset;
    }
`
