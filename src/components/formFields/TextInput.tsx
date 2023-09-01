import { useEffect, useRef, useState } from "react";
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
  type?: "text" | "password" ;
  inputMode?: "text" | "email" ;
  errorText?: string;
  pattern?: RegExp;
  icon?: IconName;
  registerOptions?: RegisterOptions;
  errorColor?: string;
  bgColor?:string
};

export const TextInput: React.FC<props> = ({
  textColor = "dark",
  ntTextLabel,
  textLabel,
  color = "medium",
  required = false,
  registerOptions,
  type = "text",
  inputMode = "text",
  focusColor = "primary",
  disabledColor = "lightGray",
  errorColor = "danger",
  bgColor,
  icon,
  name,
}: props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [showPsw, setShowPsw] = useState(false);
  const {
    register,
    formState: { errors , isSubmitting},
  } = useFormContext();

  const setFocus=()=>{
    if(!ref.current)return
    (ref.current.children[0] as any).focus()
  }

  useEffect(() => {
    setError(errors[name] != undefined);
  }, [errors[name]]);

  useOnClickOutside(ref, () => {
    setFocused(false);
    const hide = ref.current?.children[0];
    if (!hide) return;
    hide.classList.remove("hide");
  });
  return (
    <Wrapper className={`${isSubmitting ? 'submitting' : '' }`} >
      <InputLabel
        color={color}
        focusColor={focusColor}
        htmlFor={name}
        onClick={()=>setFocus()}
        className={`${focused ? "focused" : ""} ${compiled ? "compiled" : ""} ${
          error ? "error" : ""
        }`}
      >
        {textLabel ? t(textLabel) : ntTextLabel}
        {required && !compiled && ' *'}
      </InputLabel>
      <InputWrapper ref={ref} color={color}>
        <StyledInput
          id={name}
          
          onFocus={() => setFocused(true)}
          inputMode={inputMode}
          type={type == "password" ? (showPsw ? "text" : "password") : type}
          textColor={textColor}
          bgColor={bgColor}
          {...register(name, {
            onChange: (v) => {
              setCompiled(v.target.value.length > 0);
            },
            required : { value: required , message: 'messages.errors.required'},
            ...registerOptions,
          })}
        />
        {/* {type == 'password' || icon ? <IonIcon name="alert-circle-outline" size="large" color="primary"  />: ''} */}
        {type == "password" ? (
          <Icon
            name={showPsw ? "eyeOff" : "eye"}
            onClick={() => setShowPsw(!showPsw)}
            color={
              error ? 'danger' :
              focused || compiled ? "primary" : "medium"
            }
          />
        ) : (
          ""
        )}
        {icon ? (
          <Icon
            name={icon}
            size="14px"
            color={
              error ? 'danger' :
              focused || compiled ? "primary" : "medium"
            }
          />
        ) : (
          ""
        )}
        <FocusBox
          color={color}
          focusColor={focusColor}
          className={`foxusBox ${focused ? "focused" : ""} ${
            compiled ? "compiled" : ""
          } ${error ? "error" : ""}`}
        /> 
      </InputWrapper>
      {errors[name]?.message ? <ErrorSpan >{t(errors[name]?.message as I18NKey)}</ErrorSpan> : ''}
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
  margin-bottom: 40px ;
  &.submitting {
    opacity: .5;
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

const StyledInput = styled.input<{ textColor: string, bgColor?: string }>`
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
  &:-webkit-autofill:active
  .dark &:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    color: var(--ion-color-${({ textColor }) => textColor});
    -webkit-text-fill-color: var(--ion-color-${({ textColor }) => textColor});
}
`;

const ErrorSpan = styled.span`
  color: var(--ion-color-danger);
  font-size: 1.6rem ;
`