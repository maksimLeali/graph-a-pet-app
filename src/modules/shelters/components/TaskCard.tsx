import styled from "styled-components";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { Icon } from "@components";
import { IconName } from "../../../components/icons/iconName";
import { $color, $uw } from "@theme";
import { ShelterTaskType, TaskStatus } from "@types";
import { MinShelterTaskFragment } from "../operations/__generated__/MinShelterTask.generated";
import { StatusPill, taskStatusTone } from "./StatusPill";
import { ActionMenu, ActionMenuItem } from "./ActionMenu";

type Props = {
	task: MinShelterTaskFragment;
	onOpen: (id: string) => void;
	onComplete: (id: string) => void;
	onSkip: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	/** RBAC gates from useShelterAuthorization; actions hide when false */
	canExecute?: boolean;
	canEdit?: boolean;
	canDelete?: boolean;
};

const TYPE_ICON: Record<ShelterTaskType, IconName> = {
	[ShelterTaskType.Cleaning]: "sparkles",
	[ShelterTaskType.DeepCleaning]: "water",
	[ShelterTaskType.Feeding]: "restaurant",
	[ShelterTaskType.Medication]: "medkit",
	[ShelterTaskType.Grooming]: "cut",
	[ShelterTaskType.Other]: "ellipsisHorizontal",
};

export const TaskCard: React.FC<Props> = ({
	task,
	onOpen,
	onComplete,
	onSkip,
	onEdit,
	onDelete,
	canExecute = true,
	canEdit = true,
	canDelete = true,
}) => {
	const { t } = useTranslation();
	const open =
		task.status === TaskStatus.Pending || task.status === TaskStatus.InProgress;
	const petName = task.shelter_pet?.pet?.name;

	const meta = [
		task.area,
		petName,
		task.scheduled_at ? dayjs(task.scheduled_at).format("DD/MM HH:mm") : null,
	].filter(Boolean);

	const menuItems: ActionMenuItem[] = open
		? [
				...(canExecute
					? ([
							{ icon: "checkmark", label: t("actions.complete"), onClick: () => onComplete(task.id) },
							{ icon: "playSkipForward", label: t("actions.skip"), onClick: () => onSkip(task.id) },
					  ] as ActionMenuItem[])
					: []),
				...(canEdit
					? ([
							{ icon: "pencil", label: t("actions.edit"), onClick: () => onEdit(task.id) },
					  ] as ActionMenuItem[])
					: []),
		  ]
		: canDelete
		? [
				{ icon: "trashOutline", label: t("actions.delete"), tone: "danger", onClick: () => onDelete(task.id) },
		  ]
		: [];

	return (
		<Card role="button" tabIndex={0} onClick={() => onOpen(task.id)}>
			<IconBox>
				<Icon name={TYPE_ICON[task.task_type]} color="light" size="16px" />
			</IconBox>
			<Info>
				<Name>
					{t(`shelters.task_types.${task.task_type.toLowerCase()}`)}
					{task.is_recurring && <Icon name="repeat" color="medium" size="13px" />}
				</Name>
				<Sub>{meta.join(" · ")}</Sub>
			</Info>
			<StatusPill
				label={t(`shelters.task_status.${task.status.toLowerCase()}`)}
				tone={taskStatusTone(task.status)}
			/>
			<ActionMenu items={menuItems} />
		</Card>
	);
};

const Card = styled.div`
	width: 100%;
	min-height: 56px;
	box-sizing: border-box;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
`;

const IconBox = styled.div`
	flex: 0 0 auto;
	width: 34px;
	height: 34px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const Name = styled.span`
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 1.2;
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
`;

const Sub = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
	line-height: 1.2;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
