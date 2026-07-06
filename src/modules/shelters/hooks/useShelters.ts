import { MinShelterFragment } from "@types";
import { useUserContext } from "@contexts";
import { useListSheltersQuery } from "../operations/__generated__/listShelters.generated";

const PAGE_SIZE = 30;

export const useShelters = (): {
	shelters: MinShelterFragment[];
	loading: boolean;
	error?: string;
} => {
	const { user } = useUserContext();

	const { data, loading } = useListSheltersQuery({
		skip: !user.id,
		variables: {
			commonSearch: {
				order_by: "name",
				order_direction: "ASC",
				page: 0,
				page_size: PAGE_SIZE,
				// solo shelter dove l'utente ha un ruolo (qualsiasi grado)
				filters: {
					join: [
						{
							key: "shelter_roles",
							value: {
								fixed: [
									{ key: "user_id", value: user.id },
								],
							},
						},
					],
				},
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
