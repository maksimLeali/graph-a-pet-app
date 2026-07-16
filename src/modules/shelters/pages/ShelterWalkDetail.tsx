import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon, Chip, PullToRefresh } from "@components";
import { ShelterWalkStatus, WalkRatingType } from "@types";
import { $color, $uw } from "@theme";

import {
	ShelterWalkRatingModal,
	type ShelterWalkRatings,
} from "../components/ShelterWalkRatingModal";
import { ManualDurationModal } from "../components/ManualDurationModal";
import { useGetShelterWalkQuery } from "../operations/__generated__/getShelterWalk.generated";
import { useStartShelterWalkMutation } from "../operations/__generated__/startShelterWalk.generated";
import { useCompleteShelterWalkMutation } from "../operations/__generated__/completeShelterWalk.generated";
import { useCancelShelterWalkMutation } from "../operations/__generated__/cancelShelterWalk.generated";
import { useDeleteShelterWalkMutation } from "../operations/__generated__/deleteShelterWalk.generated";
import { useCreateShelterWalkRatingMutation } from "../operations/__generated__/createShelterWalkRating.generated";
import { useSetShelterWalkManualDurationMutation } from "../operations/__generated__/setShelterWalkManualDuration.generated";
import { useWeightUpdatePrompt } from "../hooks/useWeightUpdatePrompt";

const STATUS_COLOR: Record<ShelterWalkStatus, string> = {
	[ShelterWalkStatus.Planned]: "medium",
	[ShelterWalkStatus.InProgress]: "warning",
	[ShelterWalkStatus.Completed]: "success",
	[ShelterWalkStatus.Cancelled]: "danger",
};

const walkRatingLabels: Record<WalkRatingType, string> = {
	[WalkRatingType.Overall]: "Generale",
	[WalkRatingType.Behavior]: "Comportamento",
	[WalkRatingType.Calm]: "Calma",
	[WalkRatingType.Aggression]: "Aggressività",
	[WalkRatingType.LeashPulling]: "Tiro al guinzaglio",
};

export const ShelterWalkDetail: React.FC = () => {
	const { id, walkId } = useParams<{ id: string; walkId: string }>();
	const { t } = useTranslation();
	const history = useHistory();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const { maybePromptWeightUpdate } = useWeightUpdatePrompt();

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
	const [createWalkRating] = useCreateShelterWalkRatingMutation({ onError });
	const [setManualDuration] = useSetShelterWalkManualDurationMutation({ onError });

	const run = async (p: Promise<unknown>, ok: string) => {
		await p;
		toast.success(t(ok));
		refetch();
	};

	// completa la walk + apre la modale di valutazione (stessi criteri delle
	// passeggiate dei pet personali), poi salva i rating compilati e infine,
	// se il peso del cane non è aggiornato da più di una settimana, chiede
	// se aggiornarlo
	const completeWithRating = (walkId: string) => {
		const petId = walk?.shelter_pet?.pet?.id;
		const petName = walk?.shelter_pet?.pet?.name ?? "";
		const ratings = { current: {} as ShelterWalkRatings };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				await complete({ variables: { id: walkId } });
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
				refetch();
				if (petId) maybePromptWeightUpdate(petId, petName);
			},
			children: (
				<ShelterWalkRatingModal
					onChange={(next) => (ratings.current = next)}
				/>
			),
		});
	};

	// imposta una durata manuale: azzera start/end lato BE (la loro assenza
	// è ciò che il resto della pagina legge come "manuale")
	const editDuration = () => {
		const value = { current: walk?.duration_minutes ?? undefined };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				if (!walk || value.current == null) {
					closeModal();
					return;
				}
				await setManualDuration({
					variables: { id: walk.id, duration_minutes: value.current },
				});
				toast.success(t("shelters.walks.duration_updated_ok"));
				closeModal();
				refetch();
			},
			children: (
				<ManualDurationModal
					initialMinutes={walk?.duration_minutes}
					onChange={(minutes) => (value.current = minutes)}
				/>
			),
		});
	};

	if (loading && !walk) {
		return (
			<IonContent>
			    <PullToRefresh />
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
				<Chip
					label={t(`shelters.walk_status.${walk.status.toLowerCase()}`)}
					color={STATUS_COLOR[walk.status]}
				/>
			</Header>

			<Section>
				{walker && (
					<RowLink
						type="button"
						onClick={() => history.push(`/shelters/detail/${id}/people`)}
					>
						<Icon name="personOutline" color="primary" size="18px" />
						<span>{walker}</span>
					</RowLink>
				)}
				<RowLink
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${id}/pet/${walk.shelter_pet.id}`)
					}
				>
					<Icon name="paw" color="primary" size="18px" />
					<span>{petName}</span>
				</RowLink>
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
				{!walk.started_at && !walk.ended_at && walk.duration_minutes != null && (
					<Row>
						<Icon name="createOutline" color="primary" size="18px" />
						<span>{t("shelters.walks.manual")}</span>
					</Row>
				)}
				<RowLink type="button" onClick={editDuration}>
					<Icon name="hourglassOutline" color="primary" size="18px" />
					<span>
						{walk.duration_minutes != null
							? `${walk.duration_minutes} ${t("shelters.walks.minutes")}`
							: t("shelters.walks.edit_duration")}
					</span>
				</RowLink>
			</Section>

			{walk.notes && (
				<Section>
					<SectionTitle>{t("shelters.tasks.notes")}</SectionTitle>
					<Notes>{walk.notes}</Notes>
				</Section>
			)}

			{!!walk.ratings?.length && (
				<Section>
					<SectionTitle>{t("shelters.walks.rate_walk")}</SectionTitle>
					<RatingsGrid>
						{walk.ratings.filter(Boolean).map((r) => (
							<RatingItem key={r!.id}>
								<RatingName>{walkRatingLabels[r!.type]}</RatingName>
								<RatingValue>{"★".repeat(r!.rating)}</RatingValue>
							</RatingItem>
						))}
					</RatingsGrid>
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
						onClick={() => completeWithRating(walk.id)}
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

const RowLink = styled(Row.withComponent("button"))`
	width: 100%;
	border: none;
	background: none;
	text-align: left;
	color: inherit;
	cursor: pointer;
	> span {
		color: ${$color("primary")};
		text-decoration: underline;
	}
`;

const Notes = styled.p`
	margin: 0;
	font-size: 1.5rem;
	white-space: pre-wrap;
	word-break: break-word;
`;

const RatingsGrid = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
`;

const RatingItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 1.4rem;
`;

const RatingName = styled.span`
	color: ${$color("medium")};
`;

const RatingValue = styled.span`
	color: ${$color("primary")};
	letter-spacing: 1px;
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
