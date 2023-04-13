import { useEffect, useRef, useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks";
import { I18NKey } from "../../i18n";

type props = {
    name: string;
    required?: boolean;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    textColor?: string;
    errorText?: string;
    innerRef?: UseFormRegister<any>;
    registerOptions?: RegisterOptions;
    errorColor?: string;
};

export const TextInput: React.FC<props> = ({
    textColor = "primary",
    ntTextLabel,
    textLabel,
    color = "medium",
    required = false,
    registerOptions,
    focusColor = "primary",
    disabledColor = "lightGray",
    errorColor = "danger",
    innerRef,
    name,
}: props) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });

    return (
        <Wrapper>
            <InputLabel
                color={color}
                focusColor={focusColor}
                htmlFor={name}
                className={`${focused ? "focused" : ""} ${
                    compiled ? "compiled" : ""
                }`}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
            </InputLabel>
            <InputWrapper ref={ref} color={color}>
                <StyledInput
                    id={name}
                    onFocus={() => setFocused(true)}
                    type="text"
                    {...(innerRef
                        ? innerRef(name, {
                              onChange: (v) => {
                                  setCompiled(v.target.value.length > 0);
                              },
                              required,
                              ...registerOptions,
                          })
                        : null)}
                />
                <FocusCircle
                    color={color}
                    focusColor={focusColor}
                    className={`${focused ? "focused" : ""} ${
                        compiled ? "compiled" : ""
                    }`}
                />
            </InputWrapper>
            
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
`;

const InputLabel = styled.label<labelProps>`
    z-index: 2;
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
        color: var(--ion-color-${({ focusColor }) => focusColor});
    }
    &.compiled {
        font-size: 0.8rem;
        top: -25px;
        left: 0px;
        color: var(--ion-color-${({ focusColor }) => focusColor});
    }
`;

const InputWrapper = styled.div<wrapperProps>`
    background-color: var(--ion-color-${({ color }) => color});
    position: relative;
    padding: 0 0 2px 2px;
    border-radius: 2px;
    height: 38px;
    overflow: hidden;
    z-index: 1;
`;

const FocusCircle = styled.span<focusCircleProps>`
    background-color: var(--ion-color-medium);
    position: absolute;
    display: block;
    z-index: 1;
    width: 0;
    left: -50%;
    top: -50vw;
    border-radius: 9999px;
    aspect-ratio: 1 / 1;
    transition: background-color 2s cubic-bezier(1, 0.07, 1, 0.12) 0s,
        width 1s ease-out;
    &.focused {
        background-color: var(--ion-color-${({ focusColor }) => focusColor});
        width: 200%;
        transition: background-color 2s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
            width 1s ease-out;
    }
    &.compiled {
        background-color: var(--ion-color-${({ focusColor }) => focusColor});
        width: 200%;
    }
`;

const StyledInput = styled.input`
    outline: none;
    border: none;
    position: relative;
    z-index: 2;
    background-image: none;
    
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    font-size: 1.2rem;
    box-shadow: none;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-left: 20px;
    padding-bottom: 10px;
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color)
    }
`;
