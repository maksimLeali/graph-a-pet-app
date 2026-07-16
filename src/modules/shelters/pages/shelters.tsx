import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext, useModal } from "@contexts";
import { Icon, TextInput, PullToRefresh } from "@components";
import { ShelterType } from "@types";
import { $color, $uw } from "@theme";
import { ShelterCard } from "../components";
import { useShelters } from "../hooks/useShelters";
import { useCreatePersonalWorkspaceMutation } from "../operations/__generated__/createPersonalWorkspace.generated";

export const Shelters: React.FC = () => {
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { openModal, closeModal } = useModal();
	const history = useHistory();
	const location = useLocation();
	const personalOnly = useMemo(
		() => new URLSearchParams(location.search).get("type") === "personal",
		[location.search]
	);
	const { shelters, loading, error, refetch } = useShelters(
		personalOnly ? ShelterType.PersonalWorkspace : undefined
	);

	useEffect(() => {
		setPage({
			name: t(personalOnly ? "shelters.dashboard.my_workspaces" : "pages.shelters"),
		});
	}, [personalOnly]);

	const [createWorkspace, { loading: creating }] = useCreatePersonalWorkspaceMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const onCreate = async (name: string) => {
		if (!name.trim()) {
			toast.error(t("shelters.empty_state.name_required"));
			return;
		}
		const res = await createWorkspace({ variables: { data: { name } } });
		if (!res.data?.createPersonalWorkspace?.success) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.empty_state.created_ok"));
		closeModal();
		refetch();
		const id = res.data.createPersonalWorkspace.shelter?.id;
		if (id) history.push(`/shelters/detail/${id}`);
	};

	const openCreateModal = () => {
		const draft = { current: "" };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: () => onCreate(draft.current),
			children: (
				<CreateWorkspaceModal
					disabled={creating}
					onChange={(v) => (draft.current = v)}
				/>
			),
		});
	};

	return (
		<IonContent>
		    <PullToRefresh />
			{personalOnly && shelters.length > 0 && (
				<TopBar>
					<AddBtn type="button" onClick={openCreateModal}>
						<Icon name="add" color="light" size="18px" />
						<span>{t("shelters.empty_state.create_personal_workspace")}</span>
					</AddBtn>
				</TopBar>
			)}
			<List>
				{loading &&
					[0, 1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="skeleton" />
					))}
				{!loading &&
					shelters.map((shelter) => (
						<ShelterCard
							key={shelter.id}
							shelter={shelter}
							onClick={() =>
								history.push(`/shelters/detail/${shelter.id}`)
							}
						/>
					))}
			</List>
			{!loading && !error && shelters.length === 0 && (
				<EmptyState>
					<Message>{t("shelters.empty")}</Message>
					<Actions>
						<ActionBtn
							type="button"
							onClick={() => toast(t("shelters.empty_state.coming_soon") ?? "")}
						>
							<Icon name="keypadOutline" color="primary" size="20px" />
							<span>{t("shelters.empty_state.insert_invite_code")}</span>
						</ActionBtn>
						<ActionBtn type="button" $primary onClick={openCreateModal}>
							<Icon name="add" color="light" size="20px" />
							<span>{t("shelters.empty_state.create_personal_workspace")}</span>
						</ActionBtn>
					</Actions>
				</EmptyState>
			)}
			{!loading && error && <Message>{error}</Message>}
		</IonContent>
	);
};

type CreateWorkspaceModalProps = {
	disabled?: boolean;
	onChange: (name: string) => void;
};

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ disabled, onChange }) => {
	const { t } = useTranslation();
	const [value, setValue] = useState("");
	return (
		<ModalContent>
			<h3>{t("shelters.empty_state.create_personal_workspace")}</h3>
			<TextInput
				ntTextLabel={t("shelters.empty_state.workspace_name") ?? ""}
				value={value}
				disabled={disabled}
				onChange={(v) => {
					setValue(v);
					onChange(v);
				}}
			/>
		</ModalContent>
	);
};

const ModalContent = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
	> h3 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(3)} 12px;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Skeleton = styled.div`
	width: 100%;
	height: ${$uw(6)};
	border-radius: 16px;
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;

const EmptyState = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(3)};
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: ${$uw(1.5)};
`;

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(1)};
	padding: ${$uw(1.25)};
	border: 1px solid ${$color("primary")};
	border-radius: 12px;
	cursor: pointer;
	background: ${({ $primary }) => ($primary ? $color("primary") : $color("background"))};
	> span {
		font-size: 1.5rem;
		font-weight: 600;
		color: ${({ $primary }) => ($primary ? $color("light") : $color("primary"))};
	}
`;

const TopBar = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
`;

const AddBtn = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.75)} ${$uw(1.25)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	cursor: pointer;
	> span {
		font-size: 1.4rem;
		font-weight: 700;
		color: ${$color("light")};
	}
	&:active {
		opacity: 0.7;
	}
`;
