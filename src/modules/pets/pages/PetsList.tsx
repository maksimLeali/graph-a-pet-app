import styled from "styled-components";
import { useUserContext } from "../../../contexts";
import { useEffect } from "react";
import { IonContent } from "@ionic/react";
import { $cssTRBL, $uw } from "../../../utils/theme/functions";
import { PetItem } from "../components/PetItem";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const PetsList: React.FC = () => {
	const { setPage, ownedPets, loanPets, loading } = useUserContext();

	useEffect(() => {
		setPage({ name: "My pets" });
	}, []);
	const { t } = useTranslation();

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
				<AddPetCta
					to={ownedPets.length == 0 ? "/pets/new" : "/pets/new/step1"}
				>
					{t("pets.add_pet")}
				</AddPetCta>
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

const AddPetCta = styled(Link)`
	width: 100%;
	display: block;
	color: var(--ion-color-primary);
	text-decoration: underline;
	text-align: end;
	padding: ${$cssTRBL(0, 2, 1, 2)};
`;
