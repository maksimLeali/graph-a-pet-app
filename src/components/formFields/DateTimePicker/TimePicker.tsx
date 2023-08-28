// import styled from "styled-components";
// import { Icon } from "../../icons";
// import { useCallback, useEffect, useMemo, useRef } from "react";
// import { IonButton } from "@ionic/react";
// import { useTranslation } from "react-i18next";
// import dayjs from "dayjs";


// type TimePickerProps = {
//     selectedHour?: number;
//     selectedMinute?: number;
//     showTimePicker: boolean;
//     handleSelectHour: (hour?: number) => void;
//     handleSelectMinute: (minute?: number) => void;
//     reset: () => void;
//     confirm: () => void;
// };

// export const TimePicker: React.FC<TimePickerProps> = ({
//     selectedHour,
//     selectedMinute,
//     showTimePicker,
//     handleSelectHour,
//     handleSelectMinute,
//     reset,
//     confirm,
// }) => {

//     const {t} = useTranslation()
//     // Define your constants, refs, and translations here
    
//     // Modify and adjust functions like centerSelectedHour, centerSelectedMinute, getMaxHourLength, getMaxMinuteLength, getHourOffset, getMinuteOffset, etc. accordingly.
    
//     useEffect(() => {
//         centerSelectedHour();
//     }, [selectedHour]);

//     useEffect(() => {
//         centerSelectedMinute();
//     }, [selectedMinute]);

//     useEffect(() => {
//         if (showTimePicker) {
//             centerSelectedHour(false);
//             centerSelectedMinute(false);
//         }
//     }, [showTimePicker]);

//     return (
//         <>
//             {/* Remove YearSelectionHeader */}
//             <TimePickerColumns>
//                 <Column>
//                     <ColumnTitle>Hours</ColumnTitle>
//                     <ColumnItems ref={hourPickerColumnsRef}>
//                         {/* Render hour column items */}
//                     </ColumnItems>
//                 </Column>
//                 <Column>
//                     <ColumnTitle>Minutes</ColumnTitle>
//                     <ColumnItems ref={minutePickerColumnsRef}>
//                         {/* Render minute column items */}
//                     </ColumnItems>
//                 </Column>
//             </TimePickerColumns>
//             <Actions>
//                 <IonButton color="danger" fill="outline" onClick={reset}>
//                     {t("actions.cancel")}
//                 </IonButton>
//                 <IonButton
//                     color="primary"
//                     onClick={confirm}
//                     disabled={!selectedHour || selectedMinute === undefined}
//                 >
//                     {t("actions.confirm")}
//                 </IonButton>
//             </Actions>
//         </>
//     );
// };

// const TimePickerColumns = styled.div`
//     display: flex;
//     gap: 20px;
//     justify-content: space-around;
//     /* Adjust styling as needed */
// `;

// // Other styled components remain unchanged

// const Column = styled.div`
//     display: flex;
//     flex-direction: column;
// `;

// const ColumnTitle = styled.div`
//     font-weight: bold;
//     font-size: 2.2rem;
//     margin-bottom: 8px;
// `;
// const Columnitems = styled.div`
//     display: flex;
//     flex-direction: column;
//     max-height: 250px;
//     overflow-y: scroll;
//     scroll-snap-type: y proximity;
//     padding: calc(100% / 2 + 65px) 0;
// `;

// const ColumnItem = styled.div`
//     padding: 5px 10px;
//     height: 50px;
//     text-transform: capitalize;
//     border-radius: 4px;
//     scroll-snap-align: center;
//     cursor: pointer;
//     color: #0008;

//     margin-bottom: 5px;
//     font-size: 4rem;
//     &.selected {
//         color: #000;
//     }
// `;

// const Actions = styled.div`
//     display: flex;
//     justify-content: space-between;
//     padding: 20px;
// `;
