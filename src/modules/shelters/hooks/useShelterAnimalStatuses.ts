import { useMemo } from "react";

import { FundingNeedStatus, Gender } from "@types";

import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";
import { useListPetsNeedingWalkQuery } from "../operations/__generated__/listPetsNeedingWalk.generated";
import { useListShelterMapsQuery } from "../operations/__generated__/listShelterMaps.generated";
import { useGetShelterMapBoxesLeanQuery } from "../operations/__generated__/getShelterMapBoxesLean.generated";
import { useListFundingNeedsQuery } from "../../donations/operations/__generated__/listFundingNeeds.generated";

export type AnimalStatus = "care" | "walk" | "ok";

export type AnimalRow = {
	shelterPetId: string;
	petId: string;
	name: string;
	pictureId?: string;
	gender?: Gender | null;
	years?: number | null;
	boxLabel?: string;
	status: AnimalStatus;
};

// il backend non espone uno stato medico per animale: lo stato "care"
// deriva dai funding need ATTIVI del pet con categoria sanitaria
const CARE_CATEGORIES = ["cure", "care", "medical", "health", "vet"];
const DIET_CATEGORIES = ["diet", "dieta", "food", "aliment"];

export const isCareCategory = (category?: string | null): boolean =>
	!!category && CARE_CATEGORIES.some((c) => category.toLowerCase().includes(c));

export const isDietCategory = (category?: string | null): boolean =>
	!!category && DIET_CATEGORIES.some((c) => category.toLowerCase().includes(c));

// gerarchia CTA donazioni: bisogno sanitario = urgente (danger),
// tutto il resto = normale (warning)
export const needUrgency = (category?: string | null): "danger" | "warning" =>
	isCareCategory(category) ? "danger" : "warning";

type args = {
	shelterId: string;
	canWalks: boolean;
	canBoxes: boolean;
	canNeeds: boolean;
};

export const useShelterAnimalStatuses = ({
	shelterId,
	canWalks,
	canBoxes,
	canNeeds,
}: args): {
	animals: AnimalRow[];
	loading: boolean;
	refetch: () => void;
} => {
	// lista mutabile di shelter → network-only
	const {
		data: petsData,
		loading: petsLoading,
		refetch,
	} = useListShelterPetsMinQuery({
		skip: !shelterId,
		fetchPolicy: "network-only",
		nextFetchPolicy: "cache-first",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				filters: { fixed: [{ key: "shelter_id", value: shelterId }] },
			},
		},
	});

	const { data: walkData } = useListPetsNeedingWalkQuery({
		skip: !shelterId || !canWalks,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId },
	});

	const { data: mapsData } = useListShelterMapsQuery({
		skip: !shelterId || !canBoxes,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 20,
				filters: { fixed: [{ key: "shelter_id", value: shelterId }] },
			},
		},
	});
	const mapId = (mapsData?.listShelterMaps?.items ?? []).filter(Boolean)[0]?.id;

	const { data: boxesData } = useGetShelterMapBoxesLeanQuery({
		skip: !mapId,
		fetchPolicy: "cache-and-network",
		variables: { id: mapId as string },
	});

	const { data: needsData } = useListFundingNeedsQuery({
		skip: !shelterId || !canNeeds,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId, status: FundingNeedStatus.Active },
	});

	const animals = useMemo<AnimalRow[]>(() => {
		const pets = (petsData?.listShelterPets?.items ?? []).filter(
			(p): p is NonNullable<typeof p> => !!p
		);

		const needsWalk = new Set(
			(walkData?.listPetsNeedingWalk?.items ?? [])
				.filter((p): p is NonNullable<typeof p> => !!p)
				.map((p) => p.id)
		);

		const boxByShelterPet = new Map<string, string>();
		for (const box of boxesData?.getShelterMap?.map?.boxes ?? []) {
			if (!box) continue;
			for (const occ of box.current_occupants ?? []) {
				if (occ) boxByShelterPet.set(occ.id, box.label);
			}
		}

		const careByPet = new Set(
			(needsData?.listFundingNeeds?.items ?? [])
				.filter((n): n is NonNullable<typeof n> => !!n?.pet_id)
				.filter((n) => isCareCategory(n.category))
				.map((n) => n.pet_id as string)
		);

		return pets.map((sp) => {
			const status: AnimalStatus = careByPet.has(sp.pet.id)
				? "care"
				: needsWalk.has(sp.id)
					? "walk"
					: "ok";
			return {
				shelterPetId: sp.id,
				petId: sp.pet.id,
				name: sp.pet.name,
				pictureId: sp.pet.main_picture?.id ?? undefined,
				gender: sp.pet.gender,
				years: sp.pet.years,
				boxLabel: boxByShelterPet.get(sp.id),
				status,
			};
		});
	}, [petsData, walkData, boxesData, needsData]);

	return { animals, loading: petsLoading, refetch: () => refetch() };
};
