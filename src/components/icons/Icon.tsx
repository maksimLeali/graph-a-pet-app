import { IonIcon } from "@ionic/react";
import styled, { CSSObject } from "styled-components";
import * as Icons from "ionicons/icons";

import { IconName } from "./iconName";
import { $color, $uw } from "@theme";

type Props = {
	name: IconName;
	color?: string;
	size?: string;
	className?: string;
	mode?: "ios" | "md";
	dropShadow?: boolean;
	uw?: number;
	reverse?: boolean;
	time?: string;
	onClick?: () => void;
	onMouseUp?: () => void;
};
export const Icon: React.FC<Props> = ({
	mode = "md",
	name,
	color = "dark",
	time = "1s",
	uw,
	size = "24px",
	className,
	reverse = false,
	onClick,
	onMouseUp,
	dropShadow = false,
}) => {
	return (
		<Container
			dropShadow={dropShadow}
			onMouseUp={onMouseUp ? onMouseUp : () => {}}
			onClick={onClick ? (e) =>{ e.preventDefault() ;e.stopPropagation(); onClick()} : () => {}}
			time={time}
			uw={uw}
			size={size}
			className={`icon-wrapper ${className}`}
			iconColor={color}
			reverse={reverse}
		>
			<IonIcon mode={mode} size="large" icon={Icons[name]} />
		</Container>
	);
};

type ContainerProps = {
	size?: string;
	iconColor: string;
	reverse: boolean;
	uw?: number;
	dropShadow: boolean;
	time: string;
};

const Container = styled.div<ContainerProps>`
	display: flex;
	width: ${({ size, uw }) => (uw ? $uw(uw) : size ? `${size}` : "")};
	height: ${({ size, uw }) => (uw ? $uw(uw) : size ? `${size}` : "")};
	> * {
		color: ${({ iconColor }) => $color(iconColor)} !important ;
		width: 100%;
		height: 100%;
		aspect-ratio: 1;

	
		${({ reverse }) => (reverse ? `transform: ScaleX(-1);` : "")}
        transition: color ${({ time }) => time} ease-in, transform ${({
			time,
		}) => time} ease-in;
	}
`;
