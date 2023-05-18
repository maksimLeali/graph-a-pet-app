import { useEffect, useRef, useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks";
import { I18NKey } from "../../i18n";


import { IconName, Icon} from "../icons";
import { IonIcon } from "@ionic/react";

type props = {
    name: string;
    required?: boolean;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    textColor?: string;
    type?: 'text' | 'password';
    errorText?: string;
    icon?: IconName
    innerRef?: UseFormRegister<any>;
    registerOptions?: RegisterOptions;
    errorColor?: string;
};

export const TextInput: React.FC<props> = ({
    textColor = "dark",
    ntTextLabel,
    textLabel,
    color = "medium",
    required = false,
    registerOptions,
    type = 'text',
    focusColor = "primary",
    disabledColor = "lightGray",
    errorColor = "danger",
    innerRef,
    icon,
    name,
}: props) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [showPsw, setShowPsw] = useState(false)
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
                    type={type == 'password' ? (showPsw ? 'text' : 'password') : type}
                    textColor={textColor}
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
                {/* {type == 'password' || icon ? <IonIcon name="alert-circle-outline" size="large" color="primary"  />: ''} */}
                {type == 'password' ? <Icon name={ showPsw ? "eyeOff" : 'eye'} onClick={()=> setShowPsw(!showPsw) }  color={focused || compiled ? 'var(--ion-color-primary)' : 'var(--ion-color-medium)'}/> : ''}
                {icon ? <Icon name={icon} size="14px" color={focused ? 'var(--ion-color-primary)' : 'var(--ion-color-medium)'}/> : ''}
                <FocusBox
                    color={color}
                    focusColor={focusColor}
                    className={`foxusBox ${focused ? "focused" : ""} ${
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
    border-top-right-radius: 0;
    height: 38px;
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
    bottom:0;
    width: 0;
    left:-1px;
    max-height: 0;
    height:100%;
    
    
    transition: background-color 1s cubic-bezier(1, 0.07, 1, 0.12) 0s,
        width .5s ease-out, max-height .5s ease-out;
    &.focused {
        background-color: var(--ion-color-${({ focusColor }) => focusColor});
        width: 100%;
        max-height: 100%;
        transition: background-color 1s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
            width .5s ease-out, max-height .5s ease-out;
            
            

    }
    &.compiled {
        background-color: var(--ion-color-${({ focusColor }) => focusColor});
        width: 100%;
        max-height:100%;
        
    }
`;

const StyledInput = styled.input<{textColor: string}>`
    outline: none;
    border: none;
    position: relative;
    z-index: 2;
    background-image: none;
    color: var(--ion-color-${({ textColor }) => textColor});
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
