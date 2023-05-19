import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import styled from "styled-components";
import { Pets, SkeletonBox } from "../components";
import { useGetUserDashboardQuery } from "../operations/__generated__/getDashboard.generated";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Pet } from "../../../types";
import { useEffect, useState } from "react";
import { DashboardPetFragment } from "../operations/__generated__/dashboardPet.generated";
import { Maybe } from "graphql/jsutils/Maybe";
import { useUserContext } from "../../../contexts";

export const Home: React.FC = () => {
    const [dateFrom, setDateFrom] = useState(dayjs().toISOString());
    const [dateTo, setDateTo] = useState(dayjs(dateFrom).add(7, "days").toISOString())
    const [pets, setPets] = useState<DashboardPetFragment[]>([]);
    const { setPage } = useUserContext()

    useEffect(()=> {
        setPage({visible: true, name: "Home"})
    }, [])
    const {loading}= useGetUserDashboardQuery({
        variables: {
            date_from: dateFrom,
            date_to: dateTo,
        },
        onCompleted: ({ getUserDashboard }) => {
            if(getUserDashboard.dashboard ){
              if(getUserDashboard.dashboard.ownerships 
                && getUserDashboard.dashboard.ownerships.items 
                && getUserDashboard.dashboard.ownerships.items.length)
              setPets(getUserDashboard.dashboard.ownerships.items.map((item)=> item!.pet))
            }
            return;
        },
    });

    return (
        <Container>
            <IonContent fullscreen>
               { pets && pets.length>0 && !loading ?  <Pets pets={pets} /> : <SkeletonBox />}
               
            </IonContent>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
`;
