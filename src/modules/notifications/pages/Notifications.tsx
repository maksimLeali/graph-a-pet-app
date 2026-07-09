import { useEffect } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, IconName, Chip } from "@components";
import { I18NKey } from "@i18n";
import { $color, $cssTRBL, $uw } from "@theme";
import { NotificationPriority, NotificationStatus, NotificationType } from "@types";
import { useListMyNotificationsQuery } from "../operations/__generated__/listMyNotifications.generated";
import { useMarkNotificationAsReadMutation } from "../operations/__generated__/markNotificationAsRead.generated";
import { useMarkAllNotificationsAsReadMutation } from "../operations/__generated__/markAllNotificationsAsRead.generated";
import { useDismissNotificationMutation } from "../operations/__generated__/dismissNotification.generated";
import {
	useAcceptPetOwnershipInviteMutation,
	useRejectPetOwnershipInviteMutation,
} from "../operations/__generated__/respondPetOwnershipInvite.generated";
import {
	useAcceptShelterInviteMutation,
	useRejectShelterInviteMutation,
} from "../operations/__generated__/respondShelterInvite.generated";
import {
	useAcceptShelterOwnershipTransferMutation,
	useRejectShelterOwnershipTransferMutation,
} from "../operations/__generated__/respondShelterOwnershipTransfer.generated";
import { MinNotificationFragment } from "../operations/__generated__/MinNotification.generated";

const PRIORITY_COLOR: Record<NotificationPriority, string> = {
	[NotificationPriority.Low]: "medium",
	[NotificationPriority.Normal]: "primary",
	[NotificationPriority.High]: "warning",
	[NotificationPriority.Urgent]: "danger",
};

const TYPE_ICON: Record<NotificationType, IconName> = {
	[NotificationType.TreatmentReminder]: "medkitOutline",
	[NotificationType.PetOwnershipInvite]: "pawOutline",
	[NotificationType.ShelterInvite]: "homeOutline",
	[NotificationType.ShelterTaskInstance]: "checkboxOutline",
	[NotificationType.ShelterJoinRequest]: "peopleOutline",
	[NotificationType.PetBirthday]: "giftOutline",
	[NotificationType.ShelterOwnershipTransfer]: "swapHorizontal",
};

const TYPE_LABEL_KEY: Record<NotificationType, I18NKey> = {
	[NotificationType.TreatmentReminder]: "notifications.types.treatment_reminder",
	[NotificationType.PetOwnershipInvite]: "notifications.types.pet_invite",
	[NotificationType.ShelterInvite]: "notifications.types.shelter_invite",
	[NotificationType.ShelterTaskInstance]: "notifications.types.shelter_task",
	[NotificationType.ShelterJoinRequest]: "notifications.types.volunteer_request",
	[NotificationType.PetBirthday]: "notifications.types.pet_birthday",
	[NotificationType.ShelterOwnershipTransfer]: "notifications.types.ownership_transfer",
};

// keep the unread badge in sync after every mutation
const REFETCH = ["getUnreadNotificationCount", "listMyNotifications"];

export const Notifications: React.FC = () => {
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();

	useEffect(() => {
		setPage({ name: t("notifications.title") });
	}, []);

	const { data, loading, refetch } = useListMyNotificationsQuery({
		fetchPolicy: "cache-and-network",
		variables: { search: { page: 0, page_size: 50 } },
	});

	const [markRead] = useMarkNotificationAsReadMutation({ refetchQueries: REFETCH });
	const [markAll] = useMarkAllNotificationsAsReadMutation({ refetchQueries: REFETCH });
	const [dismiss] = useDismissNotificationMutation({ refetchQueries: REFETCH });
	const [acceptPet] = useAcceptPetOwnershipInviteMutation({ refetchQueries: REFETCH });
	const [rejectPet] = useRejectPetOwnershipInviteMutation({ refetchQueries: REFETCH });
	const [acceptShelter] = useAcceptShelterInviteMutation({ refetchQueries: REFETCH });
	const [rejectShelter] = useRejectShelterInviteMutation({ refetchQueries: REFETCH });
	const [acceptTransfer] = useAcceptShelterOwnershipTransferMutation({ refetchQueries: REFETCH });
	const [rejectTransfer] = useRejectShelterOwnershipTransferMutation({ refetchQueries: REFETCH });

	const items = (data?.listMyNotifications?.items ?? []).filter(
		(n): n is MinNotificationFragment => !!n
	);
	const hasUnread = items.some((n) => n.status === NotificationStatus.Unread);

	const onOpen = async (n: MinNotificationFragment) => {
		if (n.status === NotificationStatus.Unread) {
			await markRead({ variables: { id: n.id } });
		}
		if (n.action_url) history.push(n.action_url);
	};

	const onMarkAll = async () => {
		await markAll();
		toast.success(t("notifications.all_read_ok"));
		refetch();
	};

	const onDismiss = async (id: string) => {
		await dismiss({ variables: { id } });
		refetch();
	};

	// accept/reject an invite; the actual permission/logic stays backend-side.
	// once handled we dismiss the notification so it leaves the inbox.
	const respondInvite = async (n: MinNotificationFragment, accept: boolean) => {
		const inviteId = n.entity_id;
		if (!inviteId) return;
		try {
			if (n.type === NotificationType.PetOwnershipInvite) {
				accept
					? await acceptPet({ variables: { id: inviteId } })
					: await rejectPet({ variables: { id: inviteId } });
			} else if (n.type === NotificationType.ShelterInvite) {
				accept
					? await acceptShelter({ variables: { id: inviteId } })
					: await rejectShelter({ variables: { id: inviteId } });
			} else if (n.type === NotificationType.ShelterOwnershipTransfer) {
				accept
					? await acceptTransfer({ variables: { id: inviteId } })
					: await rejectTransfer({ variables: { id: inviteId } });
			}
			await dismiss({ variables: { id: n.id } });
			toast.success(
				t(accept ? "notifications.accepted_ok" : "notifications.rejected_ok")
			);
			refetch();
		} catch {
			toast.error(t("messages.errors.fetch"));
		}
	};

	return (
		<IonContent>
			<Wrapper>
				<Header>
					<h3>{t("notifications.title")}</h3>
					{hasUnread && (
						<MarkAllBtn type="button" onClick={onMarkAll}>
							<Icon name="checkmarkDone" color="primary" size="18px" />
							<span>{t("notifications.mark_all_read")}</span>
						</MarkAllBtn>
					)}
				</Header>

				{!loading && items.length === 0 && (
					<Empty>{t("notifications.empty")}</Empty>
				)}

				<List>
					{items.map((n) => {
						const unread = n.status === NotificationStatus.Unread;
						return (
							<Row key={n.id} $unread={unread}>
								<Main onClick={() => onOpen(n)}>
									<TypeIconWrap>
										<Icon name={TYPE_ICON[n.type] ?? "notifications"} color="light" size="18px" />
										{unread && <Dot />}
									</TypeIconWrap>
									<Body>
										<TypeLabel>{t(TYPE_LABEL_KEY[n.type])}</TypeLabel>
										<TitleLine>
											<span className="title">{n.title}</span>
											<Chip
												label={t(
													`notifications.priority.${n.priority.toLowerCase()}`
												)}
												color={PRIORITY_COLOR[n.priority]}
											/>
										</TitleLine>
										{n.message && <Msg>{n.message}</Msg>}
										{(n.type === NotificationType.PetOwnershipInvite ||
											n.type === NotificationType.ShelterInvite ||
											n.type === NotificationType.ShelterOwnershipTransfer) && (
											<Cta onClick={(e) => e.stopPropagation()}>
												<CtaBtn
													type="button"
													$primary
													onClick={() => respondInvite(n, true)}
												>
													{t("notifications.accept")}
												</CtaBtn>
												<CtaBtn
													type="button"
													onClick={() => respondInvite(n, false)}
												>
													{t("notifications.reject")}
												</CtaBtn>
												{n.action_url && (
													<CtaLink
														type="button"
														onClick={() => history.push(n.action_url as string)}
													>
														{n.type === NotificationType.PetOwnershipInvite
															? t("notifications.view_pet")
															: t("notifications.view_shelter")}
													</CtaLink>
												)}
											</Cta>
										)}
										<When>{dayjs(n.created_at).format("DD/MM HH:mm")}</When>
									</Body>
								</Main>
								<Actions>
									{unread && (
										<RoundBtn
											type="button"
											aria-label={t("notifications.mark_read") ?? ""}
											onClick={() => markRead({ variables: { id: n.id } })}
										>
											<Icon name="checkmark" color="light" size="16px" />
										</RoundBtn>
									)}
									<RoundBtn
										$c="medium"
										type="button"
										aria-label={t("notifications.dismiss") ?? ""}
										onClick={() => onDismiss(n.id)}
									>
										<Icon name="close" color="light" size="16px" />
									</RoundBtn>
								</Actions>
							</Row>
						);
					})}
				</List>
			</Wrapper>
		</IonContent>
	);
};

const Wrapper = styled.div`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
	padding: ${$cssTRBL(3, 1)};
	box-sizing: border-box;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	> h3 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const MarkAllBtn = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.75)};
	border: none;
	background: transparent;
	cursor: pointer;
	> span {
		font-size: 1.3rem;
		font-weight: 600;
		color: ${$color("primary")};
	}
`;

const Empty = styled.div`
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.5rem;
	padding: ${$uw(4)} 0;
`;

const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const Row = styled.div<{ $unread: boolean }>`
	display: flex;
	align-items: stretch;
	gap: ${$uw(1)};
	border-radius: 14px;
	padding: ${$uw(1.25)};
	box-sizing: border-box;
	background: ${$color("background")};
	border: 1px solid
		${({ $unread }) =>
			$unread
				? "rgba(var(--ion-color-primary-rgb), 0.5)"
				: "rgba(var(--ion-color-primary-rgb), 0.15)"};
`;

const Main = styled.div`
	display: flex;
	align-items: flex-start;
	gap: ${$uw(1)};
	flex: 1 1 auto;
	cursor: pointer;
	min-width: 0;
`;

const TypeIconWrap = styled.div`
	position: relative;
	flex: 0 0 auto;
	width: ${$uw(3.5)};
	height: ${$uw(3.5)};
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: ${$color("primary")};
`;

const Dot = styled.span`
	position: absolute;
	top: -2px;
	right: -2px;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: ${$color("danger")};
	border: 2px solid ${$color("background")};
`;

const Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
	min-width: 0;
`;

const TypeLabel = styled.span`
	font-size: 1.1rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.4px;
	color: ${$color("medium")};
`;

const TitleLine = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	flex-wrap: wrap;
	.title {
		font-size: 1.5rem;
		font-weight: 600;
		color: ${$color("dark")};
	}
`;

const Msg = styled.span`
	font-size: 1.4rem;
	color: ${$color("dark")};
`;

const When = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
`;

const Cta = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${$uw(1)};
	margin: ${$uw(0.5)} 0;
`;

const CtaBtn = styled.button<{ $primary?: boolean }>`
	border: 1px solid ${$color("primary")};
	border-radius: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1.5)};
	cursor: pointer;
	font-size: 1.3rem;
	font-weight: 600;
	background: ${({ $primary }) => ($primary ? $color("primary") : $color("background"))};
	color: ${({ $primary }) => ($primary ? $color("light") : $color("primary"))};
`;

const CtaLink = styled.button`
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 1.3rem;
	font-weight: 600;
	color: ${$color("medium")};
	text-decoration: underline;
`;

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.75)};
`;

const RoundBtn = styled.button<{ $c?: string }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: ${$uw(3)};
	height: ${$uw(3)};
	border: none;
	border-radius: 50%;
	cursor: pointer;
	background: ${({ $c }) => $color($c || "success")};
`;
