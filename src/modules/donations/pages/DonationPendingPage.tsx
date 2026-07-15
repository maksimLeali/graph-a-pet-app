import { IonContent } from "@ionic/react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { $color, $uw } from "@theme";

import { DonationStatusView } from "../components/DonationStatusView";

// Pagina su cui Stripe reindirizza al termine del checkout (vedi
// success_url costruito in DonateCard + donation_id iniettato dal backend
// in domain/donations/checkout.py). Nessuna logica di conferma qui: è solo
// il contenitore per DonationStatusView, che fa polling dello stato reale.
export const DonationPendingPage: React.FC = () => {
	const { t } = useTranslation();
	const donationId = new URLSearchParams(useLocation().search).get(
		"donation_id"
	);

	return (
		<IonContent>
			<Wrap>
				{donationId ? (
					<DonationStatusView donationId={donationId} />
				) : (
					<ErrorText>{t("messages.errors.fetch")}</ErrorText>
				)}
			</Wrap>
		</IonContent>
	);
};

const Wrap = styled.div`
	width: 100%;
	min-height: 60vh;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${$uw(2)};
`;

const ErrorText = styled.span`
	font-size: 1.4rem;
	color: ${$color("danger")};
`;
