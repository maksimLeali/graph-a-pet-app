import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon } from "@components";
import { $color, $uw } from "@theme";
import { TaskCard } from "../components/TaskCard";
import { useShelterTasks } from "../hooks/useShelterTasks";
import { useCompleteShelterTaskMutation } from "../operations/__generated__/completeShelterTask.generated";
import { useSkipShelterTaskMutation } from "../operations/__generated__/skipShelterTask.generated";
import { useDeleteShelterTaskMutation } from "../operations/__generated__/deleteShelterTask.generated";

export const ShelterTasksList: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const { tasks, loading, error, refetch } = useShelterTasks(id);

	useEffect(() => {
		setPage({ name: t("shelters.tabs.tasks") });
	}, []);

	const onError = () => toast.error(t("messages.errors.fetch"));
	const [complete] = useCompleteShelterTaskMutation({ onError });
	const [skip] = useSkipShelterTaskMutation({ onError });
	const [remove] = useDeleteShelterTaskMutation({ onError });

	const run = async (p: Promise<unknown>, ok: string) => {
		await p;
		toast.success(t(ok));
		refetch();
	};

	return (
		<IonContent>
			<Header>
				<h2>{t("shelters.tabs.tasks")}</h2>
				<AddButton
					type="button"
					onClick={() => history.push(`/shelters/detail/${id}/tasks/new`)}
				>
					<Icon name="add" color="light" size="18px" />
					<span>{t("shelters.tasks.add")}</span>
				</AddButton>
			</Header>

			<List>
				{tasks.map((task) => (
					<TaskCard
						key={task.id}
						task={task}
						onOpen={(tid) =>
							history.push(`/shelters/detail/${id}/tasks/${tid}`)
						}
						onComplete={(tid) =>
							run(
								complete({ variables: { id: tid } }),
								"shelters.tasks.completed_ok"
							)
						}
						onSkip={(tid) =>
							run(
								skip({ variables: { id: tid } }),
								"shelters.tasks.skipped_ok"
							)
						}
						onEdit={(tid) =>
							history.push(
								`/shelters/detail/${id}/tasks/${tid}/edit`
							)
						}
						onDelete={(tid) =>
							run(
								remove({ variables: { id: tid } }),
								"shelters.tasks.deleted_ok"
							)
						}
					/>
				))}
			</List>

			{!loading && !error && tasks.length === 0 && (
				<Message>{t("shelters.tasks.empty")}</Message>
			)}
			{!loading && error && <Message>{error}</Message>}
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
	&:active {
		opacity: 0.7;
	}
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1)} 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
