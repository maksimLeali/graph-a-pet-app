/**
 * Maps a backend structured error to a user-facing message.
 *
 * The backend now returns `{ code, errorCode, message, extra }` on the `error`
 * field of every *Result payload (see graph-a-pet-backend/api/errors). Prefer a
 * localized message keyed by the machine `errorCode`; fall back to the raw
 * backend `message`, then to a generic key.
 *
 * Usage:
 *   import { shelterErrorMessage } from "../utils/shelterError";
 *   if (!res?.success || res.error) toast.error(shelterErrorMessage(res?.error, t));
 */
export type BackendError = {
	code?: string | null;
	errorCode?: string | null;
	message?: string | null;
	extra?: string | null;
} | null | undefined;

// errorCode -> i18n key under `shelters.errors.*`
export const SHELTER_ERROR_KEYS: Record<string, string> = {
	UNAUTHORIZED: "shelters.errors.unauthorized",
	FORBIDDEN: "shelters.errors.forbidden",
	NOT_FOUND: "shelters.errors.not_found",
	VALIDATION_ERROR: "shelters.errors.validation",
	BOX_FULL: "shelters.errors.box_full",
	BOX_OUT_OF_SERVICE: "shelters.errors.box_out_of_service",
	PET_ALREADY_ASSIGNED: "shelters.errors.pet_already_assigned",
	PET_NOT_ASSIGNED: "shelters.errors.pet_not_assigned",
	INSUFFICIENT_STOCK: "shelters.errors.insufficient_stock",
	DUPLICATE_TASK_INSTANCE: "shelters.errors.duplicate_task_instance",
	INVALID_RECURRENCE_RULE: "shelters.errors.invalid_recurrence_rule",
	CANNOT_DELETE_WITH_ACTIVE_OCCUPANCY: "shelters.errors.cannot_delete_active_occupancy",
	CANNOT_DELETE_WITH_HISTORY: "shelters.errors.cannot_delete_with_history",
};

/**
 * @param error   the backend `error` object
 * @param t       i18n translator (falls back to backend message if the key is missing)
 * @param generic i18n key used when no code/message is available
 */
export function shelterErrorMessage(
	error: BackendError,
	t: (key: string) => string,
	generic = "messages.errors.fetch",
): string {
	if (error?.errorCode && SHELTER_ERROR_KEYS[error.errorCode]) {
		const key = SHELTER_ERROR_KEYS[error.errorCode];
		const translated = t(key);
		// i18n libs return the key itself when missing — prefer backend message then
		if (translated && translated !== key) return translated;
	}
	if (error?.message) return error.message;
	return t(generic);
}
