import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import styled from "styled-components";
import dayjs from "dayjs";
import { useCookies } from "react-cookie";

import { CustodyLevel, UserRole } from "@types";

import { Image2x } from "@components";
import { MainMenu } from "@layouts/components";
import { MinUserFragment } from "@graphql_generated/minUser.generated";
import { DashboardPetFragment } from "@graphql_generated/dashboardPet.generated";
import { $color, $cssTRBL, $uw } from "@theme";
import { UserPlaceholder } from "@components";
import { useGetUserDashboardLazyQuery } from "../modules/home/operations/__generated__/getDashboard.generated";
import { MinReportFragment } from "@graphql_generated/MinReport.generated";

export type IUserContext = {
    setPage: (page: Page) => void;
    updatePets: (pets: DashboardPetFragment[]) => void;
    updateUserData: (patch: Partial<MinUserFragment>) => void;
    refetchDashboard: () => void;
    setUseCustomColorHandler: (v: boolean) => void;    
    pets: (DashboardPetFragment & { owner: boolean })[];
    ownedPets: (DashboardPetFragment & { owner: boolean })[];
    loanPets: (DashboardPetFragment & { owner: boolean })[];
    loading: boolean;
    gridVisible: boolean;
    reports: MinReportFragment[];
    useCustomColors: boolean;
    user: Pick<
        MinUserFragment,
        "first_name" | "last_name" | "email" | "profile_picture" | "id" | "role"
    >;
    handleGridVisibility: (v: boolean) => void;
    fadeBackground: (value: boolean) => void;
    fade: boolean;
} & Record<string, any>;

type Page = {
    name: string;
    visible?: boolean;
    noScroll?: boolean;
};

const defaultValue: IUserContext = {
    setPage: () => {},
    updatePets: () => {},
    updateUserData: () => {},
    refetchDashboard: () => {},
    setUseCustomColorHandler: () => {},
    pets: [],
    loanPets: [],
    ownedPets: [],
    loading: false,
    gridVisible: false,
    useCustomColors: true,
    reports: [],
    fade: false,
    user: { email: "", first_name: "", last_name: "", id: "", role: UserRole.User },
    handleGridVisibility: () => {},
    fadeBackground: () => {},
};
const UserContext = React.createContext<IUserContext>(defaultValue);

type Props = {
    children: React.ReactNode;
};

export const UserContextProvider: React.FC<Props & Record<string, unknown>> = ({
    children,
}) => {
    const [pageName, setPageName] = useState("");
    const [cookie, setCookie] = useCookies(["jwt", "user"]);
    const [visible, setVisible] = useState(true);
    const [pageNoScroll,setPageNoScroll] = useState(false);
    const [fade, setFade] = useState(false);    
    const [useCustomColors, setUseCustomColors] = useState(true);
    const [gridVisible, setGridVisible] = useState(false);
    const [alreadyRequested, setAlreadyRequested] = useState(false);
    const [pets, setPets] = useState<
        (DashboardPetFragment & { owner: boolean })[]
    >([]);
    const [reports, setReports] = useState<MinReportFragment[]>([]);
    const dateFrom = dayjs().startOf("w").toISOString();
    const dateTo = dayjs(dateFrom).add(14, "days").toISOString();
    const [user, setUser] = useState<MinUserFragment | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const refetchDashboard = () => {
        // getUserDashboardQuery();
		refetch()
    };

    const setPage = ({ name, visible = true, noScroll = false}: Page) => {
        setPageName(name);
        if (!alreadyRequested) {
            getUserDashboardQuery();
        }
        setVisible(visible);
        setPageNoScroll(noScroll)
    };

    useEffect(() => {
        setUseCustomColors(localStorage.getItem("customColor") == "true");
    }, []);

    const fadeBackground = (value: boolean) => {
        setFade(value);
    };

    const setUseCustomColorHandler = (v: boolean) => {
        setUseCustomColors(v);
        localStorage.setItem("customColor", `${v}`);
    };

    const [getUserDashboardQuery, { loading, data, refetch }] =
        useGetUserDashboardLazyQuery({
            fetchPolicy: "no-cache",
            nextFetchPolicy: "no-cache",
            variables: {
                date_from: dateFrom,
                date_to: dateTo,
            },
            onCompleted: ({ getUserDashboard }) => {
                setAlreadyRequested(true);
            },
        });

    useEffect(() => {
        if (!data?.getUserDashboard?.dashboard) return;
		console.log('data')
        const { ownerships, reports } = data.getUserDashboard.dashboard;
        if (ownerships?.items?.length) {
            setPets(
                ownerships.items.map((item) => ({
                    ...item!.pet,
                    owner: item!.custody_level === CustodyLevel.Owner,
                }))
            );
        } else {
            setPets([]);
        }
        setReports((reports?.items as MinReportFragment[]) ?? []);
    }, [data]);

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

    // aggiorna user in stato + cookie (senza CookiesProvider il setCookie
    // esterno non ri-renderizza questo context, quindi lo facciamo qui)
    const updateUserData = useCallback(
        (patch: Partial<MinUserFragment>) => {
            setUser((prev) => {
                const next = { ...(prev ?? {}), ...patch } as MinUserFragment;
                setCookie("user", JSON.stringify(next));
                return next;
            });
        },
        [setCookie]
    );

    const value = useMemo(
        () => ({
            ...defaultValue,
            pets,
            loading,
            loanPets,
            ownedPets,
            setPage,
            updateUserData,
            refetchDashboard,
            visible,
            gridVisible,
            handleGridVisibility,
            fadeBackground,
            setUseCustomColorHandler,
            useCustomColors,
            reports,
            fade,
            user: {
                first_name: user?.first_name ?? "",
                last_name: user?.last_name ?? "",
                email: user?.email ?? "",
                profile_picture: user?.profile_picture,
                id: user?.id ?? "",
                role: user?.role ?? UserRole.User,
            },
        }),
        [
            visible,
            pets,
            gridVisible,
            loading,
            loanPets,
            ownedPets,
            user,
            fade,
            useCustomColors,
            reports,
        ]
    );

    return (
        <UserContext.Provider value={value}>
            <CustomIonHeader
                visible={visible}
                fade={fade}
                noScroll={pageNoScroll}
                className="MainHeader"
            >
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

const CustomIonHeader = styled(IonHeader)<{ visible: boolean; fade: boolean, noScroll: boolean }>`
    position: absolute;
    top: ${({ visible }) => (visible ? "0" : "-100%")};
    height: ${$uw(5)};

    max-width: var(--max-width);
    ${({ fade }) => (fade ? "z-index: -1;" : "")};
    left: calc(50% - 240px);
    padding: ${$cssTRBL(0.75, 1, 0.75, 0)};
    box-sizing: border-box;
    background-color: ${$color("background-color")};
    display: flex;
    .mainWrapper {
        overflow-y: ${({noScroll})=> noScroll ? 'hidden' : 'scroll'};
    }
    .dark & {
        background-color: ${$color("toolbar-background")};
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
    border: 2px solid ${$color("primary")};
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
