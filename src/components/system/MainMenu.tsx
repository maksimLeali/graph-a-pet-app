import { useRef, useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import styled from "styled-components";
import { toast } from "react-hot-toast";


import { useOnClickOutside } from "@hooks";
import { useUserContext } from "@contexts";
import { Icon, Toggle, Modal, ModalProps } from "@components";
import { UserRole } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";

type props = {
	open: boolean;
	onClose: () => void;
};

export const MainMenu: React.FC<props> = ({ open, onClose }) => {
	const ref = useRef<HTMLDivElement>(null);
	useOnClickOutside(ref, () => {
		if (!modalOpen) onClose();
	});
	const [modal, setModal] = useState<ModalProps>();
	const [darkMode, setDarkMode] = useState(false);
	const [inited, setInited] = useState(false);
	const [isPWA, setIsPWA] = useState(false);
	const [cookies, setCookies, removeCookies] = useCookies(["user", "jwt"]);
	const [modalOpen, setModalOpen] = useState(false);
	const history = useHistory();
	const { t } = useTranslation();

	const { gridVisible, handleGridVisibility } = useUserContext();

	useEffect(() => {
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
		const isRunningAsPWA = !window.matchMedia("(display-mode: browser)")
			.matches;
		setIsPWA(isRunningAsPWA);
		setDarkMode(prefersDark.matches);
		setInited(true);
	}, []);

	const exit = useCallback(() => {
		Object.keys(cookies).forEach(cookieName => {
			if (cookieName.startsWith("user") || cookieName.startsWith("jwt")) {
				removeCookies(cookieName as "user" | "jwt");
			}
		});
	
		toast.success(t("messages.success.logout"));
	
		setTimeout(() => {
			history.push("/auth");
		}, 15000);
	}, []);

	useEffect(() => {
		if (!inited) return;
		document.body.classList.toggle("dark", darkMode);

		setModal({
			open: modalOpen ?? false,
			onClose: () => {
				setModalOpen(false);
			},
			onCancel: () => {
				setModalOpen(false);
			},
			onConfirm: () => {
				exit();
			},
			children: <ConfirmLogout />,
		});
	}, [darkMode, inited, modalOpen]);

	return (
		<MenuBackground
			className={`${open ? "open" : ""} ${isPWA ? "" : "browser"}`}
		>
			{modal ? <Modal {...modal} /> : <></>}
			<Container ref={ref}>
				<MainOptions>
					<Option href="#settings">
						<Icon size="24px" name="settingsOutline" />
						<span>{t("system.menu.settings")}</span>
					</Option>
					<Option href="#profile">
						<Icon size="24px" name="personOutline" />
						<span>{t("system.menu.profile")}</span>
					</Option>
				</MainOptions>
				<ActionOptions>
					<FakeOption
						onClick={() => {
							setModalOpen(true);
						}}
					>
						<Icon name="exitOutline" />
						<span>Logout</span>
					</FakeOption>
				</ActionOptions>
				<ToggleOption className="modeSelector">
					<Toggle
						value={darkMode}
						onChange={() => {
							setDarkMode(!darkMode);
						}}
						rigthElement={
							<Icon size="18px" name="sunny" color="dark" />
						}
						leftElement={
							<Icon size="18px" name="moonOutline" color="dark" />
						}
					/>
				</ToggleOption>
				{cookies.user.role === UserRole.Admin && (
					<ToggleOption className="gridSelector">
						<Toggle
							value={gridVisible}
							onChange={() => {
								handleGridVisibility(!gridVisible);
							}}
							rigthElement={
								<Icon size="18px" name="eye" color="dark" />
							}
							leftElement={
								<Icon size="18px" name="eyeOff" color="dark" />
							}
						/>
					</ToggleOption>
				)}
			</Container>
		</MenuBackground>
	);
};

const ConfirmLogout = () => {
	const { t } = useTranslation();
	return (
		<LogoutContainer>
			<p>{t("system.logout_modal.text")}</p>
		</LogoutContainer>
	);
};

const MenuBackground = styled.div`
	width: 100vw;
	height: 100dvh;
	background-color: ${$color('trasparent-bg-shade')};
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: -1;
	opacity: 0;
	animation: overMenuClose 0.5s ease-in-out;
	top: 0;
	left: 0;
	padding: 40px 10px;
	transition: opacity 0.5s ease-in-out;
	box-sizing: border-box;
	&.open {
		animation: overMenuOpen 0.5s ease-in-out;
		z-index: 201;
		opacity: 1;
	}
`;

const Container = styled.div`
	width: 100%;
	position: absolute;
	max-width: var(--max-width);
	bottom: -100%;
	padding: ${$cssTRBL(2,0, 1)};
	background-color: ${$color('light')};
	box-sizing: border-box;
	border-radius: 4px 4px 0 0;
	transition: bottom 0.5s ease-in-out;
	.open & {
		bottom: 0;
	}
`;

const MainOptions = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid ${$color('dark')};
	margin-bottom: ${$uw(1)};
	font-size: 1.6rem;
`;
const ActionOptions = styled.div`
	width: 100%;
	padding: 0;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid ${$color('dark')};
	font-size: 1.6rem;

	margin-bottom: ${$uw(1)};
`;
const Option = styled.a`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$cssTRBL(0, 1, 1)};
	box-sizing: border-box;
	text-decoration: none;
	color: inherit;
	&.modeSelector {
		justify-content: flex-end;
	}
	> span {
		color: ${$color('dark')};
	}
`;
const FakeOption = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: ${$uw(1)};
	cursor: pointer;
	padding: ${$cssTRBL(0, 1, 1)};
	box-sizing: border-box;
	text-decoration: none;
	color: inherit;
	&.modeSelector {
		justify-content: flex-end;
	}
	> span {
		color: ${$color('dark')};
	}
`;
const ToggleOption = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	
	padding-right: ${$uw(2)};
	box-sizing: border-box;
	margin-bottom: ${$uw(1)};
	margin-top: ${$uw(2)};
	&.modeSelector {
		justify-content: flex-end;
	}
	&.gridSelector {
		justify-content: flex-end;
		margin-bottom: 0;
	}
	> span {
		color: ${$color('dark')};
	}
`;

const LogoutContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: ${$uw(2)};
	> p {
		text-align: center;
		font-size: 1.6rem;
	}
`;
