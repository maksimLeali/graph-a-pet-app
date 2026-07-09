import styled from "styled-components";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { Icon, Chip } from "@components";
import { $color, $uw } from "@theme";
import { ShelterWalkStatus } from "@types";
import { MinShelterWalkFragment } from "../operations/__generated__/MinShelterWalk.generated";

type Props = {
	walk: MinShelterWalkFragment;
	onStart: (id: string) => void;
	onComplete: (id: string) => void;
	onCancel: (id: string) => void;
	onDelete: (id: string) => void;
};

const STATUS_COLOR: Record<ShelterWalkStatus, string> = {
	[ShelterWalkStatus.Planned]: "medium",
	[ShelterWalkStatus.InProgress]: "warning",
	[ShelterWalkStatus.Completed]: "success",
	[ShelterWalkStatus.Cancelled]: "danger",
};

export const WalkCard: React.FC<Props> = ({
	walk,
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

	return (
		<Card>
			<IconBox>
				<Icon name="walk" color="light" />
			</IconBox>
			<Info>
				<Name>{petName}</Name>
				<Sub>
					{walker && `${walker}`}
					{walk.status === ShelterWalkStatus.Completed &&
						walk.duration_minutes != null &&
						` · ${walk.duration_minutes} ${t("shelters.walks.minutes")}`}
					{planned &&
						walk.scheduled_at &&
						` · ${dayjs(walk.scheduled_at).format("DD/MM HH:mm")}`}
				</Sub>
			</Info>
			<Right>
				<Chip
					label={t(`shelters.walk_status.${walk.status.toLowerCase()}`)}
					color={STATUS_COLOR[walk.status]}
				/>
				<Actions>
					{planned && (
						<Round $c="success" onClick={() => onStart(walk.id)}>
							<Icon name="play" color="light" size="16px" />
						</Round>
					)}
					{inProgress && (
						<Round $c="success" onClick={() => onComplete(walk.id)}>
							<Icon name="checkmark" color="light" size="18px" />
						</Round>
					)}
					{(planned || inProgress) && (
						<Round $c="medium" onClick={() => onCancel(walk.id)}>
							<Icon name="close" color="light" size="18px" />
						</Round>
					)}
					{closed && (
						<Round $c="danger" onClick={() => onDelete(walk.id)}>
							<Icon name="trashOutline" color="light" size="16px" />
						</Round>
					)}
				</Actions>
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
