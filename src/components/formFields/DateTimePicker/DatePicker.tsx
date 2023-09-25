import styled from "styled-components";
import { Icon } from "../../icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
type props = {
    minDate: string;
    maxDate: string;
    selectedYear?: number;
    selectedMonth?: number;
    selectedDay?: number;
    showDatePicker: boolean;
    handleSelectDay: (day?: number) => void;
    handleSelectMonth: (month?: number) => void;
    handleSelectYear: (year?: number) => void;
    reset: () => void;
    confirm: () => void;
};

export const DatePicker: React.FC<props> = ({
    minDate,
    maxDate,
    selectedDay,
    selectedMonth,
    selectedYear,
    showDatePicker,
    handleSelectDay,
    handleSelectMonth,
    handleSelectYear,
    reset,
    confirm,
}) => {
    const todayDay = useMemo(() => dayjs().date(), []);
    const todayMonth = useMemo(() => dayjs().month(), []);
    const todayYear = useMemo(() => dayjs().year(), []);
    const minYear = useMemo(() => dayjs(minDate).year(), []);
    const minMonth = useMemo(() => dayjs(minDate).month(), []);
    const minDay = useMemo(() => dayjs(minDate).date(), []);
    const maxYear = useMemo(() => dayjs(maxDate).year(), []);
    const maxMonth = useMemo(() => dayjs(maxDate).month(), []);
    const maxDay = useMemo(() => dayjs(maxDate).date(), []);

    const yearListRef = useRef<HTMLDivElement | null>(null);
    const datePickerColumnsRef = useRef<HTMLDivElement | null>(null);
    const monthPickerColumnsRef = useRef<HTMLDivElement | null>(null);

    const [pseudoDay, setpseudoDay] = useState<number>();
    const [pseudoMonth, setpseudoMonth] = useState<number>();
    const [pseudoYear, setpseudoYear] = useState<number>();

    const { t } = useTranslation();

    const centerSelectedYear = useCallback(
        (smooth = true) => {
            if (!showDatePicker) return;
            if (!yearListRef.current) {
                setTimeout(() => {
                    centerSelectedYear();
                }, 100);
                return;
            }
            const selectedYearElement =
                (yearListRef.current.querySelector(
                    ".selected"
                ) as HTMLSpanElement) ||
                yearListRef.current.querySelector(".today");
            if (selectedYearElement) {
                const containerWidth = yearListRef.current.offsetWidth;
                const selectedYearOffsetLeft = selectedYearElement.offsetLeft;

                // Calculate the scroll position to center the selected year
                const scrollPosition =
                    selectedYearOffsetLeft - containerWidth / 2;
                yearListRef.current.scrollTo({
                    left: scrollPosition,
                    behavior: smooth ? "smooth" : undefined,
                });
            }
        },
        [selectedDay, yearListRef, showDatePicker]
    );

    const centerSelectedDay = useCallback(
        (smooth = true) => {
            if (!showDatePicker) return;
    
            if (!datePickerColumnsRef.current) {
                setTimeout(() => {
                    centerSelectedDay();
                }, 100);
                return;
            }
            const selectedDayElement =
                (datePickerColumnsRef.current.querySelector(
                    ".selected"
                ) as HTMLDivElement) ||
                datePickerColumnsRef.current.querySelector(".today");
            if (selectedDayElement) {
                const containerWidth =
                    datePickerColumnsRef.current.offsetWidth;
                const selectedDayOffsetLeft = selectedDayElement.offsetLeft;
    
                // Calculate the scroll position to center the selected day
                const scrollPosition =
                    selectedDayOffsetLeft - (containerWidth / 2) +20; 
                datePickerColumnsRef.current.scrollTo({
                    left: scrollPosition,
                    behavior: smooth ? "smooth" : undefined,
                });
            }
        },
        [selectedDay, datePickerColumnsRef, showDatePicker]
    );

    const centerSelectedMonth = useCallback(
        (smooth = true) => {
            if (!showDatePicker) return;
    
            if (!monthPickerColumnsRef.current) {
                setTimeout(() => {
                    centerSelectedMonth();
                }, 100);
                return;
            }
            const selectedMonthElement =
                (monthPickerColumnsRef.current.querySelector(
                    ".selected"
                ) as HTMLDivElement) ||
                monthPickerColumnsRef.current.querySelector(".today");
            if (selectedMonthElement) {
                const containerWidth =
                    monthPickerColumnsRef.current.offsetWidth;
                const selectedMonthOffsetLeft = selectedMonthElement.offsetLeft;
    
                // Calculate the scroll position to center the selected month
                const scrollPosition =
                    selectedMonthOffsetLeft - (containerWidth / 2 )+ 30; 
                monthPickerColumnsRef.current.scrollTo({
                    left: scrollPosition,
                    behavior: smooth ? "smooth" : undefined,
                });
            }
        },
        [selectedMonth, monthPickerColumnsRef, showDatePicker]
    );

    const pseudoYearHandler = (year?: number) => {
        if (year) return setpseudoYear(year);
        if (minYear < todayYear && maxYear > todayYear) {
            return setpseudoYear(todayYear);
        }
        return setpseudoYear(minYear);
    };
    const pseudoMonthHandler = (month?: number) => {
        if (month != undefined) return setpseudoMonth(month);
        if (![minYear, maxYear].includes(pseudoYear!)) {
            return setpseudoMonth(todayMonth);
        }
        if (pseudoYear == minYear) {
            if (minMonth > todayMonth) return setpseudoMonth(minMonth);
            return setpseudoMonth(todayMonth);
        }
        if (maxMonth < todayMonth) return setpseudoMonth(maxMonth);
        return setpseudoMonth(todayMonth);
    };

    const pseudoDayHandler = (day?: number) => {
        if (day) return setpseudoDay(day);
        if (![minYear, maxYear].includes(pseudoYear!)) {
            return setpseudoDay(todayDay);
        }
        if (minYear == pseudoYear) {
            if (minMonth < pseudoMonth!) return setpseudoDay(todayDay);
            if (todayDay < minDay) return setpseudoDay(minDay);
            return setpseudoDay(todayDay);
        }
        if (maxMonth > pseudoMonth!) return setpseudoDay(todayDay);
        if (todayDay > maxDay) return setpseudoDay(maxDay);
        return setpseudoDay(todayDay);
    };

    const handleYearSelect = (year: number) => {
        if (selectedMonth !== undefined && year !== selectedYear) {
            if (year == minYear && selectedMonth < minMonth) {
                handleMonthSelect(undefined);
            }
            if (selectedYear == maxYear && selectedMonth > maxMonth) {
                handleMonthSelect(undefined);
            }
        }

        handleSelectYear(year);
        pseudoYearHandler(year);
    };

    const handleMonthSelect = (month: number | undefined) => {
        if (
            selectedMonth != undefined &&
            selectedDay &&
            selectedMonth != month
        ) {
            if (
                selectedYear == minYear &&
                month == minMonth &&
                selectedDay < minDay
            ) {
                handleDaySelect(undefined);
            }
            if (
                selectedYear == maxYear &&
                month == maxMonth &&
                selectedDay > maxDay
            ) {
                handleDaySelect(undefined);
            }
        }
        if (!month) handleSelectDay(undefined);

        handleSelectMonth(month);
        pseudoMonthHandler(month);
    };
    const handleDaySelect = (date: number | undefined) => {
        if (date) setpseudoDay(date);
        console.log('date', date)
        handleSelectDay(date);
    };

    const getMaxDateLength = useCallback(() => {
        if (!pseudoYear || pseudoMonth == undefined) return 30;
        if (maxYear == minYear) {
            if (maxMonth == minMonth) {
                return (
                    dayjs()
                        .set("year", minYear)
                        .set("month", minMonth)
                        .set("date", maxDay)
                        .diff(
                            dayjs()
                                .set("year", minYear)
                                .set("month", minMonth)
                                .set("date", minDay),
                            "days"
                        ) + 1
                );
            }
            if (minMonth == pseudoMonth)
                return (
                    dayjs()
                        .set("year", minYear)
                        .set("month", minMonth)
                        .endOf("month")
                        .diff(
                            dayjs()
                                .set("year", minYear)
                                .set("month", minMonth)
                                .set("date", minDay),
                            "days"
                        ) + 1
                );

            return dayjs()
                .set("year", minYear)
                .set("month",pseudoMonth)
                .set("date", maxDay)
                .date();
        }
        if (![minYear, maxYear].includes(pseudoYear!))
            return dayjs()
                .set("year", pseudoYear!)
                .set("month", pseudoMonth!)
                .endOf("month")
                .date();

        if (pseudoYear == minYear) {
            if (pseudoMonth == minMonth) {
                return (
                    dayjs(minDate).endOf("month").diff(dayjs(minDate), "days") +
                    1
                );
            }
            return dayjs()
                .set("year", pseudoYear!)
                .set("month", pseudoMonth!)
                .endOf("month")
                .date();
        }

        if (pseudoMonth == maxMonth) return dayjs(maxDate).date();
        return dayjs()
            .set("year", pseudoYear!)
            .set("month", pseudoMonth!)
            .endOf("month")
            .date();
    }, [pseudoMonth, pseudoYear]);

    const getMaxMonthLength = useCallback(() => {
        if(!pseudoYear) return 12
        if (maxYear == minYear)
            return dayjs(maxDate).diff(dayjs(minDate), "months") + 1;
       
        if (![minYear, maxYear].includes(pseudoYear)) return 12;

        if (pseudoYear == maxYear) return dayjs(maxDate).month() + 1;
        return dayjs(minDate).endOf("year").diff(dayjs(minDate), "months") + 1;
    }, [pseudoYear]);

    const getDaysOffset = () => {
        if(!pseudoYear || pseudoMonth == undefined) return 1
        if (maxYear == minYear) {
            if (maxMonth == minMonth) return dayjs(minDate).date();
            if (!selectedMonth || selectedMonth == minMonth)
                return dayjs(minDate).date();
            return 1;
        }
        if (![maxYear, minYear].includes(pseudoYear)) return 1;
        if (pseudoYear == maxYear) return 1;
        if (pseudoMonth != minMonth) return 1;
        return dayjs(minDate).date();
    };

    const getMonthOffset = () => {
        if (!pseudoYear ) return 0
        if (maxYear == minYear) return dayjs(minDate).month();
        if (![maxYear, minYear].includes(pseudoYear)) return 0;
        if (pseudoYear == maxYear) return 0;
        return dayjs(minDate).month();
    };

    useEffect(() => {
        centerSelectedYear();
    }, [selectedYear]);

    useEffect(() => {
        centerSelectedDay();
    }, [selectedDay]);

    useEffect(() => {
        if (undefined == selectedMonth) return;
        centerSelectedMonth();
        if (!selectedYear || !selectedDay) return;
        handleSelectDay(
            Math.min(
                dayjs()
                    .set("y", selectedYear)
                    .set("month", selectedMonth)
                    .endOf("month")
                    .date(),
                selectedDay
            )
        );
    }, [selectedMonth]);

    useEffect(() => {
        if (showDatePicker) {
            centerSelectedYear(false);
            centerSelectedDay(false);
            centerSelectedMonth(false);
        }
    }, [showDatePicker]);

    

    useEffect(() => {
        pseudoYearHandler();
        pseudoMonthHandler();
        pseudoDayHandler();
    }, []);

    return (
        <>
            <YearSelectionHeader>
                <ColumnTitle className="columnTitle">
                    {t("system.year")}
                </ColumnTitle>

                <YearList ref={yearListRef}>
                    {Array.from(
                        {
                            length: maxYear - minYear + 1,
                        },
                        (_, i) => {
                            const year = minYear + i;
                            const selected = year == selectedYear;

                            return (
                                <span
                                    key={i}
                                    className={`columnItem ${
                                        selected ? "selected" : ""
                                    } ${year == todayYear ? "today" : ""}`}
                                    onClick={() => handleYearSelect(year)}
                                >
                                    {year}
                                </span>
                            );
                        }
                    )}
                </YearList>
            </YearSelectionHeader>
            <DatePickerColumns>
            <Column>
                    <ColumnTitle className="columnTitle">
                        {t("system.month")}
                    </ColumnTitle>
                    <Columnitems ref={monthPickerColumnsRef}>
                        {Array.from(
                            {
                                length: getMaxMonthLength(),
                            },
                            (_, index) => {
                                const offset = getMonthOffset();
                                return (
                                    <ColumnItem
                                        key={index + offset}
                                        className={`columnItem ${
                                            index + offset === selectedMonth
                                                ? "selected"
                                                : ""
                                        } ${
                                            index + offset == todayMonth
                                                ? "today"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleMonthSelect(index + offset)
                                        }
                                    >
                                        {dayjs()
                                            .set("month", index + offset)
                                            .format("MMM")}
                                    </ColumnItem>
                                );
                            }
                        )}
                    </Columnitems>
                </Column>
                <Column>
                    <ColumnTitle className="columnTitle">
                        {t("system.day")}
                    </ColumnTitle>
                    <Columnitems ref={datePickerColumnsRef}>
                        {Array.from(
                            {
                                length: getMaxDateLength(),
                            },
                            (_, index) => {
                                const offset = getDaysOffset();
                                return (
                                    <DayItem>
                                    <span>{dayjs(`${pseudoYear}-${(pseudoMonth ?? 0 )+1}-${index+offset}`).format('ddd')}</span>
                                    <ColumnItem
                                        key={index + offset}
                                        className={`columnItem ${
                                            index + offset === selectedDay
                                                ? "selected"
                                                : ""
                                        } ${
                                            index + offset == todayDay
                                                ? "today"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleDaySelect(index + offset)
                                        }
                                    >
                                        {index + offset}
                                    </ColumnItem>
                                    </DayItem>
                                );
                            }
                        )}
                    </Columnitems>
                </Column>
            </DatePickerColumns>
            <Actions>
                <IonButton color="danger" fill="outline" onClick={reset}>
                    {t("actions.cancel")}
                </IonButton>
                <IonButton
                    color="primary"
                    onClick={confirm}
                    disabled={
                        !selectedDay ||
                        !selectedYear ||
                        selectedMonth == undefined
                    }
                >
                    {t("actions.confirm")}
                </IonButton>
            </Actions>
        </>
    );
};

const YearSelectionHeader = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    font-size: 1.4rem;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 10px;
`;

const YearList = styled.div`
    display: flex;
    gap: 8px;
    max-width: calc(100% - 80px);
    padding: 10px 120px;
    box-sizing: border-box;
    scroll-snap-type: x proximity;
    overflow-x: scroll;
    position: relative;
    > span {
        scroll-snap-align: center;

        font-size: 2.2rem;
        width: 60px;
        &.selected {
        }
    }
`;

const DatePickerColumns = styled.div`
    display: flex;
    gap: 20px;
    flex-direction: column;
    justify-content: space-around;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;


`;

const ColumnTitle = styled.div`
    font-weight: bold;
    font-size: 2.2rem;
    margin-bottom: 8px;
    text-align: center;
`;
const Columnitems = styled.div`
    display: flex;
    
    max-height: 250px;
    overflow-y: scroll;
    scroll-snap-type: y proximity;
    
`;

const ColumnItem = styled.div`
    padding: 5px 10px;
    height: 50px;
    text-transform: capitalize;
    border-radius: 4px;
    scroll-snap-align: center;
    cursor: pointer;

    margin-bottom: 5px;
    font-size: 4rem;
`;

const DayItem = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
`

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`;
