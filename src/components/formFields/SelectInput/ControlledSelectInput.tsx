import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "@components";
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
} from "./components";
import { useOnClickOutside } from "@hooks";
import { CommonProps, ControlledProps } from "./components/types";

export const ControlledSelectInput: React.FC<ControlledProps & CommonProps> = ({
	currentValue,
	onSelected,
	name,
	textLabel,
	ntTextLabel,
	required = false,
	bgColor,
	color = "medium",
	hoverColor = "light-tint",
	focusColor = "primary",
	disabledColor = "medium",
	forceOptionsUp = false,
	textColor = "dark",
	errorText,
	disabled = false,
	rowsPerList = 7,
	errorColor = "danger",
	options,
}) => {
	const [focused, setFocused] = useState(false);
	const [compiled, setCompiled] = useState(false);
	const [up, setUp] = useState(false);

	const ref = useRef<HTMLDivElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();

	useOnClickOutside(ref, () => setFocused(false));

	useEffect(() => {
		if (currentValue) setCompiled(true);
		else setCompiled(false);
	}, [currentValue]);

	const handleOptionClick = (value: any) => {
		setFocused(false);
		if (value === currentValue) {
			onSelected(null);
			setCompiled(false);
		} else {
			onSelected(value);
			setCompiled(true);
		}
	};

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

	return (
		<Wrapper
			focusColor={focusColor}
			hoverColor={hoverColor}
			textColor={textColor}
			bgColor={color}
			disabledColor={disabledColor}
            errorColor={errorColor}
            color={color}
		>
			<InputLabel
				className={`inputLabel ${focused ? "focused" : ""} ${
					compiled ? "compiled" : ""
				}`}
				htmlFor={name}
				onClick={() => setFocused(!focused)}
			>
				{textLabel ? t(textLabel) : ntTextLabel}
				{required && !compiled && " *"}
			</InputLabel>
			<InputWrapper ref={ref} className="inputWrapper">
				<InvisibleInput id={name} value={currentValue} />
				<LabelContainer
					bgColor={bgColor}
					className="label-container"
					onClick={() => setFocused(!focused)}
				>
					{currentValue
						? options.find( (opt) => opt.value === currentValue)
								?.render || (
								<p>
									{
										options.find(
											(opt) => opt.value === currentValue
										)?.label
									}
								</p>
						  )
						: ""}
				</LabelContainer>
				<IconContainer bgColor={bgColor}>
					<Icon
						size="26px"
						time=".5s"
						onMouseUp={() => setFocused(!focused)}
						className={`selectIcon ${
                            focused ? "focused" : ""} ${
                            compiled ? "compiled" : ""}`}
						name="caretDownCircleOutline"
					/>
				</IconContainer>
				<OptionsContainer
					maxHeight={
						options.length > rowsPerList
							? rowsPerList * 50
							: options.length * 50
					}
					className={`options-container ${
                        focused ? "focused" : ""} ${
						compiled ? "compiled" : ""} ${
                        up || forceOptionsUp ? "up" : ""
                    }`}
					ref={optionsRef}
				>
					{options.map((option, i) => (
						<Option
							key={i}
							className="option"
							onMouseUp={() => handleOptionClick(option.value)}
						>
							{option.render ? option.render : option.label}
							{option.value === currentValue && (
								<Icon name="closeCircleOutline" color={color} />
							)}
						</Option>
					))}
				</OptionsContainer>
				<FocusBox className={`focusBox ${focused ? "focused" : ""}`} />
			</InputWrapper>
		</Wrapper>
	);
};
