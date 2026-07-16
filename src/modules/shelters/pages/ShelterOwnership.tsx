import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { SelectInput, Option, PullToRefresh } from "@components";
import { I18NKey } from "@i18n";
import { RoleLevel } from "@types";
import { $color, $uw } from "@theme";

import { useGetShelterQuery } from "../operations/__generated__/getShelter.generated";
import { useListShelterOwnershipTransfersQuery } from "../operations/__generated__/listShelterOwnershipTransfers.generated";
import {
	useRequestShelterOwnershipTransferMutation,
	useCancelShelterOwnershipTransferMutation,
} from "../operations/__generated__/shelterOwnershipTransfer.generated";

export const ShelterOwnership: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage, user } = useUserContext();

	useEffect(() => {
		setPage({ name: t("shelters.tabs.ownership") });
	}, []);

	const { data, loading } = useGetShelterQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { id },
	});
	const shelter = data?.getShelter?.shelter ?? undefined;
	const roles = (shelter?.roles?.items ?? []).filter(
		(r): r is NonNullable<typeof r> => !!r
	);

	const {
		data: transfersData,
		loading: loadingTransfers,
		refetch: refetchTransfers,
	} = useListShelterOwnershipTransfersQuery({
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
	const pendingTransfer = (transfersData?.listShelterOwnershipTransfers?.items ?? []).filter(
		(pt): pt is NonNullable<typeof pt> => !!pt
	)[0];
	const fetchError = transfersData?.listShelterOwnershipTransfers?.error?.message;

	const [requestTransfer, { loading: requestingTransfer }] =
		useRequestShelterOwnershipTransferMutation();
	const [cancelTransfer] = useCancelShelterOwnershipTransferMutation();

	const [showForm, setShowForm] = useState(false);
	const [targetUserId, setTargetUserId] = useState("");
	const [newRoleForPreviousOwner, setNewRoleForPreviousOwner] = useState("");

	const onRequest = async () => {
		if (!targetUserId) {
			toast.error(t("shelters.ownership.target_required"));
			return;
		}
		const res = await requestTransfer({
			variables: {
				shelter_id: id,
				to_user_id: targetUserId,
				new_role_for_previous_owner: newRoleForPreviousOwner
					? (newRoleForPreviousOwner as RoleLevel)
					: undefined,
			},
		});
		const result = res.data?.requestShelterOwnershipTransfer;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.ownership.requested_ok"));
		setShowForm(false);
		setTargetUserId("");
		setNewRoleForPreviousOwner("");
		refetchTransfers();
	};

	const onCancel = async () => {
		if (!pendingTransfer) return;
		const res = await cancelTransfer({ variables: { id: pendingTransfer.id } });
		const result = res.data?.cancelShelterOwnershipTransfer;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.ownership.cancelled_ok"));
		refetchTransfers();
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2 className={loading ? "skeleton" : ""}>
					{shelter ? t("shelters.ownership.title") : ""}
				</h2>
			</Header>

			{!loadingTransfers && fetchError && <Message>{fetchError}</Message>}

			{shelter && (
				<Section>
					{pendingTransfer ? (
						<TransferBanner>
							<span>
								{t("shelters.ownership.pending_to", {
									name: `${pendingTransfer.to_user.first_name} ${pendingTransfer.to_user.last_name}`.trim(),
								})}
							</span>
							<CancelBtn type="button" onClick={onCancel}>
								{t("shelters.ownership.cancel")}
							</CancelBtn>
						</TransferBanner>
					) : showForm ? (
						<Form>
							<SelectInput
								ntTextLabel={t("shelters.ownership.choose_user") ?? ""}
								currentValue={targetUserId || null}
								onSelected={(v) => setTargetUserId(v ?? "")}
								options={roles
									.filter((r) => r.user.id !== user.id)
									.map((r): Option => ({
										value: r.user.id,
										label: `${r.user.first_name} ${r.user.last_name}`.trim(),
									}))}
							/>
							<SelectInput
								ntTextLabel={t("shelters.ownership.role_removed") ?? ""}
								currentValue={newRoleForPreviousOwner || null}
								onSelected={(v) => setNewRoleForPreviousOwner(v ?? "")}
								options={Object.values(RoleLevel)
									.filter((r) => r !== RoleLevel.Owner)
									.map((r): Option => ({
										value: r,
										label: t(`shelters.roles.${r.toLowerCase()}` as I18NKey),
									}))}
							/>
							<FormActions>
								<SaveBtn
									type="button"
									disabled={requestingTransfer}
									onClick={onRequest}
								>
									{t("shelters.ownership.send_request")}
								</SaveBtn>
								<CancelBtn type="button" onClick={() => setShowForm(false)}>
									{t("actions.cancel")}
								</CancelBtn>
							</FormActions>
						</Form>
					) : (
						<StartBtn type="button" onClick={() => setShowForm(true)}>
							{t("shelters.ownership.transfer")}
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
	color: ${$color("danger")};
`;

const TransferBanner = styled.div`
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
