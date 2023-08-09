import { useCallback, useEffect, useRef, useState } from "react";
import {
    RegisterOptions,
    useFormContext,
    UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks";
import { I18NKey } from "../../i18n";

import { IconName, Icon } from "../icons";
import dayjs from "dayjs";

type props = {
    name: string;
    required?: boolean;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    minDate?: string;
    maxDate?: string;
    textColor?: string;
    // type?: "date" | "dateTime" | "time";
    errorText?: string;
    icon?: IconName;
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
    // type = "date",
    focusColor = "primary",
    disabledColor = "lightGray",
    errorColor = "danger",
    minDate,
    maxDate,
    bgColor,
    icon,
    name,
}: props) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error, setError] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [showPsw, setShowPsw] = useState(false);
    const {
        register,
        formState: { errors, isSubmitting },
        getValues,
    } = useFormContext();

    useEffect(() => {
        setError(errors[name] != undefined);
    }, [errors[name]]);

    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });
    const formattedDate = dayjs().format("LLLL");

    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
    const [selectedDay, setSelectedDay] = useState(dayjs().date());

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
    };

    const handleMonthSelect = (month: number) => {
        setSelectedMonth(month);
    };
    const handleDaySelect = (month: number) => {
        setSelectedDay(month);
    };

    
 

    const yearListRef = useRef<HTMLDivElement | null>(null);
    const centerSelectedYear =useCallback( (smooth=true) => {
      console.log('*****', selectedYear)
      if(!showDatePicker) return
      console.log('ok')
      if(! yearListRef.current ) {
        setTimeout(()=> {
          centerSelectedYear()
        }, 100)
        return
      }
          const selectedYearElement = yearListRef.current.querySelector('.selected') as HTMLSpanElement | null;
          if (selectedYearElement) {
              const containerWidth = yearListRef.current.offsetWidth;
              const selectedYearOffsetLeft = selectedYearElement.offsetLeft;
              const selectedYearWidth = selectedYearElement.offsetWidth;

              // Calculate the scroll position to center the selected year
              const scrollPosition =
                  selectedYearOffsetLeft - (containerWidth - selectedYearWidth) / 2;
                  console.log('scrollPosition',scrollPosition)
              yearListRef.current.scrollTo({
                  left: scrollPosition,
                  behavior: smooth ? 'smooth' : 'instant',
              });
          }
      
      
  }, [selectedDay, yearListRef, showDatePicker])
    useEffect(() => {
        centerSelectedYear()
    }, [selectedYear]);

    useEffect(()=> {
      setSelectedYear(dayjs(getValues(name) && getValues(name).length>0 ? getValues(name) : new Date()).year())
    },[])

    useEffect(()=> {
      if(showDatePicker){
        centerSelectedYear(false)
      }
    }, [showDatePicker])

    return (
        <Wrapper className={`${isSubmitting ? "submitting" : ""}`}>
            <InputLabel
                color={color}
                focusColor={focusColor}
                htmlFor={name}
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
                        console.log("test");
                        setFocused(true);
                        setShowDatePicker(true); // Show DatePicker on focus
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        console.log("test");
                        setFocused(true);
                        setShowDatePicker(true); // Show DatePicker on click
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
                />
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
                <DatePickerContainer>
                    <DatePickerHeader>{formattedDate}</DatePickerHeader>
                    <YearSelectionHeader>
                        <Icon name="arrowBack" color="dark" />
                          <YearList ref={yearListRef}>
                              
                                  { Array.from({length: 50},  ((_, i)=> {
                                    const year = dayjs().add(i-39,'years').year()
                                    const selected = year == selectedYear
                                    return <span key={i} className={selected ? 'selected' : ''} onClick={()=>handleYearSelect(year)} > 
                                      {year}
                                  </span>
                                  }))}
                              
                          </YearList>
                        <Icon name="arrowForward" color="dark" />
                    </YearSelectionHeader>
                   
                </DatePickerContainer>
            )}
        </Wrapper>
    );
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

const Wrapper = styled.div`
    width: 100%;
    position: relative;
    margin-bottom: 40px;
    &.submitting {
        opacity: 0.5;
        pointer-events: none;
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

const StyledInput = styled.input<{ textColor: string; bgColor?: string }>`
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
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    color: #000;
    border: 1px solid lightgray;
    z-index: 3;
    padding: 10px;
`;

const DatePickerHeader = styled.div`
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 10px;
    cursor: pointer;
`;

const YearSelectionHeader = styled.div`
    display: flex;
    align-items: center;
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
    padding: 10px 40px;
    scroll-snap-type: x proximity;
    overflow-x: scroll;
    > span {
        color: #000;
        opacity: .5;
        &.selected {
          opacity: 1;
        }
      }
`;

const YearItem = styled.div<{ selected: boolean }>`
    padding: 5px 10px;
    border: 1px solid lightgray;
    border-radius: 4px;
    cursor: pointer;
    background-color: ${({ selected }) => (selected ? "lightgray" : "white")};
`;

const DatePickerColumns = styled.div`
    display: flex;
    gap: 20px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const ColumnTitle = styled.div`
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 8px;
`;

const ColumnItem = styled.div<{ selected: boolean }>`
    padding: 5px 10px;
    border: 1px solid lightgray;
    border-radius: 4px;
    cursor: pointer;
    background-color: ${({ selected }) => (selected ? "lightgray" : "white")};
    margin-bottom: 5px;
`;

 {/* <DatePickerColumns>
                        <Column>
                            <ColumnTitle>Days</ColumnTitle>
                            {Array.from({ length: 31 }, (_, index) => (
                                <ColumnItem
                                    key={index + 1}
                                    selected={index + 1 === dayjs(selectedDay).date()}
                                    onClick={() => handleDaySelect(index + 1)}
                                >
                                    {index + 1}
                                </ColumnItem>
                            ))}
                        </Column>
                        <Column>
                            <ColumnTitle>Months</ColumnTitle>
                            {Array.from({ length: 12 }, (_, index) => (
                                <ColumnItem
                                    key={index + 1}
                                    selected={index + 1 === selectedMonth}
                                    onClick={() => handleMonthSelect(index + 1)}
                                >
                                    {dayjs().month(index).format("MMMM")}
                                </ColumnItem>
                            ))}
                        </Column>
                    </DatePickerColumns> */}