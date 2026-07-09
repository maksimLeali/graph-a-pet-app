import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon } from "@components";
import { RoleLevel, ShelterPersonStatus } from "@types";
import { $color, $uw } from "@theme";
import { WalkCard } from "../components/WalkCard";
import {
	SelectWalkerModal,
	type PickableMember,
	type WalkerSelection,
} from "../components/SelectWalkerModal";
import { useShelterWalks } from "../hooks/useShelterWalks";
import { useMyShelterRole } from "../hooks/useMyShelterRole";
import { useListPetsNeedingWalkQuery } from "../operations/__generated__/listPetsNeedingWalk.generated";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";
import { useListShelterPeopleQuery } from "../operations/__generated__/listShelterPeople.generated";
import { useCreateShelterWalkMutation } from "../operations/__generated__/createShelterWalk.generated";
import { useStartShelterWalkMutation } from "../operations/__generated__/startShelterWalk.generated";
import { useCompleteShelterWalkMutation } from "../operations/__generated__/completeShelterWalk.generated";
import { useCancelShelterWalkMutation } from "../operations/__generated__/cancelShelterWalk.generated";
import { useDeleteShelterWalkMutation } from "../operations/__generated__/deleteShelterWalk.generated";

const CAN_ASSIGN_ROLES: RoleLevel[] = [
	RoleLevel.Owner,
	RoleLevel.Manager,
	RoleLevel.Staff,
];

export const ShelterWalksList: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage, user } = useUserContext();
	const { openModal, closeModal } = useModal();
	const { walks, loading, error, refetch } = useShelterWalks(id);
	const { role } = useMyShelterRole(id);
	const canAssign = !!role && CAN_ASSIGN_ROLES.includes(role);

	const { data: needData, refetch: refetchNeed } = useListPetsNeedingWalkQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: id, hours: 24 },
	});
	const needing = (needData?.listPetsNeedingWalk?.items ?? []).filter(
		(p): p is NonNullable<typeof p> => !!p
	);

	// membri del canile assegnabili come walker
	const { data: rolesData } = useListShelterRolesMinQuery({
		skip: !id || !canAssign,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});
	const teamMembers: PickableMember[] = (rolesData?.listShelterRoles?.items ?? [])
		.filter((r): r is NonNullable<typeof r> => !!r?.user)
		.map((r) => ({
			id: r.user.id,
			name: [r.user.first_name, r.user.last_name].filter(Boolean).join(" ") || r.user.id,
			kind: "user" as const,
		}))
		.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

	// shelter people segnati come volontari, assegnabili anche loro alle walks
	const { data: peopleData } = useListShelterPeopleQuery({
		skip: !id || !canAssign,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: id, search: { page: 0, page_size: 200 } },
	});
	const volunteers: PickableMember[] = (peopleData?.listShelterPeople?.items ?? [])
		.filter(
			(p): p is NonNullable<typeof p> =>
				!!p && p.status === ShelterPersonStatus.Volunteer
		)
		.map((p) => ({
			id: p.id,
			name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.id,
			kind: "person" as const,
		}));

	const members: PickableMember[] = [...teamMembers, ...volunteers];

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

	const doPlan = (shelterPetId: string, selection?: WalkerSelection) =>
		run(
			createWalk({
				variables: {
					data: {
						shelter_pet_id: shelterPetId,
						walker_id: selection?.kind === "user" ? selection.id : undefined,
						shelter_person_id:
							selection?.kind === "person" ? selection.id : undefined,
					},
				},
			}),
			"shelters.walks.planned_ok"
		);

	const plan = (shelterPetId: string) => {
		if (!canAssign) {
			doPlan(shelterPetId);
			return;
		}
		const defaultSelection: WalkerSelection = { id: user.id, kind: "user" };
		const sel = { current: defaultSelection };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: () => {
				doPlan(shelterPetId, sel.current);
				closeModal();
			},
			children: (
				<SelectWalkerModal
					members={members}
					defaultSelection={defaultSelection}
					onChange={(selection) => (sel.current = selection)}
				/>
			),
		});
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
									onClick={() => plan(sp.id)}
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
