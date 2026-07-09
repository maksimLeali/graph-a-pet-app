import { useUserContext } from "@contexts";
import { RoleLevel, UserRole } from "@types";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";

export const useMyShelterRole = (
	shelterId?: string
): { role: RoleLevel | null; loading: boolean; isMember: boolean } => {
	const { user } = useUserContext();
	const isAdmin = user.role === UserRole.Admin;
	// user context is hydrated from cookie via an effect, so on first render
	// (e.g. right after a page refresh) user.id is briefly empty; treat that
	// as still-loading instead of "not a member" to avoid a premature redirect.
	const hydrating = !user.id;

	const { data, loading } = useListShelterRolesMinQuery({
		skip: !shelterId || !user.id || isAdmin,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 1,
				filters: {
					fixed: [
						{ key: "shelter_id", value: shelterId as string },
						{ key: "user_id", value: user.id },
					],
				},
			},
		},
	});

	const role = data?.listShelterRoles?.items?.filter(
		(r): r is NonNullable<typeof r> => !!r
	)[0]?.role ?? null;

	return {
		role: isAdmin ? RoleLevel.Owner : role,
		loading: isAdmin ? false : hydrating || loading,
		isMember: isAdmin || !!role,
	};
};
