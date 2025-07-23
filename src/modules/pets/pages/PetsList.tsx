import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { IonContent, IonRefresher, IonRefresherContent, RefresherEventDetail } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { PetItem } from "../components/PetItem";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL } from "@theme";
import { useGetOrCreateLazyQuery } from "../../home/operations/__generated__/getOrCreateCode.generated";

export const PetsList: React.FC = () => {
	const { setPage, ownedPets, loanPets, loading, refetchDashboard } = useUserContext();
	const [canShare, setCanShare] = useState(true);

	useEffect(() => {
		try {
			navigator.canShare({
				url: `${window.location.origin}/home`,
				text: "Un cucciolo per te",
			});
		} catch (e) {
			setCanShare(false);
		}
	}, []);

	useEffect(() => {
		setPage({ name: "My pets" });
	}, []);
	const { t } = useTranslation();

	const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
		refetchDashboard();
		event.detail.complete();
	};

	const [getOrCreateCode] = useGetOrCreateLazyQuery({
		onCompleted: ({ getOrCreateCode }) => {
			if (!getOrCreateCode?.code || getOrCreateCode.error) {
				return;
			}
			try {
				if (!canShare) {
					return null;
				}
				navigator.share({
					url: `${window.location.origin}/pets/sharing/${getOrCreateCode.code.code}`,
					title: "Un cucciolo per te",
					text: "ti è stato condiviso un cucciolo",
				});
			} catch (e) {
				console.log(e);
			}
		},
	});


	const share = useCallback((id:string) => {
		getOrCreateCode({
			variables: {				
				ref_table: "pets",				
				ref_id: id,
				code: null,
			},
		});
	}, []);

	console.log(loanPets)
	return (
		<IonContent fullscreen>
			<IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
				<IonRefresherContent></IonRefresherContent>
			</IonRefresher>
			<List>
				{ownedPets.map((pet, i) => {
					return pet ? (
						<PetItem key={pet.id} pet={pet} index={i} onShare={share} />
					) : (
						<></>
					);
				})}
				{loanPets.map((pet, i) => {
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
	color: ${$color("primary")};
	text-decoration: underline;
	text-align: end;
	padding: ${$cssTRBL(0, 2, 1, 2)};
`;
