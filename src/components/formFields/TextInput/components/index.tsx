import styled from "styled-components";

type wrapperProps = {
	color: string;
	focusColor: string;
	errorColor: string;
	disabledColor: string;
	textColor: string;
	bgColor?: string;
};

export const Wrapper = styled.div<wrapperProps>`
	width: 100%;
	position: relative;
	margin-bottom: 40px;
	> .label {
		color: var(--ion-color-${({ color }) => color});
	}
	> .input-wrapper {
		background-color: var(--ion-color-${({ color }) => color});
		> input {
			color: var(--ion-color-${({ textColor }) => textColor});
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
			&:-webkit-autofill:active .dark &:-webkit-autofill:active {
				-webkit-box-shadow: 0 0 0 30px var(--ion-background-color) inset !important;
				color: var(--ion-color-${({ textColor }) => textColor});
				-webkit-text-fill-color: var(
					--ion-color-${({ textColor }) => textColor}
				);
			}
		}
	}
	.error-span {
		color: var(--ion-color-${({ errorColor }) => errorColor});
	}
	&.submitting,
	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
	&.compiled,
	&.focused {
		> .label {
			color: var(--ion-color-${({ focusColor }) => focusColor});
		}
		.focus-box {
			background-color: var(
				--ion-color-${({ focusColor }) => focusColor}
			);
		}
	}
	&.disabled {
		> .label {
			color: var(--ion-color-${({ disabledColor }) => disabledColor});
		}
		.focus-box {
			background-color: var(
				--ion-color-${({ disabledColor }) => disabledColor}
			);
		}
	}
	&.error {
		> .label {
			color: var(--ion-color-${({ errorColor }) => errorColor});
		}
		.focus-box {
			background-color: var(
				--ion-color-${({ errorColor }) => errorColor}
			);
		}
	}
`;

export const InputLabel = styled.label`
	z-index: 2;
	position: absolute;
	left: 20px;
	top: 2px;
	font-size: 2rem;
	transition: top 0.5s ease-in, left 0.5s ease-in, color 0.5s ease-in,
		font-size 0.5s ease-in;
	&.focused {
		font-size: 1.8rem;
		top: -25px;
		left: 0px;
	}
	&.compiled {
		font-size: 1.8rem;
		top: -25px;
		left: 0px;
	}
`;

export const InputWrapper = styled.div`
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

export const FocusBox = styled.span`
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
		width: 100%;
		max-height: 100%;
		transition: background-color 1s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
			width 0.5s ease-out, max-height 0.5s ease-out;
	}
	&.compiled {
		width: 100%;
		max-height: 100%;
	}
	&.error {
		background-color: var(--ion-color-danger);
	}
`;

export const StyledInput = styled.input`
	outline: none;
	border: none;
	position: relative;
	z-index: 2;
	background-image: none;
	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	font-size: 1.6rem;
	box-shadow: none;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	padding-left: 20px;
	padding-bottom: 10px;
`;

export const ErrorSpan = styled.span`
	font-size: 1.6rem;
`;
