import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon, PullToRefresh } from "@components";
import { RoleLevel, ShelterPersonStatus, WalkRatingType } from "@types";
import { $color, $uw } from "@theme";
import { WalkCard } from "../components/WalkCard";
import { Avatar } from "../components/Avatar";
import {
	SelectWalkerModal,
	type PickableMember,
	type WalkerSelection,
} from "../components/SelectWalkerModal";
import {
	ShelterWalkRatingModal,
	type ShelterWalkRatings,
} from "../components/ShelterWalkRatingModal";
import { useShelterWalks } from "../hooks/useShelterWalks";
import { useMyShelterRole } from "../hooks/useMyShelterRole";
import { useWeightUpdatePrompt } from "../hooks/useWeightUpdatePrompt";
import { useListPetsNeedingWalkQuery } from "../operations/__generated__/listPetsNeedingWalk.generated";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";
import { useListShelterPeopleQuery } from "../operations/__generated__/listShelterPeople.generated";
import { useCreateShelterWalkMutation } from "../operations/__generated__/createShelterWalk.generated";
import { useStartShelterWalkMutation } from "../operations/__generated__/startShelterWalk.generated";
import { useCompleteShelterWalkMutation } from "../operations/__generated__/completeShelterWalk.generated";
import { useCancelShelterWalkMutation } from "../operations/__generated__/cancelShelterWalk.generated";
import { useDeleteShelterWalkMutation } from "../operations/__generated__/deleteShelterWalk.generated";
import { useCreateShelterWalkRatingMutation } from "../operations/__generated__/createShelterWalkRating.generated";

const CAN_ASSIGN_ROLES: RoleLevel[] = [
	RoleLevel.Owner,
	RoleLevel.Manager,
	RoleLevel.Staff,
];

export const ShelterWalksList: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const history = useHistory();
	const { setPage, user } = useUserContext();
	const { openModal, closeModal } = useModal();
	const { maybePromptWeightUpdate } = useWeightUpdatePrompt();
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
	const [createWalkRating] = useCreateShelterWalkRatingMutation({ onError });
	const [cancelWalk] = useCancelShelterWalkMutation({ onError });
	const [deleteWalk] = useDeleteShelterWalkMutation({ onError });

	const reloadAll = () => {
		refetch();
		refetchNeed();
	};

	// i resolver walk rispondono success:false senza GraphQL error: va letto
	// il payload, altrimenti mostreremmo successo su un'operazione negata
	const run = async (p: Promise<{ data?: unknown } | unknown>, ok: string) => {
		const res = (await p) as { data?: Record<string, unknown> } | undefined;
		const payload = res?.data
			? (Object.values(res.data)[0] as
					| { success?: boolean; error?: { message?: string } | null }
					| undefined)
			: undefined;
		if (payload && payload.success === false) {
			toast.error(payload.error?.message ?? t("messages.errors.fetch"));
			return;
		}
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
		// preseleziona il membro collegato al pet (se c'è), altrimenti me stesso
		const needPet = needing.find((p) => p.id === shelterPetId);
		const assignedUser = needPet?.assigned_members?.[0];
		const assignedPerson = needPet?.assigned_shelter_people?.[0];
		const defaultSelection: WalkerSelection = assignedUser
			? { id: assignedUser.id, kind: "user" }
			: assignedPerson
			? { id: assignedPerson.id, kind: "person" }
			: { id: user.id, kind: "user" };
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

	// completa la walk + apre la modale di valutazione (stessi criteri delle
	// passeggiate dei pet personali), poi salva i rating compilati e infine,
	// se il peso del cane non è aggiornato da più di una settimana, chiede
	// se aggiornarlo
	const complete = (walkId: string) => {
		const walk = walks.find((w) => w.id === walkId);
		const petId = walk?.shelter_pet?.pet?.id;
		const petName = walk?.shelter_pet?.pet?.name ?? "";
		const ratings = { current: {} as ShelterWalkRatings };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				await completeWalk({ variables: { id: walkId } });
				await Promise.all(
					Object.entries(ratings.current)
						.filter(([, rating]) => !!rating)
						.map(([type, rating]) =>
							createWalkRating({
								variables: {
									data: {
										walk_id: walkId,
										type: type as WalkRatingType,
										rating: rating!,
									},
								},
							})
						)
				);
				toast.success(t("shelters.walks.completed_ok"));
				closeModal();
				reloadAll();
				if (petId) maybePromptWeightUpdate(petId, petName);
			},
			children: (
				<ShelterWalkRatingModal
					onChange={(next) => (ratings.current = next)}
				/>
			),
		});
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2>{t("shelters.tabs.walks")}</h2>
			</Header>

			{needing.length > 0 && (
				<>
					<SubTitle>{t("shelters.walks.needing")}</SubTitle>
					<NeedList>
						{needing.map((sp) => (
							<NeedRow key={sp.id}>
								<NeedInfo>
									<Avatar
										size={32}
										imageId={sp.pet?.main_picture?.id}
										icon="paw"
										color="medium"
									/>
									<span>{sp.pet?.name ?? "-"}</span>
								</NeedInfo>
								<PlanButton
									type="button"
									onClick={() => plan(sp.id)}
								>
									<Icon name="add" color="light" size="15px" />
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
						onOpen={(wid) =>
							history.push(`/shelters/detail/${id}/walks/${wid}`)
						}
						onStart={(wid) =>
							run(
								startWalk({ variables: { id: wid } }),
								"shelters.walks.started_ok"
							)
						}
						onComplete={(wid) => complete(wid)}
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
	min-height: 56px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 14px;
	background: rgba(245, 196, 24, 0.1);
`;

const NeedInfo = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	> span {
		font-size: 1.5rem;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
