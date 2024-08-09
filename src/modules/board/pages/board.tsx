import { ReportsPreview } from "@components";
import { useUserContext } from "@contexts";
import { IonContent } from "@ionic/react";
import { useEffect } from "react";
import styled from "styled-components";

export const Board: React.FC = () => {
	const { setPage, ownedPets: pets, loading, reports } = useUserContext();
	useEffect(() => {
		setPage({ name: "Board" });
	}, []);
	return (
		<IonContent fullscreen>
			<ReportsPreview loading={loading} reports={reports} />
		</IonContent>
	);
};
