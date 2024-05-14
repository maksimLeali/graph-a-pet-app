import React, { useContext, useEffect, useMemo, useState } from "react";
import { CustodyLevel, Pet, User } from "../types";
import { IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import styled from "styled-components";

import { Image2x } from "../components";
import { useCookies } from "react-cookie";
import { MainMenu } from "../components/system";
import { MinUserFragment } from "../components/operations/__generated__/minUser.generated";
import { DashboardPetFragment } from "../components/operations/__generated__/dashboardPet.generated";
import { useGetUserDashboardLazyQuery } from "../modules/home/operations/__generated__/getDashboard.generated";
import dayjs from "dayjs";
import { $uw } from "../utils/theme/functions";
import { UserPlaceholder } from "../components";

export type IUserContext = {
	setPage: (page: Page) => void;
	updatePets: (pets: DashboardPetFragment[]) => void;
	refetchDashboard: () => void;
	pets: (DashboardPetFragment & { owner: boolean })[];
	ownedPets: (DashboardPetFragment & { owner: boolean })[];
	loanPets: (DashboardPetFragment & { owner: boolean })[];
	loading: boolean;
	gridVisible: boolean;
	user: Pick<MinUserFragment, 'first_name' | 'last_name' | "email" >;
	handleGridVisibility: (v: boolean) => void;
} & Record<string, any>;

type Page = {
	name: string;
	visible?: boolean;
};

const defaultValue: IUserContext = {
	setPage: () => {},
	updatePets: () => {},
	refetchDashboard: () => {},
	pets: [],
	loanPets: [],
	ownedPets: [],
	loading: false,
	gridVisible: false,
	user: {email: "",  first_name:"", last_name: "" },  
	handleGridVisibility: () => {},
};
const UserContext = React.createContext<IUserContext>(defaultValue);

type Props = {
	children: React.ReactNode;
};

export const UserContextProvider: React.FC<Props & Record<string, unknown>> = ({
	children,
}) => {
	const [pageName, setPageName] = useState("");
	const [cookie] = useCookies(["jwt", "user"]);
	const [visible, setVisible] = useState(true);

	const [gridVisible, setGridVisible] = useState(false);
	const [alreadyRequested, setAlreadyRequested] = useState(false);
	const [pets, setPets] = useState<
		(DashboardPetFragment & { owner: boolean })[]
	>([]);
	const dateFrom = dayjs().startOf("w").toISOString();
	const dateTo = dayjs(dateFrom).add(14, "days").toISOString();

	const [user, setUser] = useState<MinUserFragment | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	const refetchDashboard = () => {
		getUserDashboardQuery();
	};

	const setPage = ({ name, visible = true }: Page) => {
		setPageName(name);
		if (!alreadyRequested) {
			getUserDashboardQuery();
		}
		setVisible(visible);
	};

	const [getUserDashboardQuery, { loading }] = useGetUserDashboardLazyQuery({
		fetchPolicy: "no-cache",
		variables: {
			date_from: dateFrom,
			date_to: dateTo,
		},
		onCompleted: ({ getUserDashboard }) => {
			setAlreadyRequested(true);
			if (getUserDashboard.dashboard) {
				if (
					getUserDashboard.dashboard.ownerships &&
					getUserDashboard.dashboard.ownerships.items &&
					getUserDashboard.dashboard.ownerships.items.length
				) {
					const pets =
						getUserDashboard.dashboard.ownerships.items.map(
							(item) => ({
								...item!.pet,
								owner:
									item?.custody_level == CustodyLevel.Owner,
							})
						);
					setPets(pets);
				}
			}
			return;
		},
	});

	const ownedPets = useMemo(() => {
		return pets.filter((pet) => pet.owner);
	}, [pets]);
	const loanPets = useMemo(() => {
		return pets.filter((pet) => !pet.owner);
	}, [pets]);

	useEffect(() => {
		setUser(cookie.user);
	}, [cookie.user]);

	const handleGridVisibility = (v: boolean) => {
		setGridVisible(v);
	};

	const value = useMemo(
		() => ({
			...defaultValue,
			pets,
			loading,
			loanPets,
			ownedPets,
			setPage,
			refetchDashboard,
			visible,
			gridVisible,
			handleGridVisibility,
			user: {first_name: user?.first_name ?? '', last_name: user?.last_name ?? '' , email: user?.email ?? '' },
		}),
		[visible, pets, gridVisible, loading, loanPets, ownedPets, user]
	);

	return (
		<UserContext.Provider value={value}>
			<CustomIonHeader visible={visible} className="MainHeader">
				<IonToolbar>
					<IonTitle>{pageName}</IonTitle>
				</IonToolbar>
				<MainImage
					className="skeleton"
					onClick={() => setMenuOpen(true)}
				>
					{user && user.profile_picture ? (
						<Image2x rounded id={user.profile_picture.id} />
					) : (
						<UserPlaceholder />
					)}
				</MainImage>
			</CustomIonHeader>
			<MainBody className={!visible ? "noUserMenu" : ""}>
				{children}
			</MainBody>
			<MainMenu
				open={menuOpen}
				onClose={() => {
					setMenuOpen(false);
				}}
			/>
		</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);

const CustomIonHeader = styled(IonHeader)<{ visible: boolean }>`
	position: absolute;
	top: ${({ visible }) => (visible ? "0" : "-100%")};
	height: ${$uw(5)};
	max-width: var(--max-width);
	left: calc(50% - 240px);
	padding: ${$uw(0.75)};
	box-sizing: border-box;
	background-color: var(--ion-background-color);
	display: flex;
	.dark & {
		background-color: var(--ion-toolbar-background);
	}
	@media only screen and (max-width: 480px) {
		left: 0;
	}
	> * {
		height: 100%;
		> * {
			height: 100%;
		}
	}
`;

const MainImage = styled.div`
	width: ${$uw(3.5)};
	flex: 0 0 ${$uw(3.5)};
	aspect-ratio: 1;
	position: relative;
	box-sizing: border-box;
	z-index: 10;
	overflow: hidden;
	border: 2px solid var(--ion-color-primary);
	border-radius: ${$uw(4)};
	> .img2x {
		width: 100%;
		height: 100%;
	}
	> .avatar {
		width: 100%;

		height: 100%;
	}
`;

const MainBody = styled.div`
	width: 100%;
	position: relative;
	height: 100%;
	&.noUserMenu {
		padding-top: 0;
	}
`;
