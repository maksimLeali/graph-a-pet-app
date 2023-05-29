import { RegisterOptions, Controller } from "react-hook-form";
import { I18NKey } from "../../i18n";
import { Icon, IconName } from "../";
import styled from "styled-components";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";
import _ from "lodash";
type Option = {
    value: any;
    label: string;
};

type props = {
    name: string;
    required?: boolean;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    hoverColor?: string;
    textColor?: string;
    errorText?: string;
    icon?: IconName;
    control: any;
    registerOptions?: RegisterOptions;
    errorColor?: string;
    options: Option[];
};

export const SelectInput: React.FC<props> = ({
    name,
    required,
    textLabel,
    ntTextLabel,
    color = "medium",
    hoverColor = "light-tint",
    focusColor = "primary",
    disabledColor = "medium",
    textColor = "dark",
    errorText = "danger",

    control,
    registerOptions,
    errorColor,
    options,
}) => {
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const [showOption, setShowOption] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });

    return (
        <Wrapper
            focusColor={focusColor}
            hoverColor={hoverColor}
            txtColor={textColor}
            bgColor={color}
            disabledColor={disabledColor}
        >
            <InputLabel
                className={`inputLabel ${focused ? "focused" : ""} ${
                    compiled ? "compiled" : ""
                }`}
                htmlFor={name}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
            </InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                    <InputWrapper
                        ref={ref}
                        className="inputWrapper "
                        onClick={() => setFocused(true)}
                    >
                        <InvisibleInput
                            id={name}
                            onFocus={() => setFocused(true)}
                        />
                        <LabelContainer>
                            {value ? (
                                <p>
                                    {
                                        _.find(
                                            options,
                                            (opt) => opt.value === value
                                        )?.label
                                    }
                                </p>
                            ) : (
                                <></>
                            )}
                        </LabelContainer>
                        <IconContainer>
                            <Icon
                                size="30px"
                                time=".5s"
                                className={`selectIcon ${
                                    focused ? "focused" : ""
                                } ${compiled ? "compiled" : ""}`}
                                name="caretDownCircleOutline"
                            />
                        </IconContainer>
                        <OptionsContainer
                            className={`options-container ${
                                focused ? "focused" : ""
                            } ${compiled ? "compiled" : ""}`}
                            ref={selectRef}
                        >
                            {_.map(options, (option) => {
                                return (
                                    <Option className="option">
                                        <span>{option.label}</span>
                                    </Option>
                                );
                            })}
                        </OptionsContainer>
                        <FocusBox
                            className={`focusBox ${focused ? "focused" : ""} ${
                                compiled ? "compiled" : ""
                            }`}
                        />
                    </InputWrapper>
                )}
            />
        </Wrapper>
    );
};

type selectProps = {
    bgColor: string;
    disabledColor: string;
    txtColor: string;
    focusColor: string;
    hoverColor: string;
};

const InvisibleInput = styled.input`
    height: 0;
    width: 0;
    position: absolute;
    opacity: 0;
`;

const Wrapper = styled.div<selectProps>`
    width: 100%;
    position: relative;
    height: 40px;

    .inputWrapper {
        background-color: var(--ion-color-${({ bgColor }) => bgColor});
    }
    .selectIcon {
        > * {
            color: var(--ion-color-${({ bgColor }) => bgColor}) !important ;
        }
        &.focused {
            > * {
                color: var(
                    --ion-color-${({ focusColor }) => focusColor}
                ) !important;
            }
        }
        &.compiled {
            > * {
                color: var(
                    --ion-color-${({ focusColor }) => focusColor}
                ) !important;
            }
        }
    }
    .inputLabel {
        color: var(--ion-color-${({ bgColor }) => bgColor});
        &.focused {
            color: var(--ion-color-${({ focusColor }) => focusColor});
        }
        &.compiled {
            color: var(--ion-color-${({ focusColor }) => focusColor});
        }
    }
    .focusBox {
        &.focused {
            background-color: var(
                --ion-color-${({ focusColor }) => focusColor}
            );
        }
        &.compiled {
            background-color: var(
                --ion-color-${({ focusColor }) => focusColor}
            );
        }
    }
    .options-container {
        background-color: var(--ion-background-color);
        border-color: var(--ion-color-${({ bgColor }) => bgColor});
    }
    .option {
        color: var(--ion-color-${({ txtColor }) => txtColor});
        border-color: var(--ion-color-${({ bgColor }) => bgColor});
        &:hover {
            border-color: var(--ion-color-${({ focusColor }) => focusColor});
            background-color: var(
                --ion-color-${({ hoverColor }) => hoverColor}
            );
        }
    }
`;

const InputLabel = styled.label`
    z-index: 3;
    position: absolute;
    left: 20px;
    top: 2px;
    font-size: 1.3rem;
    color: var(--ion-color-${({ color }) => color});
    transition: top 0.5s ease-in, left 0.5s ease-in, color 0.5s ease-in,
        font-size 0.5s ease-in;
    &.focused {
        font-size: 0.8rem;
        top: -25px;
        left: 0px;
    }
    &.compiled {
        font-size: 0.8rem;
        top: -25px;
        left: 0px;
    }
`;

const InputWrapper = styled.div`
    width: 100%;
    height: 40px;
    padding-bottom: 2px;
    padding-left: 2px;
    box-sizing: border-box;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
`;

const LabelContainer = styled.div`
    height: 100%;
    position: relative;
    z-index: 2;
    width: calc(100% - 40px);
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color);
    }
`;

const IconContainer = styled.div`
    width: 38px;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color);
    }
    .selectIcon {
        &.focused {
            > * {
                transform: rotate(-180deg);
            }
        }
    }
`;

const FocusBox = styled.span`
    background-color: var(--ion-color-medium);
    position: absolute;
    display: block;
    z-index: 1;
    left: 0;

    bottom: 0;
    width: 0;
    max-height: 0;
    height: 100%;

    transition: background-color 1s cubic-bezier(1, 0.07, 1, 0.12) 0s,
        width 0.5s ease-out, max-height 0.5s ease-out;
    &.focused {
        width: 100%;
        max-height: 100%;
        transition: background-color 1s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
            width 0.5s ease-out, max-height 0.5s ease-out;
    }
    &.compiled {
        width: 100%;
        max-height: 100%;
    }
`;

const OptionsContainer = styled.div`
    width: calc(100% - 40px);
    position: absolute;
    z-index: 4;
    top: 100%;
    left: 0;
    overflow-y: hidden;
    border-left: 1px solid;
    opacity: 0;
    max-height: 0;
    transition: max-height 1s ease-in-out, opacity 0.5s ease-in-out;
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color);
    }
    &.focused {
        opacity: 1;
        max-height: 200px;
    }
`;

const Option = styled.div`
    width: 100%;
    height: 35px;
    border-bottom: 1px solid;
    padding: 5px 12px;
    box-sizing: border-box;
    position: relative;
    &:hover {
        border-left: 1px solid;
    }
`;
