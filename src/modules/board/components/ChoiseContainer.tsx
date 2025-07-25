import { $color, $cssTRBL, $uw } from "@theme";
import { ReportType } from "@types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
    onChange: (choise?: ReportType) => void;
};

export const ChoiseContainer: React.FC<Props> = React.memo(({ onChange }) => {
    const [choise, setChoise] = useState<ReportType>();
    const { t } = useTranslation();
    const [color, setColor] = useState<"danger" | "warning" | "medium">(
        "medium"
    );

    const handleSetChoise = (selected: ReportType) => {
        if (choise == selected) {
            setChoise(undefined);
            setColor("medium");
            onChange(undefined);
            return;
        }
        setChoise(selected);
        setColor(selected == ReportType.Missing ? "danger" : "warning");
        onChange(selected);
        return;
    };

    return (
        <Container className={`${choise}`} color={color} choise={choise}>
            <Choise onClick={() => handleSetChoise(ReportType.Missing)}>
                {t("board.lost")}
            </Choise>
            <Choise onClick={() => handleSetChoise(ReportType.Found)}>
                {t("board.found")}
            </Choise>
        </Container>
    );
});

const Container = styled.div<{ color: string; choise?: ReportType }>`
    border: 1px solid ${({ color }) => $color(color)};

    border-radius: 4px;
    position: relative;
    margin-left: auto;
    height: ${$uw(2)};

    display: flex;
    margin-right: auto;
    align-items: center;
    transition: border-color 1s ease-out;
    width: ${$uw(18)};
    gap: ${$uw(2)};
    overflow-y: hidden;
    > div {
        transition: background-color 1s ease-out;
        color: ${$color("dark")};
        &:first-child {
            padding-right: 0;
            background-color: ${({ choise, color }) =>
                choise == ReportType.Missing
                    ? $color(color)
                    : $color("background-color")};
        }
        &:last-child {
            color: ${$color("dark")};
            padding-left: 0;
            background-color: ${({ choise, color }) =>
                choise == ReportType.Found
                    ? $color(color)
                    : $color("background-color")};
        }
    }
    .dark &.FOUND div:last-child {
        color: ${$color("light")};
    }
    &::before {
        transition: background-color 1s ease-out, border-color 1s ease-out;
        content: "";
        position: absolute;

        width: ${$uw(2.1)};
        height: ${$uw(2)};
        display: block;
        left: calc(50% - ${$uw(1.1)});
        background-color: ${({ choise }) =>
            choise == ReportType.Missing
                ? $color("danger")
                : $color("background-color")};
        z-index: 1;
    }
    &::after {
        content: "";
        position: absolute;
        transition: background-color 1s ease-out, border-color 1s ease-out;
        border-left: 1px solid ${({ color }) => $color(color)};
        transform: rotate(45deg) translate(50%, 50%);
        width: ${$uw(2.82)};
        height: ${$uw(2.82)};
        display: block;
        top: calc(-50% - ${$uw(0.5)});
        left: calc(50% - ${$uw(0.5)});
        background-color: ${({ choise }) =>
            choise == ReportType.Found
                ? $color("warning")
                : $color("background-color")};
        z-index: 1;
    }
`;

const Choise = styled.div`
    position: relative;
    z-index: 2;
    box-sizing: border-box;
    height: 100%;
    padding: ${$cssTRBL(1)};
    display: flex;
    height: 100%;
    justify-content: center;
    width: ${$uw(8)};
    align-items: center;
`;
