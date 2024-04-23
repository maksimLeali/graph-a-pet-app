import styled from "styled-components";
import { useUserContext } from "../../../contexts";
import { useEffect } from "react";
import { IonContent } from "@ionic/react";
import { $cssTRBL } from "../../../utils/theme/functions";
import { PetItem } from "../components/PetItem";

export const PetsList: React.FC = () => {
	const { setPage, ownedPets, loanPets, loading } = useUserContext();

	useEffect(() => {
		setPage({ name: "My pets" });
	}, []);

	return (
		<IonContent fullscreen>
			<List>
				{[...ownedPets, ...loanPets].map((pet, i) => {
					return pet ? (
						<PetItem key={pet.id} pet={pet} index={i} />
					) : (
						<></>
					);
				})}
			</List>
		</IonContent>
	);
};

const List = styled.div`
	width: 100%;
	padding: ${$cssTRBL(4, 1)};
    position: relative;
    z-index: 0;
`;
