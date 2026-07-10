import { useListOperationalShelterWalksQuery } from "../operations/__generated__/listOperationalShelterWalks.generated";
import { MinShelterWalkFragment } from "../operations/__generated__/MinShelterWalk.generated";

export const useShelterWalks = (
	shelterId: string
): {
	walks: MinShelterWalkFragment[];
	loading: boolean;
	error?: string;
	refetch: () => void;
} => {
	const { data, loading, refetch } = useListOperationalShelterWalksQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId },
	});

	const walks = (data?.listOperationalShelterWalks?.items ?? []).filter(
		(w): w is MinShelterWalkFragment => !!w
	);

	return {
		walks,
		loading,
		error: data?.listOperationalShelterWalks?.error?.message ?? undefined,
		refetch: () => refetch(),
	};
};
