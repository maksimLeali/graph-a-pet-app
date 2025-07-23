import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import {
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    RefresherEventDetail,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { PetItem } from "../components/PetItem";
import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import { useGetOrCreateLazyQuery } from "../../home/operations/__generated__/getOrCreateCode.generated";

export const PetsList: React.FC = () => {
    const { setPage, ownedPets, loanPets, loading, refetchDashboard } =
        useUserContext();
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

    const share = useCallback((id: string) => {
        getOrCreateCode({
            variables: {
                ref_table: "pets",
                ref_id: id,
                code: null,
            },
        });
    }, []);

    useEffect(()=>{
		console.log(ownedPets)
	}, [ownedPets])
    return (
        <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <List>
                <h2>{t("pets.pet_list_page.owned")}</h2>
                {ownedPets.map((pet, i) => {
                    return (
                        <PetItem
                            key={pet.id}
                            pet={pet}
                            index={i}
                            onShare={share}                            
                        />
                    );
                })}
                <AddPetCta
                    to={ownedPets.length == 0 ? "/pets/new" : "/pets/new/step1"}
                >
                    {t("pets.add_pet")}
                </AddPetCta>
                <h2>{t("pets.pet_list_page.on_loan")}</h2>
                {loanPets?.length > 0 ? (
                    loanPets.map((pet, i) => {
                        return (
                            <PetItem
                                key={pet.id}
                                pet={pet}
                                index={i}                                
                            />
                        );
                    })
                ) : (
                    <p>{t("pets.pet_list_page.empty")}</p>
                )}
            </List>
        </IonContent>
    );
};

const List = styled.div`
    width: 100%;
    padding: ${$cssTRBL(2, 1)};
    position: relative;
    z-index: 0;
    h2 {
        text-transform: uppercase;
        margin-bottom: ${$uw(2)};
    }
`;

const AddPetCta = styled(Link)`
    width: 100%;
    display: block;
    color: ${$color("primary")};
    text-decoration: underline;
    text-align: end;
    padding: ${$cssTRBL(0, 2, 1, 2)};
`;
