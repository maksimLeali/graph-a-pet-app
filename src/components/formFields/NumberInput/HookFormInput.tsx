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
	IconWrapper
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
	const {
		register,
		getValues,
		setValue,
		formState: { errors },
	} = useFormContext();

	useEffect(() => {
		if ([undefined, null].includes(getValues(name))) {
			setCompiled(false);
			return;
		}
		setCompiled(true);
	}, [getValues(name)]);

	const setFocus = () => {
		if (!ref.current) return;
		(ref.current.children[0] as HTMLElement).focus();
	};

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
			className={`numeric-input menu ${classes}`}
			focusColor={focusColor}
			id={`${name}Input`}
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
					// inputMode="numeric"					
					type="number"
					step="any"
					{...register(name, {
						required: {
							value: required,
							message: "messages.errors.required",
						},
						...registerOptions,
					})}
				/>

				

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
