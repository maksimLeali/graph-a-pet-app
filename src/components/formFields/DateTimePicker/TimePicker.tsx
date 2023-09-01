import styled from "styled-components";
import { Icon } from "../../icons";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type TimePickerProps = {
    selectedHour?: number;
    selectedMinute?: number;
    showTimePicker: boolean;
    maxHour?: number;
    minHour?: number;
    maxMinute?: number;
    minMinute?: number;
    handleSelectHour: (hour?: number) => void;
    handleSelectMinute: (minute?: number) => void;
    reset: () => void;
    confirm: () => void;
};

export const TimePicker: React.FC<TimePickerProps> = ({
    selectedHour,
    selectedMinute,
    showTimePicker,
    maxHour = 23,
    minHour = 0,
    maxMinute = 59,
    minMinute = 0,
    handleSelectHour,
    handleSelectMinute,
    reset,
    confirm,
}) => {
    const minutePickerColumnsRef = useRef<HTMLDivElement | null>(null);
    const hourPickerColumnsRef = useRef<HTMLDivElement | null>(null);
    const nowMinute = useMemo(() => dayjs().minute(), []);
    const nowHour = useMemo(() => dayjs().hour(), []);
    const { t } = useTranslation();
  
    const centerSelectedMinute = useCallback(
        (smooth = true) => {
            if (!showTimePicker) return;

            if (!minutePickerColumnsRef.current) {
                setTimeout(() => {
                    centerSelectedMinute();
                }, 100);
                return;
            }
            const selectedDayElement =
                (minutePickerColumnsRef.current.querySelector(
                    ".selected"
                ) as HTMLDivElement) ||
                minutePickerColumnsRef.current.querySelector(".now");
            if (selectedDayElement) {
                const containerHeight =
                    minutePickerColumnsRef.current.offsetHeight;
                const selectedDayOffsetTop = selectedDayElement.offsetTop;
                // const selectedDayHeight = selectedDayElement.offsetHeight;

                // Calculate the scroll position to center the selected day
                const scrollPosition =
                    selectedDayOffsetTop - containerHeight / 2;
                minutePickerColumnsRef.current?.scrollTo({
                    top: scrollPosition,
                    behavior: smooth ? "smooth" : undefined,
                });
            }
        },
        [selectedMinute, minutePickerColumnsRef, showTimePicker]
    );
    const centerSelectedHour = useCallback(
        (smooth = true) => {
            if (!showTimePicker) return;
            
            if (!hourPickerColumnsRef.current) {
                setTimeout(() => {
                    centerSelectedMinute();
                }, 100);
                return;
            }
            const selectedHourElement =
                (hourPickerColumnsRef.current.querySelector(
                    ".selected"
                ) as HTMLDivElement) ||
                hourPickerColumnsRef.current.querySelector(".now");
            if (selectedHourElement) {
                
                const containerHeight =
                    hourPickerColumnsRef.current.offsetHeight;
                const selectedHourOffsetTop = selectedHourElement.offsetTop;
                // const selectedHourHeight = selectedHourElement.offsetHeight;

                // Calculate the scroll position to center the selected day
                const scrollPosition =
                    selectedHourOffsetTop - containerHeight / 2;
                hourPickerColumnsRef.current?.scrollTo({
                    top: scrollPosition,
                    behavior: smooth ? "smooth" : undefined,
                });
            }
        },
        [selectedHour, hourPickerColumnsRef, showTimePicker]
    );

    useEffect(() => {
        centerSelectedHour();
    }, [selectedHour]);

    useEffect(() => {
        centerSelectedMinute();
    }, [selectedMinute]);

    useEffect(() => {
        if (showTimePicker) {
            centerSelectedHour(false);
            centerSelectedMinute(false);
        }
    }, [showTimePicker]);

    return (
        <>
            {/* Remove YearSelectionHeader */}
            <TimePickerColumns>
                <Column>
                    <ColumnTitle>Hours</ColumnTitle>
                    <ColumnItems ref={hourPickerColumnsRef}>
                        {Array(maxHour - minHour + 1)
                            .fill("")
                            .map((_, index) => {
                                const isNow = index == nowHour;
                                return (
                                    <ColumnItem
                                        key={index}
                                        className={`${
                                            selectedHour == index + minMinute
                                                ? "selected"
                                                : ""
                                        } ${isNow ? "now" : ""}`}
                                        onClick={() =>
                                            handleSelectHour(index + minMinute)
                                        }
                                    >
                                        {(index + minHour)
                                            .toString()
                                            .padStart(2, "0")}
                                    </ColumnItem>
                                );
                            })}
                    </ColumnItems>
                </Column>
                <Column>
                    <ColumnTitle>Minutes</ColumnTitle>
                    <ColumnItems ref={minutePickerColumnsRef}>
                        {Array(maxMinute - minMinute + 1)
                            .fill("")
                            .map((i, index) => {
                                const isNow = index == nowMinute;
                                return (
                                    <ColumnItem
                                        key={index}
                                        className={`${
                                            selectedMinute == index + minMinute
                                                ? "selected"
                                                : ""
                                        } ${isNow ? "now" : ""}`}
                                        onClick={() =>
                                            handleSelectMinute(
                                                index + minMinute
                                            )
                                        }
                                    >
                                        {(index + minMinute)
                                            .toString()
                                            .padStart(2, "0")}
                                    </ColumnItem>
                                );
                            })}
                    </ColumnItems>
                </Column>
            </TimePickerColumns>
            <Actions>
                <IonButton color="danger" fill="outline" onClick={reset}>
                    {t("actions.cancel")}
                </IonButton>
                <IonButton
                    color="primary"
                    onClick={confirm}
                    disabled={selectedHour === undefined || selectedMinute === undefined}
                >
                    {t("actions.confirm")}
                </IonButton>
            </Actions>
        </>
    );
};

const TimePickerColumns = styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-around;
    /* Adjust styling as needed */
`;

// Other styled components remain unchanged

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const ColumnTitle = styled.div`
    font-weight: bold;
    font-size: 2.2rem;
    margin-bottom: 8px;
`;
const ColumnItems = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 250px;
    overflow-y: scroll;
    scroll-snap-type: y proximity;
    padding: calc(100% / 2 + 65px) 0;
`;

const ColumnItem = styled.div`
    padding: 5px 10px;
    height: 50px;
    text-transform: capitalize;
    border-radius: 4px;
    scroll-snap-align: center;
    cursor: pointer;
    color: #0008;

    margin-bottom: 5px;
    font-size: 4rem;
    &.selected {
        color: #000;
    }
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`;
