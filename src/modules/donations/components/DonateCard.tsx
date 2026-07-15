import { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Browser } from "@capacitor/browser";

import { useModal } from "@contexts";
import { Icon, Chip } from "@components";
import { I18NKey } from "@i18n";
import { DonationTargetType } from "@types";
import { $color, $uw } from "@theme";

import { useGetPublicDonationAvailabilityQuery } from "../operations/__generated__/getPublicDonationAvailability.generated";
import { useCreateAuthenticatedDonationMutation } from "../operations/__generated__/createAuthenticatedDonation.generated";
import { DonationAmountModal } from "./DonationAmountModal";
import { DonationStatusView } from "./DonationStatusView";
import { DONATION_SUCCESS_URL } from "../utils/donationSuccessUrl";
import { donationReasonI18NKey } from "../utils/donationAvailabilityReasons";
import { formatCents } from "../utils/formatCurrency";

const CURRENCY = "usd";
const MIN_CENTS = 100;

// festive palette for the goal-reached confetti — flat theme colors, no
// gradients (see [[flat-style-preference]]); one square per entry, cycled
const CONFETTI_COLORS = ["primary", "success", "warning", "danger", "primary", "success"];

type Props = {
	shelterId: string;
	petId?: string;
};

export const DonateCard: React.FC<Props> = ({ shelterId, petId }) => {
	const { t } = useTranslation();
	const { openModal, closeModal } = useModal();

	const { data, loading, refetch } = useGetPublicDonationAvailabilityQuery({
		variables: { shelter_id: shelterId, pet_id: petId },
		fetchPolicy: "cache-and-network",
		skip: !shelterId,
	});
	const [createDonation, { loading: creating }] =
		useCreateAuthenticatedDonationMutation();

	// il ritorno dal checkout Stripe hosted (chiuso dall'utente o redirect
	// automatico su alcune piattaforme) non conferma nulla di per sé — la
	// conferma è solo webhook-driven lato backend, mostrata dalla
	// DonationStatusView (già aperta sotto il Browser, vedi `donate`) — ma
	// è comunque il momento giusto per rinfrescare la disponibilità (es.
	// limite mensile aggiornato)
	useEffect(() => {
		const handle = Browser.addListener("browserFinished", () => {
			refetch();
		});
		return () => {
			handle.then((h) => h.remove());
		};
	}, [refetch]);

	const availability = data?.getPublicDonationAvailability?.availability;
	const isPet = !!petId;

	const progress = useMemo(() => {
		const limit = availability?.pet_monthly_limit_cents;
		const remaining = availability?.remaining_pet_allowance_cents;
		if (!isPet || limit == null || remaining == null || limit <= 0) return null;
		const raised = Math.max(limit - remaining, 0);
		return { limit, raised, pct: Math.min(Math.round((raised / limit) * 100), 100) };
	}, [isPet, availability?.pet_monthly_limit_cents, availability?.remaining_pet_allowance_cents]);

	const goalReached =
		isPet && !!availability?.reasons.includes("PET_LIMIT_REACHED");

	// anima la barra da 0 al valore reale dopo il primo paint
	const [fillWidth, setFillWidth] = useState(0);
	const targetPct = goalReached ? 100 : progress?.pct ?? 0;
	useEffect(() => {
		const id = requestAnimationFrame(() => setFillWidth(targetPct));
		return () => cancelAnimationFrame(id);
	}, [targetPct]);

	if (!shelterId || loading) return null;
	if (!availability) return null;

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
							onSettled={() => refetch()}
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

	// obiettivo del mese raggiunto → stato "missione compiuta", non un box grigio
	if (goalReached) {
		return (
			<Celebration role="status">
				<Confetti aria-hidden>
					{CONFETTI_COLORS.map((c, i) => (
						<Piece key={i} $hue={c} $i={i} />
					))}
				</Confetti>
				<Trophy>
					<Icon name="trophy" color="success" size="34px" />
				</Trophy>
				<CelebrationTitle>{t("donations.goal_reached_title")}</CelebrationTitle>
				<CelebrationText>{t("donations.goal_reached_subtitle")}</CelebrationText>
				<Track $tone="success">
					<Fill $tone="success" style={{ transform: `scaleX(${fillWidth / 100})` }} />
				</Track>
			</Celebration>
		);
	}

	// altri motivi di indisponibilità: mostra comunque il box con il motivo
	// (mai far sparire del tutto la sezione donazioni)
	if (!availability.available) {
		const reason = availability.reasons[0];
		return (
			<Card className="unavailable">
				<Head>
					<HeartBadge className="muted">
						<Icon name="heartDislikeOutline" color="light" size="18px" />
					</HeartBadge>
					<Titles>
						<Title>
							{isPet
								? t("donations.pet_cta_title")
								: t("donations.shelter_cta_title")}
						</Title>
						<Subtitle>
							{reason
								? t(donationReasonI18NKey(reason))
								: t("donations.unavailable_title")}
						</Subtitle>
					</Titles>
				</Head>
			</Card>
		);
	}

	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (!creating) donate();
		}
	};

	return (
		<Card
			className={`pressable${creating ? " busy" : ""}`}
			role="button"
			tabIndex={0}
			aria-disabled={creating}
			aria-label={t("donations.cta") ?? "Dona"}
			onClick={() => !creating && donate()}
			onKeyDown={handleKey}
		>
			<Head>
				<HeartBadge>
					<Icon name="heart" color="light" size="18px" />
				</HeartBadge>
				<Titles>
					<Title>
						{isPet
							? t("donations.pet_cta_title")
							: t("donations.shelter_cta_title")}
					</Title>
					<Subtitle>
						{isPet
							? t("donations.pet_cta_subtitle")
							: t("donations.shelter_cta_subtitle")}
					</Subtitle>
				</Titles>
				{availability.is_test_mode && (
					<Chip label={t("donations.test_mode_badge") ?? ""} color="warning" />
				)}
				<Icon name="chevronForward" color="primary" size="20px" />
			</Head>

			{progress && (
				<Progress>
					<ProgressRow>
						<Raised>
							{t("donations.pet_progress_raised", {
								amount: formatCents(progress.raised, CURRENCY),
							})}
						</Raised>
						<Goal>
							{t("donations.pet_progress_goal", {
								amount: formatCents(progress.limit, CURRENCY),
							})}
						</Goal>
					</ProgressRow>
					<Track
						$tone="primary"
						role="progressbar"
						aria-valuenow={progress.pct}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<Fill $tone="primary" style={{ transform: `scaleX(${fillWidth / 100})` }} />
					</Track>
				</Progress>
			)}
		</Card>
	);
};

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
	padding: ${$uw(1.75)};
	border-radius: 16px;
	background: rgba(var(--ion-color-primary-rgb), 0.05);
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.22);
	&.unavailable {
		background: rgba(var(--ion-color-dark-rgb), 0.04);
		border-color: rgba(var(--ion-color-dark-rgb), 0.12);
	}
	&.pressable {
		cursor: pointer;
		transition: transform 0.15s ease, border-color 0.15s ease;
	}
	&.pressable:active {
		transform: scale(0.985);
		border-color: rgba(var(--ion-color-primary-rgb), 0.5);
	}
	&.busy {
		opacity: 0.6;
		pointer-events: none;
	}
`;

const Head = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
`;

const HeartBadge = styled.div`
	flex: 0 0 auto;
	width: ${$uw(3.25)};
	height: ${$uw(3.25)};
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
	&.muted {
		background: ${$color("medium")};
	}
	> .icon {
		width: 55%;
		height: 55%;
	}
`;

const Titles = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const Title = styled.b`
	font-size: 1.6rem;
	color: ${$color("dark")};
	line-height: 1.2;
`;

const Subtitle = styled.span`
	font-size: 1.3rem;
	line-height: 1.35;
	color: ${$color("dark")};
	opacity: 0.72;
`;

const Progress = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const ProgressRow = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const Raised = styled.b`
	font-size: 1.6rem;
	color: ${$color("primary")};
`;

const Goal = styled.span`
	font-size: 1.3rem;
	color: ${$color("dark")};
	opacity: 0.7;
`;

const Track = styled.div<{ $tone: string }>`
	width: 100%;
	height: ${$uw(1)};
	border-radius: 999px;
	overflow: hidden;
	background: ${({ $tone }) => `rgba(var(--ion-color-${$tone}-rgb), 0.15)`};
`;

const Fill = styled.div<{ $tone: string }>`
	width: 100%;
	height: 100%;
	transform-origin: left center;
	background: ${({ $tone }) => $color($tone)};
	transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

// --- celebration ---------------------------------------------------------

const pop = keyframes`
	0% { transform: scale(0.4); opacity: 0; }
	60% { transform: scale(1.15); opacity: 1; }
	100% { transform: scale(1); opacity: 1; }
`;

const fall = keyframes`
	0% { transform: translateY(-120%) rotate(0deg); opacity: 0; }
	15% { opacity: 1; }
	100% { transform: translateY(320%) rotate(320deg); opacity: 0; }
`;

const Celebration = styled.div`
	position: relative;
	overflow: hidden;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: ${$uw(1)};
	padding: ${$uw(2.5)} ${$uw(1.75)};
	border-radius: 16px;
	background: rgba(var(--ion-color-success-rgb), 0.1);
	border: 1px solid rgba(var(--ion-color-success-rgb), 0.35);
`;

const Trophy = styled.div`
	width: ${$uw(5)};
	height: ${$uw(5)};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--ion-color-success-rgb), 0.18);
	animation: ${pop} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
	> .icon {
		width: 60%;
		height: 60%;
	}
	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

const CelebrationTitle = styled.b`
	font-size: 1.9rem;
	color: ${$color("success-shade")};
	text-wrap: balance;
`;

const CelebrationText = styled.span`
	font-size: 1.4rem;
	line-height: 1.4;
	color: ${$color("dark")};
	opacity: 0.78;
	max-width: 32ch;
`;

const Confetti = styled.div`
	position: absolute;
	inset: 0;
	pointer-events: none;
	@media (prefers-reduced-motion: reduce) {
		display: none;
	}
`;

const Piece = styled.span<{ $hue: string; $i: number }>`
	position: absolute;
	top: 0;
	left: ${({ $i }) => 8 + $i * 15}%;
	width: 8px;
	height: 8px;
	border-radius: 2px;
	background: ${({ $hue }) => $color($hue)};
	animation: ${fall} ${({ $i }) => 1.6 + ($i % 3) * 0.35}s
		cubic-bezier(0.4, 0, 0.7, 1) ${({ $i }) => $i * 0.12}s infinite;
`;
