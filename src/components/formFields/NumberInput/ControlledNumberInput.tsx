import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { uniqueId } from "lodash";
import { IconName, Icon } from "@components";
import { useOnClickOutside } from "@hooks";
import {
	FocusBox,
	InputWrapper,
	Wrapper,
	InputLabel,
	StyledInput,
	ErrorSpan,
	IconWrapper
} from "./components";
import { CommonProps, ControlledProps } from "./components/types";


export const ControlledNumberInput: React.FC<ControlledProps & CommonProps> = ({
	value,
	onChange,
	textLabel,
	ntTextLabel,
	required = false,
	type = "number",
	inputMode = "text",
	color = "medium",
	focusColor = "primary",
	disabledColor = "lightGray",
	textColor = "dark",
	errorColor = "danger",
	bgColor,
	icon,
	name=uniqueId('text-'),
	disabled = false,
	error,
}) => {
	const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value && value.length > 0) {
            setCompiled(true);
            return;
        }
        setCompiled(false);
    }, [value]);

    const setFocus = () => {
        if (!ref.current) return;
        (ref.current.children[0] as HTMLElement).focus();
    };

    const classes = useMemo(() => {
        return `${disabled && "disabled"} ${focused && "focused"} ${
            compiled && "compiled"
        } ${error && "error"}`;
    }, [error, disabled, focused, compiled]);

    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });

    return (
        <Wrapper
            className={`numeric-input ${classes}`}
            focusColor={focusColor}
            disabledColor={disabledColor}
            errorColor={errorColor}
            color={color}
            textColor={textColor}
            id={`${name}Input`}
            bgColor={bgColor}
        >
            <InputLabel
                htmlFor={name}
                onClick={() => setFocus()}
                className={`label ${classes}`}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
                {required && !compiled && " *"}
            </InputLabel>
            <InputWrapper className="input-wrapper" ref={ref}>
                <StyledInput
                    id={name}
                    className={classes}
                    onFocus={() => setFocused(true)}
                    inputMode="numeric"
                    type="number"
                    value={value ?? undefined}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                />
                {icon != undefined && icon != null && (
                    <IconWrapper className="icon-wrapper">{icon}</IconWrapper>
                )}
                <FocusBox className={`focus-box ${classes}`} />
            </InputWrapper>
            {error && <ErrorSpan className="error-span">{t(error)}</ErrorSpan>}
        </Wrapper>
    );
};
