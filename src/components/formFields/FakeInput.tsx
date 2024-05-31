import { useEffect, useMemo, useRef, useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useOnClickOutside } from "@hooks";
import { I18NKey } from "@i18n";
import { IconName, Icon } from "@components";

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
	value?: string;
	pattern?: RegExp;
	icon?: IconName;
	errorColor?: string;
	bgColor?: string;
	disabled?: boolean;
	onClick: () => void;
};

export const FakeInput: React.FC<props> = ({
	textColor = "dark",
	ntTextLabel,
	textLabel,
	color = "medium",
	required = false,
	value,
	focusColor = "primary",
	disabledColor = "lightGray",
	errorColor = "danger",
	disabled = false,
	errorText,
	bgColor,
	icon,
	onClick,
	name,
}: props) => {
	const { t } = useTranslation();
	const [focused, setFocused] = useState(false);
	const [compiled, setCompiled] = useState(false);
	const [error, setError] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (value && value.length > 0) {
			setCompiled(true);
            return
		}
        setCompiled(false)
	}, [value]);

	useOnClickOutside(ref, () => {
		setFocused(false);
		const hide = ref.current?.children[0];
		if (!hide) return;
		hide.classList.remove("hide");
	});

	const classes = useMemo(() => {
		return `${disabled && "disabled"} ${focused && "focused"} ${
			compiled && "compiled"
		} ${error && "error"}`;
	}, [error, disabled, focused, compiled]);

	useEffect(() => {
		if (focused) {
			onClick();
		}
	}, [focused]);

	return (
		<Wrapper className={`${classes}`}>
			<InputLabel
				color={color}
				focusColor={focusColor}
				htmlFor={name}
				onClick={() => setFocused(true)}
				className={`${classes}`}
			>
				{textLabel ? t(textLabel) : ntTextLabel}
				{required && !compiled && " *"}
			</InputLabel>
			<InputWrapper ref={ref} color={color}>
				<StyledLabel
					id={name}
					onFocus={() => setFocused(true)}
					onClick={() => setFocused(true)}
					textColor={textColor}
					bgColor={bgColor}
				>
					{value}
				</StyledLabel>
				{icon ? (
					<Icon
						name={icon}
						size="14px"
						color={
							error
								? "danger"
								: focused || compiled
								? "primary"
								: "medium"
						}
					/>
				) : (
					""
				)}
				<FocusBox
					color={color}
					focusColor={focusColor}
					className={`foxusBox ${classes}`}
				/>
			</InputWrapper>
			{errorText ? <ErrorSpan>{errorText}</ErrorSpan> : ""}
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

const StyledLabel = styled.label<{ textColor: string; bgColor?: string }>`
	outline: none;
	border: none;
	position: relative;
	z-index: 2;
	display: flex;
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
`;

const ErrorSpan = styled.span`
	color: var(--ion-color-danger);
	font-size: 1.6rem;
`;
