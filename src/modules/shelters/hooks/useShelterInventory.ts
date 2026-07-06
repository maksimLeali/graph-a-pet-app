import { useListShelterInventoryItemsQuery } from "../operations/__generated__/listShelterInventoryItems.generated";
import { MinInventoryItemFragment } from "../operations/__generated__/MinInventoryItem.generated";

const PAGE_SIZE = 100;

export const useShelterInventory = (
	shelterId: string
): {
	items: MinInventoryItemFragment[];
	loading: boolean;
	error?: string;
	refetch: () => void;
} => {
	const { data, loading, refetch } = useListShelterInventoryItemsQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				order_by: "name",
				order_direction: "ASC",
				page: 0,
				page_size: PAGE_SIZE,
				filters: {
					fixed: [{ key: "shelter_id", value: shelterId }],
				},
			},
		},
	});

	const items = (data?.listShelterInventoryItems?.items ?? []).filter(
		(i): i is MinInventoryItemFragment => !!i
	);

	return {
		items,
		loading,
		error: data?.listShelterInventoryItems?.error?.message ?? undefined,
		refetch: () => refetch(),
	};
};
