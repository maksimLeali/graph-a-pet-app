import { useCallback } from "react";
import { useMyShelterAuthorizationQuery } from "../operations/__generated__/myShelterAuthorization.generated";

/**
 * Effective RBAC permissions of the current user on one shelter.
 *
 * The permission set comes from the backend (`myShelterAuthorization`);
 * the frontend never derives capabilities from role names. Usage:
 *
 *   const { can, loading } = useShelterAuthorization(shelterId);
 *   if (can("shelters.tasks.create")) { ... }
 *
 * After a role/membership mutation call `refetch()` so menus and CTAs update.
 * A FORBIDDEN response from a mutation must still be handled: the backend is
 * the final authority.
 */
export const useShelterAuthorization = (
	shelterId?: string
): {
	can: (permission: string) => boolean;
	permissions: string[];
	membershipStatus: string | null;
	loading: boolean;
	error?: string;
	refetch: () => void;
} => {
	const { data, loading, error, refetch } = useMyShelterAuthorizationQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId as string },
	});

	const payload = data?.myShelterAuthorization;
	const permissions = (payload?.authorization?.permissions ?? []).filter(
		(p): p is string => !!p
	);

	const can = useCallback(
		(permission: string) => permissions.includes(permission),
		[permissions]
	);

	return {
		can,
		permissions,
		membershipStatus: payload?.authorization?.membership_status ?? null,
		loading,
		error: error?.message ?? payload?.error?.message ?? undefined,
		refetch,
	};
};
