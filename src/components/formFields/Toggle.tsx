import { $color } from "@theme";
import React from "react";
import styled from "styled-components";

type Props = {
	value: boolean;
	onChange: (value: boolean) => void;
	leftElement?: React.ReactNode;
	rigthElement?: React.ReactNode;
	barColor?: string;
	btnColor?: string;
	btnSize?: string;
	confirmColor?: string;
};

export const Toggle: React.FC<Props> = ({
	value = true,
	onChange,
	btnSize = "25px",
	leftElement,
	rigthElement,
	barColor = "medium",
	btnColor = "dark",
	confirmColor,
}) => {
	return (
		<Container className="toggle" size={`calc(${btnSize} * 2 )`}>
			<Wrapper
				bgColor={value && confirmColor ? confirmColor : barColor}
				onClick={(e) => {
					e.preventDefault();
					onChange(!value);
				}}
			>
				{leftElement && leftElement}
				{rigthElement && rigthElement}
				<StateBtn
					bgColor={btnColor}
					size={btnSize}
					left={value ? `calc(${btnSize})` : "0"}
				></StateBtn>
			</Wrapper>
		</Container>
	);
};

const Container = styled.div<{ size: string }>`
	width: ${({ size }) => size};
	position: relative;
`;

const Wrapper = styled.div<{ bgColor: string }>`
	background-color: ${({ bgColor }) => $color(bgColor)};
	border-radius: 100px;
	height: 25px;
	width: 100%;
	display: flex;
	transition: background-color 0.5s ease-in;
	align-items: center;
	padding: 0 5px;
	box-sizing: border-box;
	justify-content: space-between;
`;

type StateProps = {
	left: string;
	size: string;
	bgColor: string;
};

const StateBtn = styled.div<StateProps>`
	width: ${({ size }) => size};
	background-color: ${({ bgColor }) => $color(bgColor)};
	height: ${({ size }) => size};
	border-radius: 100px;
	position: absolute;
	left: ${({ left }) => left};
	transition: left 0.4s cubic-bezier(0.18, 0.76, 0, 1.08);
`;
