import React, { useEffect } from "react";
import { PullToRefresh } from "@components";
import { IonContent } from "@ionic/react";
import styled from "styled-components";
import { LanguageSelector, PetsColor } from "../components";
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
		<IonContent>
			<PullToRefresh />
			<Container>
				<Section>
					<h2>{t("settings.general.system")}</h2>
					<LanguageSelector />
				</Section>
				<Section>
					<h2>{t("settings.general.customization")}</h2>
					<PetsColor />
				</Section>
				<Section>
					<h2>{t("settings.general.privacy")}</h2>
				</Section>
			</Container>
		</IonContent>
	);
});

const Container = styled.div`
	padding: ${$cssTRBL(1)};
`;

const Section = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: ${$cssTRBL(1, 0, 1.5 ,0)};
	justify-content: center;
	border-bottom: 1px solid ${$color("medium")};
	* {
		color: ${$color("dark")};
	}
	
`;
