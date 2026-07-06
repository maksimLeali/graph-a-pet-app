import { useListShelterTasksQuery } from "../operations/__generated__/listShelterTasks.generated";
import { MinShelterTaskFragment } from "../operations/__generated__/MinShelterTask.generated";

const PAGE_SIZE = 50;

export const useShelterTasks = (
	shelterId: string
): {
	tasks: MinShelterTaskFragment[];
	loading: boolean;
	error?: string;
	refetch: () => void;
} => {
	const { data, loading, refetch } = useListShelterTasksQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				order_by: "scheduled_at",
				order_direction: "ASC",
				page: 0,
				page_size: PAGE_SIZE,
				filters: {
					fixed: [{ key: "shelter_id", value: shelterId }],
				},
			},
		},
	});

	const tasks = (data?.listShelterTasks?.items ?? []).filter(
		(t): t is MinShelterTaskFragment => !!t
	);

	return {
		tasks,
		loading,
		error: data?.listShelterTasks?.error?.message ?? undefined,
		refetch: () => refetch(),
	};
};
