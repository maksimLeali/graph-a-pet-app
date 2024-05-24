import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useFormContext, RegisterOptions } from "react-hook-form";
import { IconName, Icon } from "@components";
import { I18NKey } from "@i18n";
import { useOnClickOutside } from "@hooks";
import {
	FocusBox,
	InputWrapper,
	Wrapper,
	InputLabel,
	StyledInput,
	ErrorSpan,
} from "./components";
import { CommonProps, HookFormProps } from "./components/types";


export const HookFormInput: React.FC<HookFormProps & CommonProps> = ({
	textLabel,
	ntTextLabel,
	required = false,
	type = "text",
	inputMode = "text",
	focusColor = "primary",
	disabledColor = "lightGray",
	textColor = "dark",
	color = "medium",
	errorColor = "danger",
	bgColor,
	icon,
	name,
	disabled = false,
	registerOptions,
}) => {
	const { t } = useTranslation();
	const [focused, setFocused] = useState(false);
	const [compiled, setCompiled] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const [showPsw, setShowPsw] = useState(false);
	const {
		register,
		getValues,
		formState: { errors },
	} = useFormContext();

	useEffect(() => {
		if (!getValues(name)) {
			setCompiled(false);
			return;
		}
		setCompiled(true);
	}, [getValues(name)]);

	const setFocus = () => {
		if (!ref.current) return;
		(ref.current.children[0] as any).focus();
	};

	const iconColor = useMemo(() => {
		if (errors[name]) return errorColor;
		if (disabled) return disabledColor;
		if (focused || compiled) return focusColor;
		return "medium";
	}, [errors[name], disabled, focused, compiled]);

	const classes = useMemo(() => {
		return `${disabled && "disabled"} ${focused && "focused"} ${
			compiled && "compiled"
		} ${errors[name] && "error"}`;
	}, [errors[name], disabled, focused, compiled]);

	useOnClickOutside(ref, () => {
		setFocused(false);
		const hide = ref.current?.children[0];
		if (!hide) return;
		hide.classList.remove("hide");
	});

	return (
		<Wrapper
			className={classes}
			focusColor={focusColor}
			disabledColor={disabledColor}
			errorColor={errorColor}
			textColor={textColor}
			color={color}
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
					{...register(name, {
						required: {
							value: required,
							message: "messages.errors.required",
						},
						...registerOptions,
					})}
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
			{errors[name]?.message && (
				<ErrorSpan className="error-span">
					{t(errors[name]?.message as I18NKey)}
				</ErrorSpan>
			)}
		</Wrapper>
	);
};
