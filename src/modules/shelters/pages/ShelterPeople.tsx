import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon, Chip, TextInput } from "@components";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";
import { ShelterPersonStatus, RoleLevel } from "@types";
import { useListShelterPeopleQuery } from "../operations/__generated__/listShelterPeople.generated";
import {
	useCreateShelterPersonMutation,
	useUpdateShelterPersonMutation,
	useArchiveShelterPersonMutation,
	useLinkShelterPersonToUserMutation,
} from "../operations/__generated__/shelterPerson.generated";
import { MinShelterPersonFragment } from "../operations/__generated__/MinShelterPerson.generated";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";
import { useDeleteShelterRoleMutation } from "../operations/__generated__/deleteShelterRole.generated";
import { useMyShelterRole } from "../hooks/useMyShelterRole";

type Person = MinShelterPersonFragment;

const GROUPS: { status: ShelterPersonStatus; titleKey: string }[] = [
	{ status: ShelterPersonStatus.ActiveUser, titleKey: "shelters.contacts.active_users" },
	{ status: ShelterPersonStatus.PendingInvite, titleKey: "shelters.contacts.pending" },
	{ status: ShelterPersonStatus.Volunteer, titleKey: "shelters.contacts.volunteers" },
	{ status: ShelterPersonStatus.Visitor, titleKey: "shelters.contacts.visitors" },
	{ status: ShelterPersonStatus.Archived, titleKey: "shelters.contacts.archived" },
];

const roleColors: Record<RoleLevel, string> = {
	[RoleLevel.Owner]: "primary",
	[RoleLevel.Manager]: "warning",
	[RoleLevel.Staff]: "success",
	[RoleLevel.Volunteer]: "medium",
};

export const ShelterPeople: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const { openModal, closeModal } = useModal();
	const { role: myRole } = useMyShelterRole(id);
	const canManage = myRole === RoleLevel.Owner || myRole === RoleLevel.Manager;

	useEffect(() => {
		setPage({ name: t("shelters.tabs.people") });
	}, []);

	const { data, loading, refetch } = useListShelterPeopleQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: id, search: { page: 0, page_size: 200 } },
	});

	const {
		data: rolesData,
		loading: loadingRoles,
		refetch: refetchRoles,
	} = useListShelterRolesMinQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 100,
				filters: { fixed: [{ key: "shelter_id", value: id }] },
			},
		},
	});
	const members = (rolesData?.listShelterRoles?.items ?? []).filter(
		(m): m is NonNullable<typeof m> => !!m
	);

	const onError = () => toast.error(t("messages.errors.fetch"));
	const [createPerson, { loading: creating }] = useCreateShelterPersonMutation({ onError });
	const [updatePerson, { loading: updating }] = useUpdateShelterPersonMutation({ onError });
	const [archivePerson] = useArchiveShelterPersonMutation({ onError });
	const [linkPerson] = useLinkShelterPersonToUserMutation({ onError });
	const [deleteShelterRole] = useDeleteShelterRoleMutation({ onError });

	const confirmRemoveMember = (member: (typeof members)[number]) => {
		const name = `${member.user.first_name} ${member.user.last_name}`.trim();
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				const res = await deleteShelterRole({ variables: { id: member.id } });
				const del = res.data?.deleteShelterRole;
				if (!del?.success || del.error) {
					toast.error(del?.error?.message ?? t("messages.errors.fetch"));
					return;
				}
				toast.success(t("messages.success.member_removed"));
				closeModal();
				refetchRoles();
			},
			children: (
				<ConfirmBox>
					<ConfirmTitle>{t("shelters.remove_member_title")}</ConfirmTitle>
					<ConfirmText>
						{t("shelters.remove_member_confirm", { name })}
					</ConfirmText>
				</ConfirmBox>
			),
		});
	};

	const emptyForm = {
		first_name: "",
		last_name: "",
		phone: "",
		email: "",
		notes: "",
		status: ShelterPersonStatus.Visitor,
	};

	const [showAdd, setShowAdd] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);

	const people = (data?.listShelterPeople?.items ?? []).filter(
		(p): p is Person => !!p
	);

	const closeForm = () => {
		setShowAdd(false);
		setEditingId(null);
		setForm(emptyForm);
	};

	const openAddForm = () => {
		setEditingId(null);
		setForm(emptyForm);
		setShowAdd(true);
	};

	const openEditForm = (p: Person) => {
		setEditingId(p.id);
		setForm({
			first_name: p.first_name ?? "",
			last_name: p.last_name ?? "",
			phone: p.phone ?? "",
			email: p.email ?? "",
			notes: p.notes ?? "",
			status: p.status,
		});
		setShowAdd(true);
	};

	const onSave = async () => {
		if (!form.first_name && !form.last_name && !form.phone && !form.email) {
			toast.error(t("shelters.contacts.identifier_required"));
			return;
		}
		if (editingId) {
			const res = await updatePerson({
				variables: {
					id: editingId,
					data: {
						first_name: form.first_name || undefined,
						last_name: form.last_name || undefined,
						phone: form.phone || undefined,
						email: form.email || undefined,
						notes: form.notes || undefined,
						status: form.status,
					},
				},
			});
			if (!res.data?.updateShelterPerson?.success) return onError();
			toast.success(t("shelters.contacts.updated_ok"));
			closeForm();
			refetch();
			return;
		}
		const res = await createPerson({
			variables: {
				data: {
					shelter_id: id,
					source: "MANUAL" as never,
					first_name: form.first_name || undefined,
					last_name: form.last_name || undefined,
					phone: form.phone || undefined,
					email: form.email || undefined,
					notes: form.notes || undefined,
					status: form.status,
				},
			},
		});
		if (!res.data?.createShelterPerson?.success) return onError();
		toast.success(t("shelters.contacts.added_ok"));
		closeForm();
		refetch();
	};

	const onArchive = async (p: Person) => {
		const res = await archivePerson({ variables: { id: p.id } });
		if (!res.data?.archiveShelterPerson?.success) return onError();
		toast.success(t("shelters.contacts.archived_ok"));
		refetch();
	};

	const onLink = async (p: Person) => {
		const userId = window.prompt(t("shelters.contacts.link_prompt") ?? "User id");
		if (!userId) return;
		const res = await linkPerson({ variables: { person_id: p.id, user_id: userId } });
		if (!res.data?.linkShelterPersonToUser?.success) return onError();
		toast.success(t("shelters.contacts.linked_ok"));
		refetch();
	};

	const fullName = (p: Person) =>
		[p.first_name, p.last_name].filter(Boolean).join(" ") ||
		p.email ||
		p.phone ||
		"—";

	return (
		<IonContent>
			<Header>
				<h2>{t("shelters.tabs.people")}</h2>
				{canManage && (
					<HeaderActions>
						<AddButton
							type="button"
							onClick={() => history.push(`/shelters/detail/${id}/invites`)}
						>
							<Icon name="mailOutline" color="light" size="18px" />
							<span>{t("shelters.invites.title")}</span>
						</AddButton>
						<AddButton
							type="button"
							onClick={() => (showAdd ? closeForm() : openAddForm())}
						>
							<Icon name={showAdd ? "close" : "add"} color="light" size="18px" />
							<span>{t("shelters.contacts.add")}</span>
						</AddButton>
					</HeaderActions>
				)}
			</Header>

			<Section>
				<SectionTitle>
					{t("shelters.contacts.members")} <em>({members.length})</em>
				</SectionTitle>
				{!loadingRoles && members.length === 0 && (
					<Message>{t("shelters.no_people")}</Message>
				)}
				{members.map((m) => (
					<Card key={m.id} $archived={false}>
						<Info>
							<Name>{`${m.user.first_name} ${m.user.last_name}`.trim()}</Name>
						</Info>
						<Actions>
							<Chip color={roleColors[m.role]} label={t(`shelters.roles.${m.role.toLowerCase()}` as I18NKey)} />
							{canManage && m.role !== RoleLevel.Owner && (
								<RoundBtn
									$c="danger"
									aria-label={t("shelters.remove_member") ?? ""}
									onClick={() => confirmRemoveMember(m)}
								>
									<Icon name="trashOutline" color="light" size="14px" />
								</RoundBtn>
							)}
						</Actions>
					</Card>
				))}
			</Section>

			{showAdd && canManage && (
				<AddForm>
					<FormTitle>
						{t(editingId ? "shelters.contacts.edit" : "shelters.contacts.add")}
					</FormTitle>
					<Row>
						<TextInput
							ntTextLabel={t("shelters.contacts.first_name") ?? ""}
							value={form.first_name}
							onChange={(v) => setForm({ ...form, first_name: v })}
						/>
						<TextInput
							ntTextLabel={t("shelters.contacts.last_name") ?? ""}
							value={form.last_name}
							onChange={(v) => setForm({ ...form, last_name: v })}
						/>
					</Row>
					<TextInput
						ntTextLabel={t("shelters.contacts.phone") ?? ""}
						value={form.phone}
						onChange={(v) => setForm({ ...form, phone: v })}
					/>
					<TextInput
						ntTextLabel={t("shelters.contacts.email") ?? ""}
						inputMode="email"
						value={form.email}
						onChange={(v) => setForm({ ...form, email: v })}
					/>
					{(!editingId ||
						form.status === ShelterPersonStatus.Visitor ||
						form.status === ShelterPersonStatus.Volunteer) && (
						<StatusRow>
							<span>{t("shelters.contacts.status")}</span>
							<StatusChips>
								{[ShelterPersonStatus.Visitor, ShelterPersonStatus.Volunteer].map(
									(s) => (
										<StatusChip
											key={s}
											type="button"
											$on={form.status === s}
											onClick={() => setForm({ ...form, status: s })}
										>
											{t(
												s === ShelterPersonStatus.Volunteer
													? "shelters.contacts.volunteer"
													: "shelters.contacts.visitor"
											)}
										</StatusChip>
									)
								)}
							</StatusChips>
						</StatusRow>
					)}
					<TextInput
						ntTextLabel={t("shelters.contacts.notes") ?? ""}
						value={form.notes}
						onChange={(v) => setForm({ ...form, notes: v })}
					/>
					<FormActions>
						<SaveBtn type="button" disabled={creating || updating} onClick={onSave}>
							{t("shelters.contacts.save")}
						</SaveBtn>
						{editingId && (
							<CancelBtn type="button" onClick={closeForm}>
								{t("shelters.contacts.cancel")}
							</CancelBtn>
						)}
					</FormActions>
				</AddForm>
			)}

			{GROUPS.map(({ status, titleKey }) => {
				const group = people.filter((p) => p.status === status);
				if (group.length === 0) return null;
				return (
					<Section key={status}>
						<SectionTitle>
							{t(titleKey)} <em>({group.length})</em>
						</SectionTitle>
						{group.map((p) => (
							<Card key={p.id} $archived={status === ShelterPersonStatus.Archived}>
								<Info>
									<Name>{fullName(p)}</Name>
									<Sub>
										{[p.phone, p.email].filter(Boolean).join(" · ")}
									</Sub>
									{p.notes && <Notes>{p.notes}</Notes>}
								</Info>
								{status !== ShelterPersonStatus.Archived && canManage && (
									<Actions>
										<RoundBtn
											$c="primary"
											aria-label={t("shelters.contacts.edit") ?? ""}
											onClick={() => openEditForm(p)}
										>
											<Icon name="pencil" color="light" size="14px" />
										</RoundBtn>
										{status !== ShelterPersonStatus.ActiveUser && (
											<RoundBtn
												$c="success"
												aria-label={t("shelters.contacts.link") ?? ""}
												onClick={() => onLink(p)}
											>
												<Icon name="link" color="light" size="14px" />
											</RoundBtn>
										)}
										<RoundBtn
											$c="danger"
											aria-label={t("shelters.contacts.archive") ?? ""}
											onClick={() => onArchive(p)}
										>
											<Icon name="archiveOutline" color="light" size="14px" />
										</RoundBtn>
									</Actions>
								)}
							</Card>
						))}
					</Section>
				);
			})}

			{!loading && people.length === 0 && (
				<Message>{t("shelters.contacts.empty")}</Message>
			)}
		</IonContent>
	);
};

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(2)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const HeaderActions = styled.div`
	flex: 0 0 auto;
	display: flex;
	gap: ${$uw(0.75)};
`;

const AddButton = styled.button`
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.75)} ${$uw(1.25)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
`;

const AddForm = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
	padding: ${$uw(1)} 12px ${$uw(2)};
`;

const FormTitle = styled.h3`
	margin: 0;
	color: ${$color("primary")};
	font-size: 1.6rem;
`;

const FormActions = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
`;

const CancelBtn = styled.button`
	border: none;
	background: transparent;
	color: ${$color("medium")};
	font-weight: 600;
	font-size: 1.4rem;
	cursor: pointer;
`;

const Row = styled.div`
	display: flex;
	gap: ${$uw(1)};
`;

const StatusRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding: ${$uw(0.5)} 0;
	> span {
		font-size: 1.3rem;
		color: ${$color("medium")};
	}
`;

const StatusChips = styled.div`
	display: flex;
	gap: ${$uw(0.75)};
`;

const StatusChip = styled.button<{ $on: boolean }>`
	flex: 1 1 0;
	border: 1px solid ${$color("primary")};
	border-radius: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1)};
	font-size: 1.4rem;
	font-weight: 600;
	cursor: pointer;
	background: ${({ $on }) => ($on ? $color("primary") : $color("background"))};
	color: ${({ $on }) => ($on ? $color("light") : $color("dark"))};
`;

const SaveBtn = styled.button`
	align-self: flex-start;
	border: none;
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;

const Section = styled.div`
	padding: 0 12px ${$uw(1)};
`;

const SectionTitle = styled.h3`
	margin: ${$uw(1)} 0 ${$uw(0.5)};
	color: ${$color("primary")};
	font-size: 1.5rem;
	> em {
		color: ${$color("medium")};
		font-style: normal;
		font-weight: 400;
	}
`;

const Card = styled.div<{ $archived: boolean }>`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1.25)};
	margin-bottom: ${$uw(0.75)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	opacity: ${({ $archived }) => ($archived ? 0.6 : 1)};
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.25)};
`;

const Name = styled.span`
	font-size: 1.5rem;
	font-weight: 600;
	color: ${$color("dark")};
`;

const Sub = styled.span`
	font-size: 1.3rem;
	color: ${$color("medium")};
`;

const Notes = styled.span`
	font-size: 1.3rem;
	color: ${$color("dark")};
`;

const Actions = styled.div`
	display: flex;
	gap: ${$uw(0.5)};
`;

const RoundBtn = styled.button<{ $c: string }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: ${$uw(3)};
	height: ${$uw(3)};
	border: none;
	border-radius: 50%;
	cursor: pointer;
	background: ${({ $c }) => $color($c)};
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;

const ConfirmBox = styled.div`
	width: 100%;
	padding: ${$uw(2)} ${$uw(2)} ${$uw(1)};
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const ConfirmTitle = styled.h2`
	margin: 0;
	font-size: 2rem;
	color: ${$color("danger")};
`;

const ConfirmText = styled.p`
	margin: 0;
	font-size: 1.6rem;
	line-height: 1.4;
`;
