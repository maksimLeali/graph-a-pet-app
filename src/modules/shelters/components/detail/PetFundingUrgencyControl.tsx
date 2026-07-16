import { useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Icon } from "@components";
import { FundingNeedStatus, FundingNeedUrgency } from "@types";
import { $color, $uw } from "@theme";

import { useListFundingNeedsQuery } from "../../../donations/operations/__generated__/listFundingNeeds.generated";
import { useUpdateFundingNeedMutation } from "../../../donations/operations/__generated__/updateFundingNeed.generated";
import { useShelterAuthorization } from "../../hooks/useShelterAuthorization";

type Props = {
	shelterId: string;
	/** pet id (matches PetFundingNeed.pet_id, not the shelter_pet id) */
	petId?: string;
};

/**
 * Manager/owner control to flag a pet's active donation goal ("traguardo")
 * as urgent. Rendered only for users with `shelters.funding_needs.update`;
 * the backend remains the final authority (a FORBIDDEN response is toasted).
 */
export const PetFundingUrgencyControl: React.FC<Props> = ({
	shelterId,
	petId,
}) => {
	const { t } = useTranslation();
	const { can } = useShelterAuthorization(shelterId);
	const canUpdate = can("shelters.funding_needs.update");

	const { data, refetch } = useListFundingNeedsQuery({
		skip: !shelterId || !petId || !canUpdate,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId, status: FundingNeedStatus.Active },
	});

	const need = useMemo(
		() =>
			(data?.listFundingNeeds?.items ?? [])
				.filter((n): n is NonNullable<typeof n> => !!n)
				.find((n) => n.pet_id === petId),
		[data, petId]
	);

	const [update, { loading }] = useUpdateFundingNeedMutation();

	if (!canUpdate) return null;

	const setUrgency = async (urgency: FundingNeedUrgency) => {
		if (!need || need.urgency === urgency || loading) return;
		try {
			const { data: res } = await update({
				variables: { id: need.id, data: { urgency } },
			});
			if (!res?.updateFundingNeed?.success) {
				throw new Error(res?.updateFundingNeed?.error?.message ?? "error");
			}
			toast.success(t("donations.urgency.updated"));
			refetch();
		} catch {
			toast.error(t("donations.urgency.error"));
		}
	};

	return (
		<Wrap>
			<Head>
				<Icon name="alertCircleOutline" color="primary" size="18px" />
				<Title>{t("donations.urgency.title")}</Title>
			</Head>
			{need ? (
				<>
					<Hint>{t("donations.urgency.hint")}</Hint>
					<Segment role="group">
						<SegBtn
							type="button"
							$active={need.urgency === FundingNeedUrgency.Normal}
							disabled={loading}
							onClick={() => setUrgency(FundingNeedUrgency.Normal)}
						>
							{t("donations.urgency.normal")}
						</SegBtn>
						<SegBtn
							type="button"
							$active={need.urgency === FundingNeedUrgency.Urgent}
							$danger
							disabled={loading}
							onClick={() => setUrgency(FundingNeedUrgency.Urgent)}
						>
							{t("donations.urgency.urgent")}
						</SegBtn>
					</Segment>
				</>
			) : (
				<Empty>{t("donations.urgency.no_goal")}</Empty>
			)}
		</Wrap>
	);
};

const Wrap = styled.div`
	width: 100%;
	box-sizing: border-box;
	margin-top: ${$uw(1)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const Head = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
`;

const Title = styled.span`
	font-size: 1.2rem;
	font-weight: 700;
	color: ${$color("dark")};
`;

const Hint = styled.span`
	font-size: 1.1rem;
	color: ${$color("medium")};
`;

const Empty = styled.span`
	font-size: 1.1rem;
	color: ${$color("medium")};
`;

const Segment = styled.div`
	display: flex;
	gap: ${$uw(0.5)};
`;

const SegBtn = styled.button<{ $active?: boolean; $danger?: boolean }>`
	flex: 1 1 0;
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 12px;
	font-size: 1.2rem;
	font-weight: 700;
	cursor: pointer;
	border: 1px solid
		${({ $active, $danger }) =>
			$active
				? $danger
					? $color("status.danger")
					: $color("primary")
				: $color("light-shade")};
	color: ${({ $active, $danger }) =>
		$active
			? $danger
				? $color("status.danger")
				: $color("primary")
			: $color("medium")};
	background: ${({ $active, $danger }) =>
		$active
			? $danger
				? $color("status.dangerBg")
				: "rgba(var(--ion-color-primary-rgb), 0.12)"
			: "transparent"};
	&:active {
		opacity: 0.8;
	}
	&:disabled {
		opacity: 0.6;
		pointer-events: none;
	}
`;
