import styled from "styled-components";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { Icon, Chip } from "@components";
import { IconName } from "../../../components/icons/iconName";
import { $color, $uw } from "@theme";
import { ShelterTaskType, TaskStatus } from "@types";
import { MinShelterTaskFragment } from "../operations/__generated__/MinShelterTask.generated";

type Props = {
	task: MinShelterTaskFragment;
	onComplete: (id: string) => void;
	onSkip: (id: string) => void;
	onDelete: (id: string) => void;
};

const TYPE_ICON: Record<ShelterTaskType, IconName> = {
	[ShelterTaskType.Cleaning]: "sparkles",
	[ShelterTaskType.DeepCleaning]: "water",
	[ShelterTaskType.Feeding]: "restaurant",
	[ShelterTaskType.Medication]: "medkit",
	[ShelterTaskType.Grooming]: "cut",
	[ShelterTaskType.Other]: "ellipsisHorizontal",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
	[TaskStatus.Pending]: "medium",
	[TaskStatus.InProgress]: "warning",
	[TaskStatus.Completed]: "success",
	[TaskStatus.Skipped]: "danger",
};

export const TaskCard: React.FC<Props> = ({ task, onComplete, onSkip, onDelete }) => {
	const { t } = useTranslation();
	const open =
		task.status === TaskStatus.Pending || task.status === TaskStatus.InProgress;
	const petName = task.shelter_pet?.pet?.name;

	return (
		<Card>
			<IconBox>
				<Icon name={TYPE_ICON[task.task_type]} color="light" />
			</IconBox>
			<Info>
				<Name>
					{t(`shelters.task_types.${task.task_type.toLowerCase()}`)}
					{task.is_recurring && (
						<Icon name="repeat" color="medium" size="14px" />
					)}
				</Name>
				<Sub>
					{[task.area, petName].filter(Boolean).join(" · ")}
					{task.scheduled_at &&
						` · ${dayjs(task.scheduled_at).format("DD/MM HH:mm")}`}
				</Sub>
			</Info>
			<Right>
				<Chip
					label={t(`shelters.task_status.${task.status.toLowerCase()}`)}
					color={STATUS_COLOR[task.status]}
				/>
				{open && (
					<Actions>
						<Round
							$c="success"
							aria-label={t("actions.complete") ?? ""}
							onClick={() => onComplete(task.id)}
						>
							<Icon name="checkmark" color="light" size="18px" />
						</Round>
						<Round
							$c="medium"
							aria-label={t("actions.skip") ?? ""}
							onClick={() => onSkip(task.id)}
						>
							<Icon name="playSkipForward" color="light" size="16px" />
						</Round>
					</Actions>
				)}
				{!open && (
					<Round
						$c="danger"
						aria-label={t("actions.delete") ?? ""}
						onClick={() => onDelete(task.id)}
					>
						<Icon name="trashOutline" color="light" size="16px" />
					</Round>
				)}
			</Right>
		</Card>
	);
};

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1.25)};
	padding: ${$uw(1)} ${$uw(1.25)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const IconBox = styled.div`
	flex: 0 0 auto;
	width: ${$uw(3.5)};
	height: ${$uw(3.5)};
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
	> .icon-wrapper {
		width: ${$uw(1.8)};
		height: ${$uw(1.8)};
	}
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.25)};
`;

const Name = styled.span`
	font-size: 1.6rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
`;

const Sub = styled.span`
	font-size: 1.3rem;
	color: ${$color("medium")};
	word-break: break-word;
`;

const Right = styled.div`
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: ${$uw(0.5)};
`;

const Actions = styled.div`
	display: flex;
	gap: ${$uw(0.5)};
`;

const Round = styled.button<{ $c: string }>`
	width: ${$uw(3)};
	height: ${$uw(3)};
	border: none;
	border-radius: 999px;
	background: ${({ $c }) => $color($c)};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;
