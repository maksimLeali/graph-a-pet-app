import { MinShelterFragment } from "@types";
import { useListSheltersQuery } from "../operations/__generated__/listShelters.generated";

const PAGE_SIZE = 30;

export const useShelters = (): {
	shelters: MinShelterFragment[];
	loading: boolean;
	error?: string;
} => {
	const { data, loading } = useListSheltersQuery({
		variables: {
			commonSearch: {
				order_by: "name",
				order_direction: "ASC",
				page: 0,
				page_size: PAGE_SIZE,
			},
		},
	});

	const shelters = (data?.listShelters?.items ?? []).filter(
		(s): s is MinShelterFragment => !!s
	);

	return {
		shelters,
		loading,
		error: data?.listShelters?.error?.message ?? undefined,
	};
};
