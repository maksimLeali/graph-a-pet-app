import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { WalkCard } from "../components/WalkCard";
import { useShelterWalks } from "../hooks/useShelterWalks";
import { useListPetsNeedingWalkQuery } from "../operations/__generated__/listPetsNeedingWalk.generated";
import { useCreateShelterWalkMutation } from "../operations/__generated__/createShelterWalk.generated";
import { useStartShelterWalkMutation } from "../operations/__generated__/startShelterWalk.generated";
import { useCompleteShelterWalkMutation } from "../operations/__generated__/completeShelterWalk.generated";
import { useCancelShelterWalkMutation } from "../operations/__generated__/cancelShelterWalk.generated";
import { useDeleteShelterWalkMutation } from "../operations/__generated__/deleteShelterWalk.generated";

export const ShelterWalksList: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { walks, loading, error, refetch } = useShelterWalks(id);

	const { data: needData, refetch: refetchNeed } = useListPetsNeedingWalkQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: id, hours: 24 },
	});
	const needing = (needData?.listPetsNeedingWalk?.items ?? []).filter(
		(p): p is NonNullable<typeof p> => !!p
	);

	useEffect(() => {
		setPage({ name: t("shelters.tabs.walks") });
	}, []);

	const onError = () => toast.error(t("messages.errors.fetch"));
	const [createWalk] = useCreateShelterWalkMutation({ onError });
	const [startWalk] = useStartShelterWalkMutation({ onError });
	const [completeWalk] = useCompleteShelterWalkMutation({ onError });
	const [cancelWalk] = useCancelShelterWalkMutation({ onError });
	const [deleteWalk] = useDeleteShelterWalkMutation({ onError });

	const reloadAll = () => {
		refetch();
		refetchNeed();
	};

	const run = async (p: Promise<unknown>, ok: string) => {
		await p;
		toast.success(t(ok));
		reloadAll();
	};

	return (
		<IonContent>
			<Header>
				<h2>{t("shelters.tabs.walks")}</h2>
			</Header>

			{needing.length > 0 && (
				<>
					<SubTitle>{t("shelters.walks.needing")}</SubTitle>
					<NeedList>
						{needing.map((sp) => (
							<NeedRow key={sp.id}>
								<span>{sp.pet?.name ?? "-"}</span>
								<PlanButton
									type="button"
									onClick={() =>
										run(
											createWalk({
												variables: {
													data: { shelter_pet_id: sp.id },
												},
											}),
											"shelters.walks.planned_ok"
										)
									}
								>
									<Icon name="add" color="light" size="16px" />
									<span>{t("shelters.walks.plan")}</span>
								</PlanButton>
							</NeedRow>
						))}
					</NeedList>
				</>
			)}

			<SubTitle>{t("shelters.walks.all")}</SubTitle>
			<List>
				{walks.map((walk) => (
					<WalkCard
						key={walk.id}
						walk={walk}
						onStart={(wid) =>
							run(
								startWalk({ variables: { id: wid } }),
								"shelters.walks.started_ok"
							)
						}
						onComplete={(wid) =>
							run(
								completeWalk({ variables: { id: wid } }),
								"shelters.walks.completed_ok"
							)
						}
						onCancel={(wid) =>
							run(
								cancelWalk({ variables: { id: wid } }),
								"shelters.walks.cancelled_ok"
							)
						}
						onDelete={(wid) =>
							run(
								deleteWalk({ variables: { id: wid } }),
								"shelters.walks.deleted_ok"
							)
						}
					/>
				))}
			</List>

			{!loading && !error && walks.length === 0 && (
				<Message>{t("shelters.walks.empty")}</Message>
			)}
			{!loading && error && <Message>{error}</Message>}
		</IonContent>
	);
};

const Header = styled.div`
	padding: ${$uw(2)} 12px ${$uw(0.5)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const SubTitle = styled.h3`
	margin: 0;
	padding: ${$uw(1.5)} 12px ${$uw(0.75)};
	font-size: 1.4rem;
	text-transform: uppercase;
	letter-spacing: 0.6px;
	color: ${$color("primary")};
`;

const NeedList = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding: 0 12px;
`;

const NeedRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1.25)};
	border-radius: 12px;
	background: rgba(var(--ion-color-warning-rgb), 0.12);
	> span {
		font-size: 1.5rem;
		font-weight: 600;
	}
`;

const PlanButton = styled.button`
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.5)} ${$uw(1)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.3rem;
	font-weight: 700;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(3)} 12px;
	opacity: 0.6;
`;
