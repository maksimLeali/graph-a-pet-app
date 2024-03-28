import styled from "styled-components";
import { Icon, IconName } from "../../components";
import { Link } from "react-router-dom";

export const BottomMenu= () => {

    const menuItems: { to: string; icon: IconName }[] = [
		{ to: "/home", icon: "home" },
		{ to: "/pets", icon: "paw" },
		{ to: "/board", icon: "warning" },
		{ to: "/events", icon: "calendar" },
	];
	return (
		<Container>
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

const Container = styled.div`
    position: fixed;
	z-index: 200;
	bottom: 0;
	height: 80px;
	border-radius: 10px 10px 0 0;
	width: 100%;
	max-width: var(--max-width);
	background-color: var(--ion-color-light);
	box-shadow: 0 -1px 2px 0px var(--ion-color-medium);
	display: flex;
	justify-content: space-between;
	padding: 20px 60px 20px 60px;
	box-sizing: border-box;
	.dark & {
		background-color: var(--ion-color-step-50);
	}
`;
