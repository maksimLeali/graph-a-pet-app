import {
    IonContent,
} from "@ionic/react";
import styled from "styled-components";
import { CustomCalendar } from "../../../components";
import 'react-calendar/dist/Calendar.css';

export const CalendarEvents: React.FC = () => {


    return (
            <IonContent fullscreen>
              <CustomCalendar />
               
            </IonContent>
        
    );
};

