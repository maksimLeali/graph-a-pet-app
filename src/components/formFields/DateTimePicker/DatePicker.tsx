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

    const [phantomDay, setPhantomDay] = useState<number>();
    const [phantomMonth, setPhantomMonth] = useState<number>();
    const [phantomYear, setPhantomYear] = useState<number>();

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
                const containerHeight =
                    datePickerColumnsRef.current.offsetHeight;
                const selectedDayOffsetTop = selectedDayElement.offsetTop;

                // Calculate the scroll position to center the selected day
                const scrollPosition = selectedDayOffsetTop - containerHeight;
                datePickerColumnsRef.current?.scrollTo({
                    top: scrollPosition,
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
                const containerHeight =
                    monthPickerColumnsRef.current.offsetHeight;
                const selectedDayOffsetTop = selectedMonthElement.offsetTop;

                // Calculate the scroll position to center the selected day
                const scrollPosition = selectedDayOffsetTop - containerHeight;
                monthPickerColumnsRef.current.scrollTo({
                    top: scrollPosition,
                    behavior: smooth ? "smooth" : undefined,
                });
            }
        },
        [selectedMonth, monthPickerColumnsRef, showDatePicker]
    );

    const phantomYearHandler = (year?: number) => {
        if (year) return setPhantomYear(year);
        if (minYear < todayYear && maxYear > todayYear) {
            return setPhantomYear(todayYear);
        }
        return setPhantomYear(minYear);
    };
    const phantomMonthHandler = (month?: number) => {
        if (month != undefined) return setPhantomMonth(month);
        if (![minYear, maxYear].includes(phantomYear!)) {
            return setPhantomMonth(todayMonth);
        }
        if (phantomYear == minYear) {
            if (minMonth > todayMonth) return setPhantomMonth(minMonth);
            return setPhantomMonth(todayMonth);
        }
        if (maxMonth < todayMonth) return setPhantomMonth(maxMonth);
        return setPhantomMonth(todayMonth);
    };

    const phantomDayHandler = (day?: number) => {
        if (day) return setPhantomDay(day);
        if (![minYear, maxYear].includes(phantomYear!)) {
            return setPhantomDay(todayDay);
        }
        if (minYear == phantomYear) {
            if (minMonth < phantomMonth!) return setPhantomDay(todayDay);
            if (todayDay < minDay) return setPhantomDay(minDay);
            return setPhantomDay(todayDay);
        }
        if (maxMonth > phantomMonth!) return setPhantomDay(todayDay);
        if (todayDay > maxDay) return setPhantomDay(maxDay);
        return setPhantomDay(todayDay);
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
        phantomYearHandler(year);
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
        phantomMonthHandler(month);
    };
    const handleDaySelect = (date: number | undefined) => {
        if (date) setPhantomDay(date);
        handleSelectDay(date);
    };

    const getMaxDateLength = useCallback(() => {
        if (!phantomYear || phantomMonth == undefined) return 30;
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
            if (minMonth == phantomMonth)
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
                .set("month",phantomMonth)
                .set("date", maxDay)
                .date();
        }
        if (![minYear, maxYear].includes(phantomYear!))
            return dayjs()
                .set("year", phantomYear!)
                .set("month", phantomMonth!)
                .endOf("month")
                .date();

        if (phantomYear == minYear) {
            if (phantomMonth == minMonth) {
                return (
                    dayjs(minDate).endOf("month").diff(dayjs(minDate), "days") +
                    1
                );
            }
            return dayjs()
                .set("year", phantomYear!)
                .set("month", phantomMonth!)
                .endOf("month")
                .date();
        }

        if (phantomMonth == maxMonth) return dayjs(maxDate).date();
        return dayjs()
            .set("year", phantomYear!)
            .set("month", phantomMonth!)
            .endOf("month")
            .date();
    }, [phantomMonth, phantomYear]);

    const getMaxMonthLength = useCallback(() => {
        if(!phantomYear) return 12
        if (maxYear == minYear)
            return dayjs(maxDate).diff(dayjs(minDate), "months") + 1;
       
        if (![minYear, maxYear].includes(phantomYear)) return 12;

        if (phantomYear == maxYear) return dayjs(maxDate).month() + 1;
        return dayjs(minDate).endOf("year").diff(dayjs(minDate), "months") + 1;
    }, [phantomYear]);

    const getDaysOffset = () => {
        if(!phantomYear || phantomMonth == undefined) return 1
        if (maxYear == minYear) {
            if (maxMonth == minMonth) return dayjs(minDate).date();
            if (!selectedMonth || selectedMonth == minMonth)
                return dayjs(minDate).date();
            return 1;
        }
        if (![maxYear, minYear].includes(phantomYear)) return 1;
        if (phantomYear == maxYear) return 1;
        if (phantomMonth != minMonth) return 1;
        return dayjs(minDate).date();
    };

    const getMonthOffset = () => {
        if (!phantomYear ) return 0
        if (maxYear == minYear) return dayjs(minDate).month();
        if (![maxYear, minYear].includes(phantomYear)) return 0;
        if (phantomYear == maxYear) return 0;
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
        console.log("min", minDate, minYear);
        console.log("max", maxDate, maxYear);
        phantomYearHandler();
        phantomMonthHandler();
        phantomDayHandler();
    }, []);

    useEffect(() => {
        console.log("phantom year = ", phantomYear);
    }, [phantomYear]);

    useEffect(() => {
        console.log("phantom month = ", phantomMonth);
    }, [phantomMonth]);

    useEffect(() => {
        console.log("phantom day = ", phantomDay);
    }, [phantomDay]);

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
                            console.log(dayjs().diff(minDate, "y"));
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
                                );
                            }
                        )}
                    </Columnitems>
                </Column>
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
                    {t("actions.confirm")}{" "}
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
`;
const Columnitems = styled.div`
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

    margin-bottom: 5px;
    font-size: 4rem;
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`;
