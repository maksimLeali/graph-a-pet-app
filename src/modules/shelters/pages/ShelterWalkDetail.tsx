import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, Chip } from "@components";
import { ShelterWalkStatus } from "@types";
import { $color, $uw } from "@theme";

import { useGetShelterWalkQuery } from "../operations/__generated__/getShelterWalk.generated";
import { useStartShelterWalkMutation } from "../operations/__generated__/startShelterWalk.generated";
import { useCompleteShelterWalkMutation } from "../operations/__generated__/completeShelterWalk.generated";
import { useCancelShelterWalkMutation } from "../operations/__generated__/cancelShelterWalk.generated";
import { useDeleteShelterWalkMutation } from "../operations/__generated__/deleteShelterWalk.generated";

const STATUS_COLOR: Record<ShelterWalkStatus, string> = {
	[ShelterWalkStatus.Planned]: "medium",
	[ShelterWalkStatus.InProgress]: "warning",
	[ShelterWalkStatus.Completed]: "success",
	[ShelterWalkStatus.Cancelled]: "danger",
};

export const ShelterWalkDetail: React.FC = () => {
	const { id, walkId } = useParams<{ id: string; walkId: string }>();
	const { t } = useTranslation();
	const history = useHistory();
	const { setPage } = useUserContext();

	const { data, loading, refetch } = useGetShelterWalkQuery({
		variables: { id: walkId },
		fetchPolicy: "cache-and-network",
	});
	const walk = data?.getShelterWalk?.shelter_walk;

	useEffect(() => {
		setPage({ name: t("shelters.tabs.walks") });
	}, []);

	const onError = () => toast.error(t("messages.errors.fetch"));
	const [start, { loading: starting }] = useStartShelterWalkMutation({ onError });
	const [complete, { loading: completing }] = useCompleteShelterWalkMutation({ onError });
	const [cancel, { loading: cancelling }] = useCancelShelterWalkMutation({ onError });
	const [remove, { loading: deleting }] = useDeleteShelterWalkMutation({ onError });

	const run = async (p: Promise<unknown>, ok: string) => {
		await p;
		toast.success(t(ok));
		refetch();
	};

	if (loading && !walk) {
		return (
			<IonContent>
				<Header>
					<h2 className="skeleton" />
				</Header>
			</IonContent>
		);
	}

	if (!walk) {
		return (
			<IonContent>
				<Message>{t("shelters.walks.empty")}</Message>
			</IonContent>
		);
	}

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
		<IonContent>
			<Header>
				<IconBox>
					<Icon name="walk" color="light" size="28px" />
				</IconBox>
				<h2>{petName}</h2>
				<Chip
					label={t(`shelters.walk_status.${walk.status.toLowerCase()}`)}
					color={STATUS_COLOR[walk.status]}
				/>
			</Header>

			<Section>
				{walker && (
					<Row>
						<Icon name="personOutline" color="primary" size="18px" />
						<span>{walker}</span>
					</Row>
				)}
				{walk.scheduled_at && (
					<Row>
						<Icon name="timeOutline" color="primary" size="18px" />
						<span>{dayjs(walk.scheduled_at).format("DD/MM/YYYY HH:mm")}</span>
					</Row>
				)}
				{walk.started_at && (
					<Row>
						<Icon name="play" color="primary" size="18px" />
						<span>{dayjs(walk.started_at).format("DD/MM/YYYY HH:mm")}</span>
					</Row>
				)}
				{walk.ended_at && (
					<Row>
						<Icon name="checkmarkDone" color="primary" size="18px" />
						<span>{dayjs(walk.ended_at).format("DD/MM/YYYY HH:mm")}</span>
					</Row>
				)}
				{walk.duration_minutes != null && (
					<Row>
						<Icon name="hourglassOutline" color="primary" size="18px" />
						<span>
							{walk.duration_minutes} {t("shelters.walks.minutes")}
						</span>
					</Row>
				)}
			</Section>

			{walk.notes && (
				<Section>
					<SectionTitle>{t("shelters.tasks.notes")}</SectionTitle>
					<Notes>{walk.notes}</Notes>
				</Section>
			)}

			<Actions>
				{planned && (
					<ActionBtn
						$c="success"
						disabled={starting}
						onClick={() =>
							run(start({ variables: { id: walk.id } }), "shelters.walks.started_ok")
						}
					>
						<Icon name="play" color="light" size="16px" />
						<span>{t("actions.start")}</span>
					</ActionBtn>
				)}
				{inProgress && (
					<ActionBtn
						$c="success"
						disabled={completing}
						onClick={() =>
							run(
								complete({ variables: { id: walk.id } }),
								"shelters.walks.completed_ok"
							)
						}
					>
						<Icon name="checkmark" color="light" size="18px" />
						<span>{t("actions.complete")}</span>
					</ActionBtn>
				)}
				{(planned || inProgress) && (
					<ActionBtn
						$c="medium"
						disabled={cancelling}
						onClick={() =>
							run(cancel({ variables: { id: walk.id } }), "shelters.walks.cancelled_ok")
						}
					>
						<Icon name="close" color="light" size="18px" />
						<span>{t("actions.cancel")}</span>
					</ActionBtn>
				)}
				{closed && (
					<ActionBtn
						$c="danger"
						disabled={deleting}
						onClick={async () => {
							await remove({ variables: { id: walk.id } });
							toast.success(t("shelters.walks.deleted_ok"));
							history.replace(`/shelters/detail/${id}/walks`);
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

const Row = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} 0;
	font-size: 1.5rem;
	border-bottom: 1px solid rgba(var(--ion-color-primary-rgb), 0.1);
	&:last-child {
		border-bottom: none;
	}
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

const ActionBtn = styled.button<{ $c: string }>`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.75)};
	padding: ${$uw(1.25)};
	border: none;
	border-radius: 12px;
	background: ${({ $c }) => $color($c)};
	cursor: pointer;
	> span {
		font-size: 1.5rem;
		font-weight: 700;
		color: ${$color("light")};
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
