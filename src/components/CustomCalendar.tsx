import Calendar from "react-calendar";
import styled from "styled-components";

type props = {};

export const CustomCalendar: React.FC<props> = ({}) => {
    return <MyCalendar />;
};

const MyCalendar = styled(Calendar)`
    background-color: var(--ion-background-color);
    width: 100%;
    .react-calendar__month-view__days__day {
        color: var(--ion-color-dark);
        &.react-calendar__month-view__days__day--weekend {
            color: var(--ion-color-primary);
        }
        &.react-calendar__month-view__days__day--neighboringMonth {
            opacity: 0.5;
        }

        
        
    }
    .react-calendar__tile{

        &:hover {
            background-color: var(--ion-color-secondary-trasparent);
        }
    }
    .react-calendar__tile--active,.react-calendar__tile--hasActive {
        background-color: var(--ion-color-primary-trasparent)!important;
    }
    .react-calendar__tile--now {
            background-color: var(--ion-color-secondary);
            color: var(--ion-color-light);

            .dark & {
                color: var(--ion-color-dark);
            }
        }

    .react-calendar__navigation__label{
        color: var(--ion-color-dark);
        &:hover, &:focus, &:disabled {
            background-color: var(--ion-color-secondary-trasparent)!important;
            
        }
    }
`;
