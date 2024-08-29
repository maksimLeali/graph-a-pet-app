import { ReportsPreview } from "@components";
import { useUserContext } from "@contexts";
import { IonContent } from "@ionic/react";
import { $cssTRBL, $uw } from "@theme";
import { useEffect } from "react";
import styled from "styled-components";
import { ChoiseContainer } from "../components";

export const Board: React.FC = () => {
	const { setPage, ownedPets: pets, loading, reports } = useUserContext();
	useEffect(() => {
		setPage({ name: "Board" });
	}, []);
	return (
		<IonContent fullscreen>
				<ChoiseContainer onChange={(choise)=> {console.log('choise: ', choise)}} />
			
			{/* <List>

			</List> */}
			{/* <ReportsPreview loading={loading} reports={reports} /> */}
		</IonContent>
	);
};

