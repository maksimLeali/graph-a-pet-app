import { useRef, useState } from "react";
import styled from "styled-components";

import { Icon } from "@components";
import { IconName } from "../../../components/icons/iconName";
import { useOnClickOutside } from "@hooks";
import { $color, $uw } from "@theme";

export type ActionMenuItem = {
	icon: IconName;
	label: string;
	tone?: "default" | "danger";
	onClick: () => void;
};

type Props = {
	items: ActionMenuItem[];
};

export const ActionMenu: React.FC<Props> = ({ items }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	useOnClickOutside(ref, () => setOpen(false));

	return (
		<Wrapper ref={ref}>
			<Trigger
				type="button"
				aria-label="actions"
				onClick={(e) => {
					e.stopPropagation();
					setOpen((v) => !v);
				}}
			>
				<Icon name="ellipsisVertical" color="medium" size="18px" />
			</Trigger>
			{open && (
				<Menu>
					{items.map((item, i) => (
						<MenuItem
							key={i}
							type="button"
							$danger={item.tone === "danger"}
							onClick={(e) => {
								e.stopPropagation();
								setOpen(false);
								item.onClick();
							}}
						>
							<Icon
								name={item.icon}
								color={item.tone === "danger" ? "danger" : "medium"}
								size="16px"
							/>
							<span>{item.label}</span>
						</MenuItem>
					))}
				</Menu>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	position: relative;
	flex: 0 0 auto;
`;

const Trigger = styled.button`
	width: ${$uw(2.6)};
	height: ${$uw(2.6)};
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	cursor: pointer;
	border-radius: 999px;
	&:active {
		background: rgba(var(--ion-color-medium-rgb), 0.15);
	}
`;

const Menu = styled.div`
	position: absolute;
	top: calc(100% + 4px);
	right: 0;
	z-index: 20;
	min-width: 160px;
	padding: ${$uw(0.5)} 0;
	border-radius: 12px;
	background: ${$color("light")};
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
	.dark & {
		background: ${$color("step-50")};
	}
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.9)} ${$uw(1.25)};
	border: none;
	background: transparent;
	cursor: pointer;
	text-align: left;
	> span {
		font-size: 1.4rem;
		font-weight: 600;
		color: ${({ $danger }) => $color($danger ? "danger" : "dark")};
	}
	&:active {
		background: rgba(var(--ion-color-medium-rgb), 0.12);
	}
`;
