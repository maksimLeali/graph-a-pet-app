import styled from "styled-components";

import { Icon, Image2x } from "@components";
import { IconName } from "../../../components/icons/iconName";
import { $color } from "@theme";

type Props = {
	size?: number;
	imageId?: string;
	icon?: IconName;
	initials?: string;
	color?: string;
	className?: string;
};

export const Avatar: React.FC<Props> = ({
	size = 32,
	imageId,
	icon,
	initials,
	color = "primary",
	className,
}) => {
	return (
		<Circle className={className} $size={size} $bgColorName={color}>
			{imageId ? (
				<Image2x id={imageId} rounded fit />
			) : icon ? (
				<Icon name={icon} color="light" size={`${Math.round(size * 0.5)}px`} />
			) : (
				<span>{initials}</span>
			)}
		</Circle>
	);
};

const Circle = styled.div<{ $size: number; $bgColorName: string }>`
	flex: 0 0 auto;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	border-radius: 999px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ $bgColorName }) => $color($bgColorName)};
	> .img2x {
		width: 100%;
		height: 100%;
	}
	> span {
		font-size: ${({ $size }) => Math.round($size * 0.38)}px;
		font-weight: 700;
		color: ${$color("light")};
		text-transform: uppercase;
	}
`;
