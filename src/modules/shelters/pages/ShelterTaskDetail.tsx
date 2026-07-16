import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, PullToRefresh } from "@components";
import { TaskStatus, ShelterTaskType } from "@types";
import { IconName } from "../../../components/icons/iconName";
import { $color, $uw } from "@theme";
import { StatusPill, taskStatusTone } from "../components/StatusPill";
import { Avatar } from "../components/Avatar";

import { useGetShelterTaskQuery } from "../operations/__generated__/getShelterTask.generated";
import { useCompleteShelterTaskMutation } from "../operations/__generated__/completeShelterTask.generated";
import { useSkipShelterTaskMutation } from "../operations/__generated__/skipShelterTask.generated";
import { useDeleteShelterTaskMutation } from "../operations/__generated__/deleteShelterTask.generated";
import { useShelterAuthorization } from "../hooks/useShelterAuthorization";

const TYPE_ICON: Record<ShelterTaskType, IconName> = {
	[ShelterTaskType.Cleaning]: "sparkles",
	[ShelterTaskType.DeepCleaning]: "water",
	[ShelterTaskType.Feeding]: "restaurant",
	[ShelterTaskType.Medication]: "medkit",
	[ShelterTaskType.Grooming]: "cut",
	[ShelterTaskType.Other]: "ellipsisHorizontal",
};

const initials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

export const ShelterTaskDetail: React.FC = () => {
	const { id, taskId } = useParams<{ id: string; taskId: string }>();
	const { t } = useTranslation();
	const history = useHistory();
	const { setPage } = useUserContext();

	const { data, loading, refetch } = useGetShelterTaskQuery({
		variables: { id: taskId },
		fetchPolicy: "cache-and-network",
	});
	const task = data?.getShelterTask?.shelter_task;
	const { can } = useShelterAuthorization(id);

	useEffect(() => {
		setPage({
			name: task
				? t(`shelters.task_types.${task.task_type.toLowerCase()}`)
				: t("shelters.tabs.tasks"),
		});
	}, [task?.task_type]);

	const onError = () => toast.error(t("messages.errors.fetch"));
	const [complete, { loading: completing }] = useCompleteShelterTaskMutation({ onError });
	const [skip, { loading: skipping }] = useSkipShelterTaskMutation({ onError });
	const [remove, { loading: deleting }] = useDeleteShelterTaskMutation({ onError });

	const run = async (p: Promise<unknown>, ok: string) => {
		await p;
		toast.success(t(ok));
		refetch();
	};

	if (loading && !task) {
		return (
			<IonContent>
			    <PullToRefresh />
				<Header>
					<h2 className="skeleton" />
				</Header>
			</IonContent>
		);
	}

	if (!task) {
		return (
			<IonContent>
				<Message>{t("shelters.tasks.empty")}</Message>
			</IonContent>
		);
	}

	const open = task.status === TaskStatus.Pending || task.status === TaskStatus.InProgress;
	const assignees = [
		...task.assignees.map((u) => ({
			id: u.id,
			name: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.id,
		})),
		...task.assignee_shelter_people.map((p) => ({
			id: p.id,
			name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.id,
		})),
	].filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i);

	return (
		<IonContent>
			<Header>
				<IconBox>
					<Icon name={TYPE_ICON[task.task_type]} color="light" size="26px" />
				</IconBox>
				<h2>{t(`shelters.task_types.${task.task_type.toLowerCase()}`)}</h2>
				<StatusPill
					label={t(`shelters.task_status.${task.status.toLowerCase()}`)}
					tone={taskStatusTone(task.status)}
				/>
			</Header>

			<Section>
				<KvCard>
					{task.shelter_pet?.pet && (
						<Kv>
							<span>{t("shelters.tasks.pet")}</span>
							<b>{task.shelter_pet.pet.name}</b>
						</Kv>
					)}
					{task.area && (
						<Kv>
							<span>{t("shelters.tasks.area")}</span>
							<b>{task.area}</b>
						</Kv>
					)}
					<Kv>
						<span>{t("shelters.tasks.scheduled_at")}</span>
						<b>
							{task.scheduled_at
								? dayjs(task.scheduled_at).format("DD/MM/YYYY HH:mm")
								: "—"}
						</b>
					</Kv>
					{task.is_recurring && (
						<Kv>
							<span>{t("shelters.tasks.recurring")}</span>
							<Icon name="repeat" color="primary" size="16px" />
						</Kv>
					)}
				</KvCard>
			</Section>

			<Section>
				<SectionTitle>{t("shelters.tasks.assignees")}</SectionTitle>
				{assignees.length === 0 ? (
					<Muted>{t("shelters.tasks.no_members")}</Muted>
				) : (
					<Chips>
						{assignees.map((a) => (
							<AssigneeChip key={a.id}>
								<Avatar size={22} initials={initials(a.name)} color="medium" />
								<span>{a.name}</span>
							</AssigneeChip>
						))}
					</Chips>
				)}
			</Section>

			{task.notes && (
				<Section>
					<SectionTitle>{t("shelters.tasks.notes")}</SectionTitle>
					<Notes>{task.notes}</Notes>
				</Section>
			)}

			<Actions>
				{open && can("shelters.tasks.execute") && (
					<>
						<ActionBtn
							$variant="solid-success"
							disabled={completing}
							onClick={() =>
								run(
									complete({ variables: { id: task.id } }),
									"shelters.tasks.completed_ok"
								)
							}
						>
							<Icon name="checkmark" color="light" size="18px" />
							<span>{t("actions.complete")}</span>
						</ActionBtn>
						<ActionBtn
							$variant="outline-neutral"
							disabled={skipping}
							onClick={() =>
								run(
									skip({ variables: { id: task.id } }),
									"shelters.tasks.skipped_ok"
								)
							}
						>
							<Icon name="playSkipForward" color="medium" size="16px" />
							<span>{t("actions.skip")}</span>
						</ActionBtn>
					</>
				)}
				{open && can("shelters.tasks.update") && (
					<ActionBtn
						$variant="outline-success"
						onClick={() =>
							history.push(`/shelters/detail/${id}/tasks/${task.id}/edit`)
						}
					>
						<Icon name="pencil" color="success" size="14px" />
						<span>{t("shelters.tasks.edit")}</span>
					</ActionBtn>
				)}
				{!open && can("shelters.tasks.delete") && (
					<ActionBtn
						$variant="solid-danger"
						disabled={deleting}
						onClick={async () => {
							await remove({ variables: { id: task.id } });
							toast.success(t("shelters.tasks.deleted_ok"));
							history.replace(`/shelters/detail/${id}/tasks`);
						}}
					>
						<Icon name="trashOutline" color="light" size="16px" />
						<span>{t("actions.delete")}</span>
					</ActionBtn>
				)}
			</Actions>
		</IonContent>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.75)};
	padding: ${$uw(2)} 12px;
	border-bottom: 2px solid ${$color("primary")};
	> h2 {
		margin: 0;
		text-align: center;
		min-height: 28px;
	}
`;

const IconBox = styled.div`
	width: ${$uw(5)};
	height: ${$uw(5)};
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
`;

const SectionTitle = styled.h3`
	margin: 0 0 ${$uw(1)};
	font-size: 1.4rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
`;

const KvCard = styled.div`
	width: 100%;
	box-sizing: border-box;
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.12);
	padding: 0 ${$uw(1.25)};
`;

const Kv = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(1)} 0;
	border-bottom: 1px solid rgba(var(--ion-color-primary-rgb), 0.08);
	&:last-child {
		border-bottom: none;
	}
	> span {
		font-size: 1.3rem;
		color: ${$color("medium")};
	}
	> b {
		font-size: 1.4rem;
		font-weight: 700;
		text-align: right;
	}
`;

const Chips = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(0.75)};
`;

const AssigneeChip = styled.div`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.6)};
	padding: 4px ${$uw(1)} 4px 4px;
	border-radius: 999px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	> span {
		font-size: 1.3rem;
		font-weight: 600;
	}
`;

const Muted = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
`;

const Notes = styled.p`
	margin: 0;
	font-size: 1.5rem;
	white-space: pre-wrap;
	word-break: break-word;
`;

const Actions = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(2)} 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

type Variant = "solid-success" | "solid-danger" | "outline-neutral" | "outline-success";

const VARIANT_STYLE: Record<Variant, { bg: string; border: string; fg: string }> = {
	"solid-success": { bg: $color("success"), border: $color("success"), fg: $color("light") },
	"solid-danger": { bg: $color("danger"), border: $color("danger"), fg: $color("light") },
	"outline-neutral": {
		bg: "transparent",
		border: "rgba(var(--ion-color-medium-rgb), 0.4)",
		fg: $color("medium"),
	},
	"outline-success": {
		bg: "transparent",
		border: $color("success"),
		fg: $color("success"),
	},
};

const ActionBtn = styled.button<{ $variant: Variant }>`
	width: 100%;
	height: ${$uw(4)};
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.75)};
	padding: 0 ${$uw(1.25)};
	border-radius: 12px;
	border: 1.5px solid ${({ $variant }) => VARIANT_STYLE[$variant].border};
	background: ${({ $variant }) => VARIANT_STYLE[$variant].bg};
	cursor: pointer;
	> span {
		font-size: 1.5rem;
		font-weight: 700;
		color: ${({ $variant }) => VARIANT_STYLE[$variant].fg};
	}
	&:disabled {
		opacity: 0.6;
		cursor: default;
	}
	&:active {
		opacity: 0.7;
	}
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
