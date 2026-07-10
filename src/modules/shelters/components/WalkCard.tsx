import styled from "styled-components";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { ShelterWalkStatus } from "@types";
import { MinShelterWalkFragment } from "../operations/__generated__/MinShelterWalk.generated";
import { StatusPill, walkStatusTone } from "./StatusPill";
import { Avatar } from "./Avatar";
import { ActionMenu, ActionMenuItem } from "./ActionMenu";

type Props = {
	walk: MinShelterWalkFragment;
	onOpen: (id: string) => void;
	onStart: (id: string) => void;
	onComplete: (id: string) => void;
	onCancel: (id: string) => void;
	onDelete: (id: string) => void;
};

export const WalkCard: React.FC<Props> = ({
	walk,
	onOpen,
	onStart,
	onComplete,
	onCancel,
	onDelete,
}) => {
	const { t } = useTranslation();
	const petName = walk.shelter_pet?.pet?.name ?? "-";
	const walker = walk.walker
		? [walk.walker.first_name, walk.walker.last_name].filter(Boolean).join(" ")
		: walk.walker_shelter_person
		? [walk.walker_shelter_person.first_name, walk.walker_shelter_person.last_name]
				.filter(Boolean)
				.join(" ")
		: "";
	const planned = walk.status === ShelterWalkStatus.Planned;
	const inProgress = walk.status === ShelterWalkStatus.InProgress;
	const closed =
		walk.status === ShelterWalkStatus.Completed ||
		walk.status === ShelterWalkStatus.Cancelled;

	const meta = [
		walker,
		walk.status === ShelterWalkStatus.Completed && walk.duration_minutes != null
			? `${walk.duration_minutes} ${t("shelters.walks.minutes")}`
			: null,
		planned && walk.scheduled_at ? dayjs(walk.scheduled_at).format("DD/MM HH:mm") : null,
	].filter(Boolean);

	const menuItems: ActionMenuItem[] = [];
	if (planned || inProgress) {
		menuItems.push({
			icon: "close",
			label: t("actions.cancel"),
			onClick: () => onCancel(walk.id),
		});
	}
	if (closed) {
		menuItems.push({
			icon: "trashOutline",
			label: t("actions.delete"),
			tone: "danger",
			onClick: () => onDelete(walk.id),
		});
	}

	return (
		<Card role="button" tabIndex={0} onClick={() => onOpen(walk.id)}>
			<Avatar size={32} imageId={walk.shelter_pet?.pet?.main_picture?.id} icon="walk" />
			<Info>
				<Name>{petName}</Name>
				<Sub>{meta.join(" · ")}</Sub>
			</Info>
			<StatusPill
				label={t(`shelters.walk_status.${walk.status.toLowerCase()}`)}
				tone={walkStatusTone(walk.status)}
			/>
			{planned && (
				<Round
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onStart(walk.id);
					}}
				>
					<Icon name="play" color="light" size="15px" />
				</Round>
			)}
			{inProgress && (
				<Round
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onComplete(walk.id);
					}}
				>
					<Icon name="checkmark" color="light" size="16px" />
				</Round>
			)}
			{menuItems.length > 0 && <ActionMenu items={menuItems} />}
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
`;

const Sub = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
	line-height: 1.2;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Round = styled.button`
	flex: 0 0 auto;
	width: ${$uw(3)};
	height: ${$uw(3)};
	border: none;
	border-radius: 999px;
	background: ${$color("success")};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;
