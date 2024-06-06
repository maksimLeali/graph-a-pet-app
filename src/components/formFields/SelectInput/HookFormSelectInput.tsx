import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useOnClickOutside } from "@hooks";
import {
	FocusBox,
	IconContainer,
	InputLabel,
	InputWrapper,
	InvisibleInput,
	LabelContainer,
	OptionsContainer,
	Wrapper,
	Option,
	ErrorSpan,
} from "./components";
import { CommonProps, HookFormProps } from "./components/types";
import { Icon } from "@components";
import { I18NKey } from "@i18n";

export const HookFormSelectInput: React.FC<HookFormProps & CommonProps> = ({
	name,
	textLabel,
	ntTextLabel,
	required = false,
	bgColor,
	color = "medium",
	hoverColor = "light-tint",
	focusColor = "primary",
	disabledColor = "medium",
	hideIcon = false,
	forceOptionsUp = false,
	textColor = "dark",
	disabled = false,
	rowsPerList = 7,
	registerOptions,
	errorColor = "danger",
	options,
}) => {
	const [focused, setFocused] = useState(false);
	const [compiled, setCompiled] = useState(false);
	const [up, setUp] = useState(false);
	const [temptext, setTempText] = useState("");
	const [resetText, setResetText] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLInputElement>(null);

	const { t } = useTranslation();
	const {
		formState: { errors },
		control,
		register,
		getValues,
	} = useFormContext();

	useOnClickOutside(ref, () => setFocused(false));

	useEffect(() => {
		if (getValues(name)) setCompiled(true);
		else setCompiled(false);
	}, [getValues(name)]);

	useEffect(() => {
		if (!focused) {
			setTempText("");
			return;
		}
		if (!textRef.current) return;
		textRef.current.focus();
	}, [focused]);

	useEffect(() => {
		const itemsHeight =
			options.length > rowsPerList
				? rowsPerList * 60
				: options.length * 60;
		setUp(
			itemsHeight +
				((optionsRef.current?.offsetParent as HTMLDivElement)
					?.offsetTop ?? 0) >
				window.innerHeight
		);
	}, [rowsPerList, optionsRef.current]);

	const classes = useMemo(() => {
		return `${disabled && "disabled"} ${focused && "focused"} ${
			compiled && "compiled"
		} ${errors[name] && "error"}`;
	}, [errors[name], disabled, focused, compiled]);

	return (
		<Wrapper
			focusColor={focusColor}
			hoverColor={hoverColor}
			textColor={textColor}
			bgColor={bgColor}
			disabledColor={disabledColor}
			errorColor={errorColor}
			color={color}
			className={`select-input ${classes}`}
		>
			<InputLabel
				className={`inputLabel ${classes}`}
				htmlFor={name}
				onClick={() => setFocused(!focused)}
			>
				{textLabel ? t(textLabel) : ntTextLabel}
				{required && !compiled && " *"}
			</InputLabel>
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, value, ref, name } }) => (
					<InputWrapper ref={ref} className="inputWrapper">
						<InvisibleInput
							id={name + "-fake"}
							onFocus={() => setFocused(true)}
							{...register(name, {
								required: {
									value: required,
									message: "messages.errors.required",
								},
								...registerOptions,
							})}
						/>
						<LabelContainer
							className={`label-container ${hideIcon ? "full-width" : ""}`}
							onClick={() => setFocused(!focused)}
						>
							{value
								? options.find((opt) => opt.value === value)
										?.render || (
										<p>
											{
												options.find(
													(opt) => opt.value === value
												)?.label
											}
										</p>
								  )
								: ""}
						</LabelContainer>
						{!hideIcon && (
							<IconContainer className="icon-container">
								<Icon
									size="26px"
									time=".5s"
									onMouseUp={() => setFocused(!focused)}
									className={`selectIcon ${classes}`}
									name="caretDownCircleOutline"
								/>
							</IconContainer>
						)}
						<OptionsContainer
							maxHeight={
								options.length > rowsPerList
									? rowsPerList * 3.5
									: options.length * 3.5
							}
							className={`options-container ${classes} ${
								up || forceOptionsUp ? "up" : "" } ${
								hideIcon ? 'full' : ""
								}`}
							ref={optionsRef}
						>
							{options.map((option, i) => (
								<Option
									key={i}
									className={`option ${
										option.value === value ? "selected" : ""
									}`}
									onMouseUp={() => {
										setFocused(false);
										if (option.value === value) {
											onChange(null);
											setCompiled(false);
											return;
										}
										onChange(option.value);
										setCompiled(true);
									}}
								>
									{option.render
										? option.render
										: option.label}
									{option.value === value && (
										<Icon
											name="closeCircleOutline"
											color={color}
										/>
									)}
								</Option>
							))}
						</OptionsContainer>
						<FocusBox className={`focusBox ${classes}`} />
					</InputWrapper>
				)}
			/>
			{errors[name]?.message && (
				<ErrorSpan className="error-span">
					{t(errors[name]?.message as I18NKey)}
				</ErrorSpan>
			)}
		</Wrapper>
	);
};
