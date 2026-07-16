import { IonButton, IonContent } from "@ionic/react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { useUserContext } from "@contexts";
import { $cssTRBL, $uw } from "@theme";
import { PullToRefresh } from "@components";

export const IntroPage = React.memo(({}) => {
	const { setPage, user } = useUserContext();

	useEffect(() => {
		setPage({ name: "Add pet" });
	}, []);

	const { t } = useTranslation();

	return (
		<IonContent fullscreen>
		    <PullToRefresh />
			<Container>
				<Title
					dangerouslySetInnerHTML={{
						__html:
							t("pets.add_pet_page.intro_title", {
								name: user.first_name,
							}) ?? "",
					}}
				/>
				<Description
					dangerouslySetInnerHTML={{
						__html: t("pets.add_pet_page.intro_desc") ?? "",
					}}
				/>
				<IonButton routerLink="/pets/new/step1">
					{t("pets.add_pet_page.start")}
				</IonButton>
			</Container>
		</IonContent>
	);
});

const Container = styled.div`
	width: 100%;
	padding: ${$cssTRBL(0, 1)};
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: ${$uw(3)};
`;
const Title = styled.h1`
	b {
		font-size: inherit;
	}
`;
const Description = styled.p`
	display: flex;
	flex-direction: column;
`;
