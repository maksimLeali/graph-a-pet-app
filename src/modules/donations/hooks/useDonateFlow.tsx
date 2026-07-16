import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Browser } from "@capacitor/browser";

import { useModal } from "@contexts";
import { I18NKey } from "@i18n";
import { DonationTargetType } from "@types";

import { useCreateAuthenticatedDonationMutation } from "../operations/__generated__/createAuthenticatedDonation.generated";
import { DonationAmountModal } from "../components/DonationAmountModal";
import { DonationStatusView } from "../components/DonationStatusView";
import { DONATION_SUCCESS_URL } from "../utils/donationSuccessUrl";

export const CURRENCY = "usd";
export const MIN_CENTS = 100;

type donateFlowArgs = {
	shelterId: string;
	petId?: string;
	fundingNeedId?: string;
	onSettled?: () => void;
};

/**
 * Flusso di donazione riusabile (modal importo → checkout Stripe →
 * schermata di attesa webhook-driven). La conferma non dipende mai dal
 * redirect di Stripe: solo dal polling di DonationStatusView.
 * Gestisce anche FORBIDDEN/insuccesso della mutation via toast.
 */
export const useDonateFlow = ({
	shelterId,
	petId,
	fundingNeedId,
	onSettled,
}: donateFlowArgs): { donate: () => void; creating: boolean } => {
	const { t } = useTranslation();
	const { openModal, closeModal } = useModal();
	const [createDonation, { loading: creating }] =
		useCreateAuthenticatedDonationMutation();

	const donate = () => {
		const amount = { current: 1000 };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				if (amount.current < MIN_CENTS) return;
				const res = await createDonation({
					variables: {
						data: {
							shelter_id: shelterId,
							target_type: petId
								? DonationTargetType.Pet
								: DonationTargetType.Shelter,
							pet_id: petId,
							funding_need_id: fundingNeedId,
							amount_cents: amount.current,
							currency: CURRENCY,
							success_url: DONATION_SUCCESS_URL,
						},
					},
				});
				const result = res.data?.createAuthenticatedDonation;
				if (!result?.success || !result.checkout_url || !result.donation) {
					toast.error(
						result?.error?.message
							? t(result.error.message as I18NKey)
							: t("messages.errors.fetch")
					);
					return;
				}
				// mostra subito la schermata di attesa (poll ogni 20s, vedi
				// DonationStatusView) e apre Stripe sopra: la conferma non
				// dipende dal contenuto della pagina di redirect di Stripe
				const donationId = result.donation.id;
				openModal({
					onClose: closeModal,
					children: (
						<DonationStatusView
							donationId={donationId}
							onSettled={() => onSettled?.()}
						/>
					),
				});
				await Browser.open({ url: result.checkout_url });
			},
			children: (
				<DonationAmountModal
					currency={CURRENCY}
					onChange={(cents) => (amount.current = cents)}
				/>
			),
		});
	};

	return { donate, creating };
};
