import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { $uw } from "@theme";
import { ShelterCard } from "../components";
import { useShelters } from "../hooks/useShelters";

export const Shelters: React.FC = () => {
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const { shelters, loading, error } = useShelters();

	useEffect(() => {
		setPage({ name: t("pages.shelters") });
	}, []);

	return (
		<IonContent>
			<List>
				{loading &&
					[0, 1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="skeleton" />
					))}
				{!loading &&
					shelters.map((shelter) => (
						<ShelterCard
							key={shelter.id}
							shelter={shelter}
							onClick={() =>
								history.push(`/shelters/detail/${shelter.id}`)
							}
						/>
					))}
			</List>
			{!loading && !error && shelters.length === 0 && (
				<Message>{t("shelters.empty")}</Message>
			)}
			{!loading && error && <Message>{error}</Message>}
		</IonContent>
	);
};

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(3)} 12px;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Skeleton = styled.div`
	width: 100%;
	height: ${$uw(6)};
	border-radius: 16px;
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
