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
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
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
    pattern?: RegExp;
    registerOptions?: RegisterOptions;
    errorColor?: string;
};

export const TextAreaInput: React.FC<props> = ({
    textColor = "dark",
    ntTextLabel,
    textLabel,
    color = "medium",
    required = false,
    registerOptions,
    focusColor = "primary",
    disabledColor = "lightGray",
    errorColor = "danger",
    name,
}: props) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const [error, setError] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [editableText, setEditableText] = useState('ads s<br /> sa. adsa d<br />sad adsasd <br /><br />dsasd<br /><br />')
    const editableRef = useRef<HTMLDivElement>(null);
    const [showPsw, setShowPsw] = useState(false);
    const {
        setValue,
        register,
        getValues,
        formState: { errors, isSubmitting },
    } = useFormContext();

    const onContentBlur = useCallback(
        (evt: any) => {
            const sanitizeConf = {
                allowedTags: ["b", "i", "a", "p", 'br', 'div'],
                allowedAttributes: { a: ["href"] },
            };
            const text = sanitizeHtml(
                evt.currentTarget.innerHTML,
                sanitizeConf
            );
            setValue(name, text??'');
            // setEditableText(text)
            if(text.length == 0) {
              setCompiled(false);
              return
            }
            if (!compiled) {
                setCompiled(true);
            }
        },[]
    );

    const setFocus = () => {
        if (!ref.current) return;
        const editDiv = ref.current.querySelector(`#${name}`) as HTMLElement;
        if (editDiv) {
            editDiv.focus();
        }
    };

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
        <Wrapper className={`${isSubmitting ? "submitting" : ""}`}>
            <InputLabel
                color={color}
                focusColor={focusColor}
                htmlFor={name}
                onClick={setFocus}
                className={`${focused ? "focused" : ""} ${
                    compiled ? "compiled" : ""
                } ${error ? "error" : ""}`}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
                {required && !compiled && " *"}
            </InputLabel>
            <InputWrapper ref={ref} color={color}>
                <Editable
                    id={name}
                    textcolor={textColor}
                    onChange={onContentBlur}
                    onFocus={() => setFocused(true)}
                    onBlur={onContentBlur}
                     
                    html={getValues(name )?? ''}
                    
                />
                <FocusBox
                    color={color}
                    focusColor={focusColor}
                    className={`foxusBox ${focused ? "focused" : ""} ${
                        compiled ? "compiled" : ""
                    } ${error ? "error" : ""}`}
                />
            </InputWrapper>
            {errors[name]?.message ? (
                <ErrorSpan>{t(errors[name]?.message as I18NKey)}</ErrorSpan>
            ) : (
                ""
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
    min-height: 38px;
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

const Editable = styled(ContentEditable)<{ textcolor: string }>`
    height: 100%;
    width: 100%;
    min-height: 38px;
    font-size: 1.6rem;
    padding-left: 20px;
    padding-bottom: 10px;
    box-sizing:border-box;
    border: none !important;
    color: var(--ion-color-${({ textcolor }) => textcolor});
    position: relative;
    z-index: 2;
    line-height: 2rem;
    padding-top: 8px;
    outline: 0px solid transparent;
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color);
    }
    &:-webkit-autofill,
    .dark &:-webkit-autofill,
    &:-webkit-autofill:hover,
    .dark &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    .dark &:-webkit-autofill:focus,
    &:-webkit-autofill:active .dark &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
        color: var(--ion-color-${({ textcolor }) => textcolor});
        -webkit-text-fill-color: var(
            --ion-color-${({ textcolor }) => textcolor}
        );
    }
    &:empty:before {
    content: attr(placeholder);
    color: var(--ion-color-${({ textcolor }) => textcolor});
  }

  // Add the onKeyDown event handler
  &:empty {
    min-height: 38px; // This ensures there's always a visible line for the cursor
  }

  &:not(:empty) {
    min-height: 38px; // This ensures there's always a visible line for the cursor
  }

  &[contentEditable="true"] {
    white-space: pre-wrap; // This preserves whitespace and line breaks
  }
`;
const StyledInput = styled.textarea<{ textColor: string }>`
    outline: none;
    border: none!important;
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
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color);
    }
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
