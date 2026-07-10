import { useListOperationalShelterTasksQuery } from "../operations/__generated__/listOperationalShelterTasks.generated";
import { MinShelterTaskFragment } from "../operations/__generated__/MinShelterTask.generated";

export const useShelterTasks = (
	shelterId: string
): {
	tasks: MinShelterTaskFragment[];
	loading: boolean;
	error?: string;
	refetch: () => void;
} => {
	const { data, loading, refetch } = useListOperationalShelterTasksQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId },
	});

	const tasks = (data?.listOperationalShelterTasks?.items ?? []).filter(
		(t): t is MinShelterTaskFragment => !!t
	);

	return {
		tasks,
		loading,
		error: data?.listOperationalShelterTasks?.error?.message ?? undefined,
		refetch: () => refetch(),
	};
};
