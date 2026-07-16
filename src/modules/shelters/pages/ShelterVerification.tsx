import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Chip, TextInput, PullToRefresh } from "@components";
import { ShelterVerificationStatus } from "@types";
import { $color, $uw } from "@theme";

import { useGetShelterQuery } from "../operations/__generated__/getShelter.generated";
import { useListShelterClaimRequestsQuery } from "../operations/__generated__/listShelterClaimRequests.generated";
import {
	useRequestShelterClaimMutation,
	useCancelShelterClaimMutation,
} from "../operations/__generated__/shelterClaimRequest.generated";

export const ShelterVerification: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();

	useEffect(() => {
		setPage({ name: t("shelters.tabs.verification") });
	}, []);

	const { data, loading } = useGetShelterQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { id },
	});
	const shelter = data?.getShelter?.shelter ?? undefined;
	const isVerified =
		!!shelter && shelter.verification_status === ShelterVerificationStatus.Verified;

	const {
		data: claimsData,
		loading: loadingClaims,
		refetch: refetchClaims,
	} = useListShelterClaimRequestsQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			shelter_id: id,
			search: {
				page: 0,
				page_size: 5,
				filters: { fixed: [{ key: "status", value: "PENDING" }] },
			},
		},
	});
	const pendingClaim = (claimsData?.listShelterClaimRequests?.items ?? []).filter(
		(c): c is NonNullable<typeof c> => !!c
	)[0];
	const fetchError = claimsData?.listShelterClaimRequests?.error?.message;

	const [requestClaim, { loading: requestingClaim }] = useRequestShelterClaimMutation();
	const [cancelClaim] = useCancelShelterClaimMutation();

	const [showForm, setShowForm] = useState(false);
	const [message, setMessage] = useState("");
	const [proof, setProof] = useState("");

	const onRequest = async () => {
		const res = await requestClaim({
			variables: {
				shelter_id: id,
				data: {
					message: message || undefined,
					proof_data: proof ? { details: proof } : undefined,
				},
			},
		});
		const result = res.data?.requestShelterClaim;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.claim.requested_ok"));
		setShowForm(false);
		setMessage("");
		setProof("");
		refetchClaims();
	};

	const onCancel = async () => {
		if (!pendingClaim) return;
		const res = await cancelClaim({ variables: { id: pendingClaim.id } });
		const result = res.data?.cancelShelterClaim;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.claim.cancelled_ok"));
		refetchClaims();
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2 className={loading ? "skeleton" : ""}>
					{shelter ? t("shelters.claim.title") : ""}
				</h2>
				{shelter && (
					<Chip
						label={t(
							isVerified ? "shelters.badges.verified" : "shelters.badges.unverified"
						)}
						color={isVerified ? "success" : "warning"}
					/>
				)}
			</Header>

			{!loadingClaims && fetchError && <Message>{fetchError}</Message>}

			{shelter && isVerified && (
				<Message>{t("shelters.claim.already_verified")}</Message>
			)}

			{shelter && !isVerified && (
				<Section>
					{pendingClaim ? (
						<Banner>
							<span>{t("shelters.claim.pending")}</span>
							<CancelBtn type="button" onClick={onCancel}>
								{t("shelters.claim.cancel")}
							</CancelBtn>
						</Banner>
					) : showForm ? (
						<Form>
							<TextInput
								ntTextLabel={t("shelters.claim.message_placeholder") ?? ""}
								value={message}
								onChange={setMessage}
							/>
							<TextInput
								ntTextLabel={t("shelters.claim.proof_placeholder") ?? ""}
								value={proof}
								onChange={setProof}
							/>
							<FormActions>
								<SaveBtn type="button" disabled={requestingClaim} onClick={onRequest}>
									{t("shelters.claim.send_request")}
								</SaveBtn>
								<CancelBtn type="button" onClick={() => setShowForm(false)}>
									{t("actions.cancel")}
								</CancelBtn>
							</FormActions>
						</Form>
					) : (
						<StartBtn type="button" onClick={() => setShowForm(true)}>
							{t("shelters.claim.request_verification")}
						</StartBtn>
					)}
				</Section>
			)}
		</IonContent>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(2)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
		min-height: 28px;
	}
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px;
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(2)} 12px;
	color: ${$color("medium")};
`;

const Banner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.25)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	> span {
		font-size: 1.4rem;
		color: ${$color("dark")};
	}
`;

const Form = styled.div`
	display: flex;
	flex-direction: column;
`;

const FormActions = styled.div`
	display: flex;
	gap: ${$uw(1)};
`;

const SaveBtn = styled.button`
	border: none;
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;

const CancelBtn = styled.button`
	border: 1px solid ${$color("medium")};
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: transparent;
	color: ${$color("medium")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;

const StartBtn = styled.button`
	border: none;
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;
