import {
    IonContent,
} from "@ionic/react";
import styled from "styled-components";
import { Pets, SkeletonBox } from "../components";
import { useGetUserDashboardLazyQuery, useGetUserDashboardQuery } from "../operations/__generated__/getDashboard.generated";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useUserContext } from "../../../contexts";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";
import { WeeksView } from "../../../components";
import { AppointmentFragment } from "../../../components/operations/__generated__/appointment.generated";


export const Home: React.FC = () => {

    
    const [activePet,setActivePet] = useState(0)
    const { setPage, ownedPets : pets, loading} = useUserContext()
    const [appointments , setAppointments]= useState<AppointmentFragment[]>()
    useEffect(()=> {
        setPage({ name: "Home"})
        
    }, [])
    
    

    useEffect(()=> {
        if(pets.length){
            searchAppointments()
        }
    },[activePet, pets])

    const searchAppointments = useCallback(()=> {
        // const pet=pets[activePet]
        setAppointments(pets.length 
            ? pets.map((pet)=> pet.health_card?.treatments.items?.map((treatment)=> ({
                date : treatment!.date, 
                type: treatment!.type, 
                id: treatment!.id,
                name: treatment!.name,
                health_card: {
                    pet: {
                        id: pet.id,
                        name: pet.name,
                        main_picture: {
                            id: pet.main_picture?.id,
                            main_color :{
                                color: pet.main_picture?.main_color?.color
                            }
                        }
                    }
                }
            }) ) as unknown as AppointmentFragment[] ).flat()
            : [] )
    }, [ pets, activePet])

    return (
            <IonContent fullscreen>
               { pets && pets.length>0 && !loading 
                    ?  <Pets pets={pets} onActiveChange={(v)=> setActivePet(v)}/> 
                    :  <SkeletonBox />            
                }

                <WeeksView appointments={appointments} loading={loading} fromDate={dayjs().startOf('w').toDate()}/>
               
                {/* <SkeletonBox /> */}
                 
            </IonContent>
        
    );
};

