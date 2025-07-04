import styled from "styled-components";
import { Link } from "@router-components";

import { $color, $cssTRBL, $uw } from "@theme";
import { Icon, IconName } from "@components";
import { useUserContext } from "../../contexts/UserContext";

export const BottomMenu= () => {

	const {fade} = useUserContext()
    const menuItems: { to: string; icon: IconName }[] = [
		{ to: "/home", icon: "home" },
		{ to: "/pets", icon: "paw" },
		{ to: "/board", icon: "warning" },
		{ to: "/events", icon: "calendar" },
	];
	return (
		<Container fade={fade}>
			{menuItems.map((item, i) => {
				const selected = window.location.pathname.startsWith(item.to);
				return (
					<Link
						className={`${selected ? "selected" : ""}`}
						key={i}
						to={item.to}
						aria-label={item.to.split("/")[1]}
					>
						<Icon
							dropShadow={selected}
							name={item.icon}
							size="32px"
							color={selected ? "primary" : "medium"}
						/>
					</Link>
				);
			})}
		</Container>
	);
};

const Container = styled.div<{fade: boolean}>`
    position: fixed;
	z-index: ${({fade})=> fade ? -1 :200};
	bottom: 0;
	height: ${$uw(6)};
	border-radius: 10px 10px 0 0;
	width: 100%;
	max-width: var(--max-width);
	background-color: ${$color('light')};
	box-shadow: 0 -1px 2px 0px ${$color('medium')};
	display: flex;
	justify-content: space-between;
	padding: ${$cssTRBL(2, 4)};
	box-sizing: border-box;
	.dark & {
		background-color: ${$color('step-50')};
	}
`;
