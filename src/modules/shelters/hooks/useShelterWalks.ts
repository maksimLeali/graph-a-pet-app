import { useListShelterWalksQuery } from "../operations/__generated__/listShelterWalks.generated";
import { MinShelterWalkFragment } from "../operations/__generated__/MinShelterWalk.generated";

const PAGE_SIZE = 50;

export const useShelterWalks = (
	shelterId: string
): {
	walks: MinShelterWalkFragment[];
	loading: boolean;
	error?: string;
	refetch: () => void;
} => {
	const { data, loading, refetch } = useListShelterWalksQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				order_by: "created_at",
				order_direction: "DESC",
				page: 0,
				page_size: PAGE_SIZE,
				filters: {
					join: [
						{
							key: "shelter_pets",
							value: {
								fixed: [{ key: "shelter_id", value: shelterId }],
							},
						},
					],
				},
			},
		},
	});

	const walks = (data?.listShelterWalks?.items ?? []).filter(
		(w): w is MinShelterWalkFragment => !!w
	);

	return {
		walks,
		loading,
		error: data?.listShelterWalks?.error?.message ?? undefined,
		refetch: () => refetch(),
	};
};
