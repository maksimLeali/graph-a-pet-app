import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import styled from "styled-components";
import { Pets } from "../components";
import { useGetUserDashboardQuery } from "../operations/__generated__/getDashboard.generated";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Pet } from "../../../types";
import { useState } from "react";
import { DashboardPetFragment } from "../operations/__generated__/dashboardPet.generated";
import { Maybe } from "graphql/jsutils/Maybe";

export const Home: React.FC = () => {
    const [dateFrom, setDateFrom] = useState(dayjs().toISOString());
    const [dateTo, setDateTo] = useState(dayjs(dateFrom).add(7, "days").toISOString())
    const [pets, setPets] = useState<DashboardPetFragment[]>([]);
    const getDashboard = useGetUserDashboardQuery({
        variables: {
            date_from: dateFrom,
            date_to: dateTo,
        },
        onCompleted: ({ getUserDashboard }) => {
            console.log(getUserDashboard);
            if (getUserDashboard.error) {
              toast.error('error')
            }
            if(getUserDashboard.dashboard ){
              if(getUserDashboard.dashboard.ownerships 
                && getUserDashboard.dashboard.ownerships.items 
                && getUserDashboard.dashboard.ownerships.items.length)
              setPets(getUserDashboard.dashboard.ownerships.items.map((item)=> item!.pet))
            }
            return;
        },
        onError: (error) => {
            toast.error("error");
            return;
        },
    });

    return (
        <Container>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Blank</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
               { pets && pets.length>0 && <Pets pets={pets} />}
            </IonContent>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
`;
