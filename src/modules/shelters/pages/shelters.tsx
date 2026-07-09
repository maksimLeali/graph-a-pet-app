import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, TextInput } from "@components";
import { $color, $uw } from "@theme";
import { ShelterCard } from "../components";
import { useShelters } from "../hooks/useShelters";
import { useCreatePersonalWorkspaceMutation } from "../operations/__generated__/createPersonalWorkspace.generated";

export const Shelters: React.FC = () => {
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const { shelters, loading, error, refetch } = useShelters();
	const [showCreate, setShowCreate] = useState(false);
	const [name, setName] = useState("");

	useEffect(() => {
		setPage({ name: t("pages.shelters") });
	}, []);

	const [createWorkspace, { loading: creating }] = useCreatePersonalWorkspaceMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const onCreate = async () => {
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
		setName("");
		setShowCreate(false);
		refetch();
		const id = res.data.createPersonalWorkspace.shelter?.id;
		if (id) history.push(`/shelters/detail/${id}`);
	};

	return (
		<IonContent>
			<TopBar>
				<ActionBtn type="button" onClick={() => history.push("/shelters/discover")}>
					<Icon name="compassOutline" color="primary" size="18px" />
					<span>{t("shelters.discover.title")}</span>
				</ActionBtn>
			</TopBar>
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
							onClick={() => history.push("/shelters/discover")}
						>
							<Icon name="search" color="primary" size="20px" />
							<span>{t("shelters.empty_state.search_shelter")}</span>
						</ActionBtn>
						<ActionBtn
							type="button"
							onClick={() => toast(t("shelters.empty_state.coming_soon") ?? "")}
						>
							<Icon name="keypadOutline" color="primary" size="20px" />
							<span>{t("shelters.empty_state.insert_invite_code")}</span>
						</ActionBtn>
						<ActionBtn
							type="button"
							$primary
							onClick={() => setShowCreate((v) => !v)}
						>
							<Icon name="add" color="light" size="20px" />
							<span>{t("shelters.empty_state.create_personal_workspace")}</span>
						</ActionBtn>
					</Actions>

					{showCreate && (
						<CreateForm>
							<TextInput
								ntTextLabel={t("shelters.empty_state.workspace_name") ?? ""}
								value={name}
								onChange={setName}
							/>
							<SaveBtn type="button" disabled={creating} onClick={onCreate}>
								{t("shelters.empty_state.save")}
							</SaveBtn>
						</CreateForm>
					)}
				</EmptyState>
			)}
			{!loading && error && <Message>{error}</Message>}
		</IonContent>
	);
};

const TopBar = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
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

const CreateForm = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
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
