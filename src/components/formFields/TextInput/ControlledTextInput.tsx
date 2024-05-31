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
} from "./components";
import { CommonProps, ControlledProps } from "./components/types";


export const ControlledTextInput: React.FC<ControlledProps & CommonProps> = ({
	value,
	onChange,
	textLabel,
	ntTextLabel,
	required = false,
	type = "text",
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
	const [showPsw, setShowPsw] = useState(false);

	useEffect(() => {
        
        if(value && value.length > 0) {
            setCompiled(true) 
            return
        }
		setCompiled(false);
	}, [value]);

	const setFocus = () => {
		if (!ref.current) return;
		(ref.current.children[0] as any).focus();
	};

	const iconColor = useMemo(() => {
		if (error) return errorColor;
		if (disabled) return disabledColor;
		if (focused || compiled) return focusColor;
		return "medium";
	}, [error, disabled, focused, compiled]);

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
			className={`text-input ${classes}`}
			focusColor={focusColor}
			disabledColor={disabledColor}
			errorColor={errorColor}
			color={color}
			textColor={textColor}
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
					inputMode={inputMode}
					type={
						type == "password"
							? showPsw
								? "text"
								: "password"
							: type
					}
					value={value ?? undefined}
					onChange={(e) => {
						onChange(e.target.value);
						
					}}
				/>
				{type == "password" && (
					<Icon
						name={showPsw ? "eyeOff" : "eye"}
						onClick={() => setShowPsw(!showPsw)}
						color={iconColor}
					/>
				)}
				{icon != undefined && icon != null && (
					<Icon name={icon} size="14px" color={iconColor} />
				)}
				<FocusBox className={`focus-box ${classes}`} />
			</InputWrapper>
			{error && <ErrorSpan className="error-span">{t(error)}</ErrorSpan>}
		</Wrapper>
	);
};
