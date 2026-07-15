import { I18NKey } from "@i18n";

// Reason strings come from domain/donations/public.get_public_donation_availability
// (backend) as free-form strings, not typed error codes — keep this list in
// sync with that function if new reasons are added server-side.
const KNOWN_REASONS = [
	"SHELTER_NOT_AVAILABLE",
	"CONNECTED_ACCOUNT_MISSING",
	"SHELTER_DONATIONS_DISABLED",
	"STRIPE_CHARGES_NOT_ENABLED",
	"PET_NOT_PUBLISHED",
	"PET_LIMIT_REACHED",
	"FUNDING_NEED_NOT_ACTIVE",
] as const;

export const donationReasonI18NKey = (reason: string): I18NKey =>
	(KNOWN_REASONS as readonly string[]).includes(reason)
		? (`donations.reasons.${reason}` as I18NKey)
		: ("donations.reasons.generic" as I18NKey);
