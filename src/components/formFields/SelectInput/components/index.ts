import { $color, $uw } from "@theme";
import styled from "styled-components";

type selectProps = {
    bgColor: string;
    color: string;
    disabledColor: string;
    textColor: string;
    focusColor: string;
    hoverColor: string;
    errorColor: string;
};

export const InvisibleInput = styled.input`
	height: 0;
	width: 0;
	position: absolute;
	opacity: 0;
`;

export const Wrapper = styled.div<selectProps>`
	width: 100%;
	position: relative;
	height: ${$uw(3)};
	margin-bottom: 40px;
    
	&.submitting, &.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
    .selectIcon {
		> * { 
            color:${({ bgColor }) => $color(bgColor)} !important; 
        }
	}
	.inputLabel {
        color: var(--ion-color-${({ bgColor }) => bgColor}); 
	}
	&.focused ,
	&.compiled {
        .selectIcon {
            > * {
                color: ${({ focusColor }) => $color(focusColor)} !important;
			}
		}
        .inputLabel {
            color: var(--ion-color-${({ focusColor }) => focusColor});
		}
    }
    &.error {
        .selectIcon {
            > * {
                color: ${({ errorColor }) => $color(errorColor)} !important
                
            }
        }
        .inputLabel {
			color: var(--ion-color-danger);
        }
    }
	.inputWrapper {
		background-color: ${({ bgColor }) => $color(bgColor)};
	}

	.focusBox {
		&.focused {
			background-color: var(
				--ion-color-${({ focusColor }) => focusColor}
			);
		}
		&.compiled {
			background-color: var(
				--ion-color-${({ focusColor }) => focusColor}
			);
		}
		&.error {
			background-color: var(--ion-color-danger);
		}
	}
	.label-container {
		> p {
			color: var(--ion-color-${({ textColor }) => textColor});
		}
	}
	.options-container {
		background-color: var(--ion-background-color);
		border-color: var(--ion-color-${({ bgColor }) => bgColor});
	}
	.option {
		color: var(--ion-color-${({ textColor }) => textColor});
		border-color: var(--ion-color-${({ bgColor }) => bgColor});
		&:hover {
			border-color: var(--ion-color-${({ focusColor }) => focusColor});
			background-color: var(
				--ion-color-${({ hoverColor }) => hoverColor}
			);
		}
	}
`;

export const InputLabel = styled.label`
	z-index: 3;
	position: absolute;
	left: ${$uw(1)};
	top: 2px;
	font-size: 2rem;

	transition: top 0.5s ease-in, left 0.5s ease-in, color 0.5s ease-in,
		font-size 0.5s ease-in;
	&.focused, &.compiled {
		font-size: 1.8rem;
		top: ${$uw(-1.5)};
		left: 0px;
	}
`;

export const InputWrapper = styled.div`
	width: 100%;
	height: ${$uw(2.5)};
	padding-bottom: 2px;
	padding-left: 2px;
	box-sizing: border-box;
	border-radius: 2px;
	display: flex;
	justify-content: space-between;
`;

export const LabelContainer = styled.div<{ bgColor?: string }>`
	height: 100%;
	position: relative;
	z-index: 2;
	width: calc(100% -  ${$uw(2.5)} );
	font-size: 1.3rem;
	padding-left: ${$uw(1)};

	background-color: ${({ bgColor }) =>
        bgColor
            ? `var(--ion-color-${bgColor})`
            : "var(--ion-background-color)"};
	> * {
		height: 100%;
	}

	> p {
		margin: 0;
	}
`;

export const IconContainer = styled.div<{ bgColor?: string }>`
	width: calc( ${$uw(2.5)} - 2px);
	position: relative;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ bgColor }) =>
        bgColor
            ? `var(--ion-color-${bgColor})`
            : "var(--ion-background-color)"};
	.selectIcon {
		&.focused {
			> * {
				transform: rotate(-180deg);
			}
		}
	}
`;

export const FocusBox = styled.span`
	background-color: var(--ion-color-medium);
	position: absolute;
	display: block;
	z-index: 1;
	left: 0;

	bottom: 0;
	width: 0;
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
`;

export const OptionsContainer = styled.div<{ maxHeight: number }>`
	width: calc(100% - ${$uw(3)});
	position: absolute;
	z-index: 4;
	top: 100%;
	border-radius: 2px;
	left: 0;
	overflow-y: scroll;
	border-left: 1px solid;
	opacity: 0;
	// margin-left: 20px ;
	max-height: 0;
	box-shadow: 1px 1px 2px 0px #2b2b2b;
	transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;

	@media (prefers-color-scheme: dark) {
		background-color: var(--ion-background-color);
	}
	&.focused {
		opacity: 1;
		max-height: ${({ maxHeight }) => maxHeight}px;
	}
	&.up {
		bottom: 50px;
		top: unset;
	}
`;

export const Option = styled.div`
	width: 100%;
	height: 50px;
	border-bottom: 1px solid;
	padding: 5px 12px;
	font-size: 1.3rem;
	box-sizing: border-box;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&:hover {
		border-left: 1px solid;
	}
`;
