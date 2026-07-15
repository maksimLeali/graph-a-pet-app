import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonSpinner } from "@ionic/react";

import { Icon } from "@components";
import { DonationStatus } from "@types";
import { $color, $uw } from "@theme";

import { useGetMyDonationStatusQuery } from "../operations/__generated__/getMyDonationStatus.generated";
import { formatCents } from "../utils/formatCurrency";

const POLL_INTERVAL_MS = 20_000;
const TERMINAL_STATUSES = [
	DonationStatus.Succeeded,
	DonationStatus.Failed,
	DonationStatus.Canceled,
];

type Props = {
	donationId: string;
	onSettled?: (status: DonationStatus) => void;
};

// Il redirect Stripe (success_url) non è affidabile per confermare un
// pagamento: la conferma è solo webhook-driven lato backend (vedi
// domain/donations/webhooks.py) — questa vista fa solo polling dello stato
// finché non arriva. Usata in due punti: come contenuto della modale aperta
// PRIMA di Stripe (vedi DonateCard, resta montata sotto il Browser in-app) e
// come contenuto della pagina /donations/pending su cui Stripe stesso
// reindirizza al termine del checkout (vedi pages/DonationPendingPage).
export const DonationStatusView: React.FC<Props> = ({
	donationId,
	onSettled,
}) => {
	const { t } = useTranslation();
	const { data, loading, stopPolling } = useGetMyDonationStatusQuery({
		variables: { donation_id: donationId },
		pollInterval: POLL_INTERVAL_MS,
		fetchPolicy: "network-only",
		notifyOnNetworkStatusChange: true,
	});

	const result = data?.getMyDonationStatus;
	const status = result?.donation?.status;
	const isTerminal = !!status && TERMINAL_STATUSES.includes(status);

	useEffect(() => {
		if (isTerminal) {
			stopPolling();
			onSettled?.(status as DonationStatus);
		}
	}, [isTerminal, status, stopPolling, onSettled]);

	if (status === DonationStatus.Succeeded) {
		return (
			<Wrap>
				<Icon name="checkmarkCircle" color="success" size="48px" />
				<Title>{t("donations.pending.succeeded_title") ?? "Donazione confermata!"}</Title>
				{result?.donation && (
					<Amount>
						{formatCents(
							result.donation.gross_amount_cents,
							result.donation.currency
						)}
					</Amount>
				)}
			</Wrap>
		);
	}

	if (status === DonationStatus.Failed || status === DonationStatus.Canceled) {
		return (
			<Wrap>
				<Icon name="closeCircle" color="danger" size="48px" />
				<Title>{t("donations.pending.failed_title") ?? "Pagamento non riuscito"}</Title>
				<Subtitle>
					{t("donations.pending.failed_subtitle") ??
						"Nessun addebito è stato effettuato. Riprova pure."}
				</Subtitle>
			</Wrap>
		);
	}

	if (!loading && !result?.success) {
		return (
			<Wrap>
				<Icon name="closeCircle" color="danger" size="48px" />
				<Title>{t("messages.errors.fetch")}</Title>
			</Wrap>
		);
	}

	return (
		<Wrap>
			<IonSpinner name="crescent" color="primary" />
			<Title>{t("donations.pending.waiting_title") ?? "Verifica del pagamento in corso…"}</Title>
			<Subtitle>
				{t("donations.pending.waiting_subtitle") ??
					"Puoi chiudere questa schermata, ti avviseremo appena confermato."}
			</Subtitle>
		</Wrap>
	);
};

const Wrap = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(2)};
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: ${$uw(1)};

	ion-spinner {
		width: 48px;
		height: 48px;
	}
`;

const Title = styled.b`
	font-size: 1.7rem;
	color: ${$color("dark")};
`;

const Subtitle = styled.span`
	font-size: 1.3rem;
	color: ${$color("medium")};
`;

const Amount = styled.span`
	font-size: 2rem;
	font-weight: 700;
	color: ${$color("primary")};
`;
