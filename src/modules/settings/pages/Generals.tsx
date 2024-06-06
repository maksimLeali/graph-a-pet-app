import React, { useEffect } from "react";
import styled from "styled-components";
import { LanguageSelector } from "../components";
import { useUserContext } from "@contexts";
import { $cssTRBL, $color, $uw } from "@theme";
import { useTranslation } from "react-i18next";

export const Generals = React.memo(() => {
	const { setPage } = useUserContext();

	const { t } = useTranslation();

	useEffect(() => {
		setPage({ name: "Settings" });
	}, []);

	return (
		<Container>
			<Section>
				<h2>{t("settings.general.system")}</h2>
				<LanguageSelector />
			</Section>
			<Section>
				<h2>{t("settings.general.customization")}</h2>
			</Section>
			<Section>
				<h2>{t("settings.general.privacy")}</h2>
			</Section>
		</Container>
	);
});

const Container = styled.div`
	padding: ${$cssTRBL(1)};
`;

const Section = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid ${$color("medium")};
`;
