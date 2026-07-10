import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Link } from "@router-components";

import { $color, $cssTRBL, $uw } from "@theme";
import { Icon, IconName } from "@components";
import { useUserContext } from "../../contexts/UserContext";

const PERSONAL_MENU_ITEMS: { to: string; icon: IconName; badge?: number }[] = [
    { to: "/home", icon: "home" },
    { to: "/pets", icon: "paw" },
    { to: "/board", icon: "warning" },
    { to: "/events", icon: "calendar" },
];

const SHELTER_MENU_ITEMS: {
    to: string;
    icon: IconName;
    selected: (pathname: string, search: string) => boolean;
}[] = [
    {
        to: "/shelters/dashboard",
        icon: "home",
        selected: (pathname) => pathname.startsWith("/shelters/dashboard"),
    },
    {
        to: "/shelters",
        icon: "search",
        selected: (pathname, search) =>
            pathname === "/shelters" &&
            new URLSearchParams(search).get("type") !== "personal",
    },
    {
        to: "/shelters/discover",
        icon: "compass",
        selected: (pathname) => pathname.startsWith("/shelters/discover"),
    },
    {
        to: "/shelters?type=personal",
        icon: "people",
        selected: (pathname, search) =>
            pathname === "/shelters" &&
            new URLSearchParams(search).get("type") === "personal",
    },
];

export const BottomMenu = () => {
    const { t } = useTranslation();
    const { fade } = useUserContext();
    const location = useLocation();
    const inShelterSection = location.pathname.startsWith("/shelters");

    if (inShelterSection) {
        return (
            <Container fade={fade}>
                {SHELTER_MENU_ITEMS.map((item, i) => {
                    const selected = item.selected(
                        location.pathname,
                        location.search,
                    );
                    return (
                        <Link
                            className={`${selected ? "selected" : ""}`}
                            key={i}
                            to={item.to}
                            aria-label={item.to.split("/")[1]}
                        >
                            <IconSlot>
                                <Icon
                                    dropShadow={selected}
                                    name={item.icon}
                                    size="24px"
                                    color={selected ? "primary" : "medium"}
                                />
                            </IconSlot>
                        </Link>
                    );
                })}
            </Container>
        );
    }

    const menuItems = PERSONAL_MENU_ITEMS.map((item) => ({
        ...item,
        selected: (pathname: string) => pathname.startsWith(item.to),
    }));

    return (
        <Container fade={fade}>
            {menuItems.map((item, i) => {
                const selected = item.selected(location.pathname);
                return (
                    <Link
                        className={`${selected ? "selected" : ""}`}
                        key={i}
                        to={item.to}
                        aria-label={item.to.split("/")[1]}
                    >
                        <IconSlot>
                            <Icon
                                dropShadow={selected}
                                name={item.icon}
                                size="24px"
                                color={selected ? "primary" : "medium"}
                            />
                            {!!item.badge && item.badge > 0 && (
                                <Badge>
                                    {item.badge > 99 ? "99+" : item.badge}
                                </Badge>
                            )}
                        </IconSlot>
                    </Link>
                );
            })}
        </Container>
    );
};

const IconSlot = styled.span`
    position: relative;
    display: inline-flex;
`;

const Badge = styled.span`
    position: absolute;
    top: -6px;
    right: -8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: ${$color("danger")};
    color: ${$color("light")};
    font-size: 1rem;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
`;

const TextSlot = styled.span<{ $selected: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    > span {
        font-size: 1.1rem;
        font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
        color: ${({ $selected }) =>
            $selected ? $color("primary") : $color("medium")};
    }
`;

const Dot = styled.span`
    position: absolute;
    top: -6px;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: ${$color("primary")};
`;

const Container = styled.div<{ fade: boolean }>`
    position: fixed;
    z-index: ${({ fade }) => (fade ? -1 : 200)};
    bottom: ${$uw(1)};
    height: ${$uw(4)};
    border-radius: 10px 10px;
    width: ${$uw(30)};
    left: calc(50% - ${$uw(15)});
    max-width: var(--max-width);
    background-color: ${$color("light")};
    box-shadow: 0 0px 1px 1px ${$color("medium")};
    display: flex;
    justify-content: space-between;
    padding: ${$cssTRBL(1, 2)};
    box-sizing: border-box;
    .dark & {
        background-color: ${$color("step-50")};
    }
`;
