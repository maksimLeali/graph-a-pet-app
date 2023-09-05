import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useOnClickOutside } from "../../../hooks";
import { I18NKey } from "../../../i18n";

import { IconName, Icon } from "../../icons";
import dayjs from "dayjs";
import { IonButton } from "@ionic/react";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";

type props = {
    name: string;
    required?: boolean;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    pkBgColor?: string;
    pkSelectedColor?: string;
    pkTxtColor?: string;
    pkLabelColor?: string;
    minDate?: string;
    maxDate?: string;
    textColor?: string;
    type?: "date" | "dateTime" | "time";
    errorText?: string;
    icon?: IconName;
    maxHour?: number;
    minHour?: number;
    maxMinute?: number;
    minMinute?: number;
    registerOptions?: RegisterOptions;
    errorColor?: string;
    bgColor?: string;
};

export const DateTimePicker: React.FC<props> = ({
    textColor = "dark",
    ntTextLabel,
    textLabel,
    color = "medium",
    required = false,
    registerOptions,
    type = "date",
    focusColor = "primary",
    disabledColor = "lightGray",
    errorColor = "danger",
    pkTxtColor = "medium",
    pkSelectedColor = "primary",
    pkBgColor = "light-tint",
    pkLabelColor = "dark",
    minDate = dayjs().subtract(30, "y").startOf("y").toISOString(),
    // minDate = "2021-08-05T04:30:00.00Z",
    maxDate = dayjs().add(5, "y").endOf("year").toISOString(),
    // maxDate = "2021-08-11T22:39:00.00Z",
    minHour,
    minMinute,
    maxHour,
    maxMinute,
    bgColor,
    icon,
    name,
}: props) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [error, setError] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const timePickerRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<number | undefined>();
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
    const [selectedDay, setSelectedDay] = useState<number | undefined>();
    const [selectedMinute, setSelectedMinute] = useState<number | undefined>();
    const [selectedHour, setSelectedHour] = useState<number | undefined>();
    const {
        register,
        formState: { errors, isSubmitting },
        getValues,
        setValue,
    } = useFormContext();

    const selectedDate = useMemo(() => {
        if (
            type == "date" ||
            (type == "dateTime" &&
                (!selectedDay || selectedMonth == undefined || !selectedYear))
        )
            return;
        if (
            type == "time" ||
            (type == "dateTime" &&
                (selectedHour == undefined || selectedMinute == undefined))
        )
            return;
        return dayjs()
            .set("y", selectedYear ?? 1999)
            .set("month", selectedMonth ?? 0)
            .set("date", selectedDay ?? 1)
            .set("hour", selectedHour ?? 0)
            .set("minute", selectedMinute ?? 0)
            .set('seconds', 0);
    }, [
        selectedDay,
        selectedMonth,
        selectedYear,
        selectedHour,
        selectedMinute,
    ]);

    useEffect(() => {
        setError(errors[name] != undefined);
    }, [errors[name]]);

    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });

    useOnClickOutside(datePickerRef, () => {
        if (showDatePicker) {
            reset();
        }
    });
    useOnClickOutside(timePickerRef, () => {
        if (showTimePicker) {
            reset();
        }
    });

    const reset = () => {
        const value = getValues(name);
        if (value) {
            setSelectedYear(dayjs(value).year());
            setSelectedMonth(dayjs(value).month());
            setSelectedDay(dayjs(value).date());
            setSelectedHour(dayjs(value).hour());
            setSelectedMinute(dayjs(value).minute());
        } else {
            setSelectedDay(undefined);
            setSelectedMonth(undefined);
            setSelectedYear(undefined);
            setSelectedHour(undefined);
            setSelectedMinute(undefined);
        }
        if (type == "dateTime") {
            if (showTimePicker) {
                setShowDatePicker(true);
                setShowTimePicker(false);
            } else {
                setShowDatePicker(false);
            }
        } else {
            setShowTimePicker(false);
            setShowDatePicker(false);
        }
    };

    const confirmDate = () => {
        if (!selectedDay || selectedMonth == undefined || !selectedYear) return;
        setShowDatePicker(false);
        if (type == "date") {
            setValue(name, selectedDate!.toDate());
            setCompiled(true);
            return;
        }
        setShowTimePicker(true);
    };
    const confirmTime = () => {
        if (selectedHour == undefined || selectedMinute == undefined) return;
        setValue(
            name,
            type == "time"
                ? dayjs()
                      .set("hour", selectedHour!)
                      .set("minute", selectedMinute)
                      .toDate()
                : selectedDate!.toDate()
        );

        setCompiled(true);
        setShowTimePicker(false);
    };

    useEffect(() => {
        const value = getValues(name);
        if (!value) return;
        setSelectedYear(dayjs(value).year());
        setSelectedMonth(dayjs(value).month());
        setSelectedDay(dayjs(value).date());
        setSelectedHour(dayjs(value).hour());
        setSelectedMinute(dayjs(value).minute());
    }, []);

    return (
        <Wrapper
            className={`${isSubmitting ? "submitting" : ""}`}
            pkBgColor={pkBgColor}
            pkTxtColor={pkTxtColor}
            pkSelectedColor={pkSelectedColor}
            pkLabelColor={pkLabelColor}
        >
            <InputLabel
                color={color}
                focusColor={focusColor}
                htmlFor={name}
                onFocus={(e) => {
                    e.preventDefault();
                    setFocused(true);
                    setShowDatePicker(true); // Show DatePicker on focus
                }}
                onClick={(e) => {
                    e.preventDefault();
                    setFocused(true);
                    setShowDatePicker(true); // Show DatePicker on click
                }}
                className={`${focused || showDatePicker ? "focused" : ""} ${
                    compiled ? "compiled" : ""
                } ${error ? "error" : ""}`}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
                {required && !compiled && " *"}
            </InputLabel>
            <InputWrapper ref={ref} color={color}>
                <StyledInput
                    id={name}
                    onFocus={(e) => {
                        e.preventDefault();
                        setFocused(true);
                        if (type != "time") {
                            setShowDatePicker(true); // Show DatePicker on focus
                        } else {
                            setShowTimePicker(true); // Show DatePicker on focus
                        }
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        setFocused(true);
                        if (type != "time") {
                            setShowDatePicker(true); // Show DatePicker on focus
                        } else {
                            setShowTimePicker(true); // Show DatePicker on focus
                        } // Show DatePicker on click
                    }}
                    min={minDate}
                    max={maxDate}
                    // type={type == "dateTime" ? "datetime-local" : type}
                    textColor={textColor}
                    bgColor={bgColor}
                    {...register(name, {
                        onChange: (v) => {
                            setCompiled(v.target.value.length > 0);
                        },
                        required: {
                            value: required,
                            message: "messages.errors.required",
                        },
                        ...registerOptions,
                    })}
                >
                    <span>
                        {getValues(name)
                            ? type == "date"
                                ? dayjs(getValues(name)).format("ll")
                                : type == "time"
                                ? dayjs(getValues(name)).format("HH:mm")
                                : dayjs(getValues(name)).format("ll, HH:mm")
                            : null}
                    </span>
                </StyledInput>
                {icon ? (
                    <Icon
                        name={icon}
                        size="14px"
                        color={
                            error
                                ? "danger"
                                : focused || compiled
                                ? "primary"
                                : "medium"
                        }
                    />
                ) : (
                    ""
                )}
                <FocusBox
                    color={color}
                    focusColor={focusColor}
                    className={`foxusBox ${
                        focused || showDatePicker ? "focused" : ""
                    } ${compiled ? "compiled" : ""} ${error ? "error" : ""}`}
                />
            </InputWrapper>
            {errors[name]?.message ? (
                <ErrorSpan>{t(errors[name]?.message as I18NKey)}</ErrorSpan>
            ) : (
                <></>
            )}
            {/* Hidden DatePicker */}
            {showDatePicker && (
                <DatePickerContainer className="picker" ref={datePickerRef}>
                    <DatePicker
                        minDate={minDate}
                        maxDate={maxDate}
                        selectedDay={selectedDay}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        handleSelectDay={setSelectedDay}
                        handleSelectMonth={setSelectedMonth}
                        handleSelectYear={setSelectedYear}
                        showDatePicker={showDatePicker}
                        reset={reset}
                        confirm={confirmDate}
                    />
                </DatePickerContainer>
            )}
            {showTimePicker && (
                <DatePickerContainer className="picker" ref={timePickerRef}>
                    <TimePicker
                        selectedHour={selectedHour}
                        selectedMinute={selectedMinute}
                        showTimePicker={showTimePicker}
                        handleSelectHour={(v) => {
                            setSelectedHour(v);
                        }}
                        handleSelectMinute={(v) => {
                            setSelectedMinute(v);
                        }}
                        reset={reset}
                        confirm={confirmTime}
                        maxHour={
                            maxHour
                                ? maxHour
                                : dayjs(maxDate).isSame(selectedDate)
                                ? dayjs(maxDate).get("hour")
                                : 23
                        }
                        maxMinute={
                            maxMinute
                                ? maxMinute
                                : dayjs(maxDate).isSame(selectedDate)
                                ? dayjs(maxDate).get("minute")
                                : 59
                        }
                        minHour={
                            minHour
                                ? minHour
                                : dayjs(minDate).isSame(selectedDate)
                                ? dayjs(minDate).get("hour")
                                : 0
                        }
                        minMinute={
                            minMinute
                                ? minMinute
                                : dayjs(minDate).isSame(selectedDate)
                                ? dayjs(minDate).get("minute")
                                : 0
                        }
                    />
                </DatePickerContainer>
            )}
        </Wrapper>
    );
};

type mainWrapperColors = {
    pkTxtColor: string;
    pkBgColor: string;
    pkSelectedColor: string;
    pkLabelColor: string;
};

type wrapperProps = {
    color: string;
};

type focusCircleProps = {
    color: string;
    focusColor: string;
};
type labelProps = {
    color: string;
    focusColor: string;
};

const Wrapper = styled.div<mainWrapperColors>`
    width: 100%;
    position: relative;
    margin-bottom: 40px;
    &.submitting {
        opacity: 0.5;
        pointer-events: none;
    }
    .picker {
        background-color: var(--ion-color-${({ pkBgColor }) => pkBgColor});
        color: var(--ion-color-${({ pkTxtColor }) => pkTxtColor});
        .columnTitle {
            color: var(--ion-color-${({ pkLabelColor }) => pkLabelColor});
        }
        .columnItem {
            opacity: 0.8;
            color: var(--ion-color-${({ pkTxtColor }) => pkTxtColor});
            &.selected {
                opacity: 1;
                color: var(
                    --ion-color-${({ pkSelectedColor }) => pkSelectedColor}
                );
            }
        }
    }
`;

const InputLabel = styled.label<labelProps>`
    z-index: 2;
    position: absolute;
    left: 20px;
    top: 2px;
    font-size: 2rem;
    color: var(--ion-color-${({ color }) => color});
    transition: top 0.5s ease-in, left 0.5s ease-in, color 0.5s ease-in,
        font-size 0.5s ease-in;
    &.focused {
        font-size: 1.8rem;
        top: -25px;
        left: 0px;
        color: var(--ion-color-${({ focusColor }) => focusColor});
    }
    &.compiled {
        font-size: 1.8rem;
        top: -25px;
        left: 0px;
        color: var(--ion-color-${({ focusColor }) => focusColor});
    }
    &.error {
        color: var(--ion-color-danger);
    }
`;

const InputWrapper = styled.div<wrapperProps>`
    background-color: var(--ion-color-${({ color }) => color});
    position: relative;
    padding: 0 0 2px 2px;
    border-radius: 2px;
    border-top-right-radius: 0;
    height: 38px;
    margin-bottom: 12px;
    overflow: hidden;
    z-index: 1;
    > .icon-wrapper {
        position: absolute;
        z-index: 2;
        top: -4px;
        right: 0;
    }
`;

const FocusBox = styled.span<focusCircleProps>`
    background-color: var(--ion-color-medium);
    position: absolute;
    display: block;
    z-index: 1;
    bottom: 0;
    width: 0;
    left: -1px;
    max-height: 0;
    height: 100%;

    transition: background-color 1s cubic-bezier(1, 0.07, 1, 0.12) 0s,
        width 0.5s ease-out, max-height 0.5s ease-out;
    &.focused {
        background-color: var(--ion-color-${({ focusColor }) => focusColor});
        width: 100%;
        max-height: 100%;
        transition: background-color 1s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
            width 0.5s ease-out, max-height 0.5s ease-out;
    }
    &.compiled {
        background-color: var(--ion-color-${({ focusColor }) => focusColor});
        width: 100%;
        max-height: 100%;
    }
    &.error {
        background-color: var(--ion-color-danger);
    }
`;

const StyledInput = styled.div<{ textColor: string; bgColor?: string }>`
    outline: none;
    border: none;
    position: relative;
    z-index: 2;
    background-image: none;
    color: var(--ion-color-${({ textColor }) => textColor});
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    font-size: 1.6rem;
    box-shadow: none;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-left: 20px;
    padding-bottom: 10px;
    background-color: ${({ bgColor }) =>
        bgColor
            ? `var(--ion-color-${bgColor})`
            : "var(--ion-background-color)"};

    &:-webkit-autofill,
    .dark &:-webkit-autofill,
    &:-webkit-autofill:hover,
    .dark &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    .dark &:-webkit-autofill:focus,
    &:-webkit-autofill:active .dark &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
        color: var(--ion-color-${({ textColor }) => textColor});
        -webkit-text-fill-color: var(
            --ion-color-${({ textColor }) => textColor}
        );
    }
`;

const ErrorSpan = styled.span`
    color: var(--ion-color-danger);
    font-size: 1.6rem;
`;

const DatePickerContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: calc(
        var(--max-width) - 40px
    ); /* Adjust the maximum width as needed */
    background-color: white;
    color: #000;
    border: 1px solid lightgray;
    z-index: 10;
    padding: 20px 10px 10px 10px;
`;
