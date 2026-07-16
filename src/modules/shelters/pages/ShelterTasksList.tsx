import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useLocation } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, PullToRefresh } from "@components";
import { TaskStatus } from "@types";
import { $color, $uw } from "@theme";
import { TaskCard } from "../components/TaskCard";
import { useShelterTasks } from "../hooks/useShelterTasks";
import { useShelterAuthorization } from "../hooks/useShelterAuthorization";
import { useCompleteShelterTaskMutation } from "../operations/__generated__/completeShelterTask.generated";
import { useSkipShelterTaskMutation } from "../operations/__generated__/skipShelterTask.generated";
import { useDeleteShelterTaskMutation } from "../operations/__generated__/deleteShelterTask.generated";

export const ShelterTasksList: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const location = useLocation();
	const { tasks, loading, error, refetch } = useShelterTasks(id);
	const { can } = useShelterAuthorization(id);

	// filtro arrivando dalla riga "attività in ritardo" della pagina rifugio
	const [overdueOnly, setOverdueOnly] = useState(
		() => new URLSearchParams(location.search).get("status") === "OVERDUE"
	);

	const shownTasks = useMemo(
		() =>
			overdueOnly
				? tasks.filter(
						(task) =>
							task.status === TaskStatus.Overdue ||
							(task.status === TaskStatus.Pending &&
								!!task.scheduled_at &&
								new Date(task.scheduled_at) < new Date())
					)
				: tasks,
		[tasks, overdueOnly]
	);

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
		    <PullToRefresh />
			<Header>
				<h2>{t("shelters.tabs.tasks")}</h2>
				{can("shelters.tasks.create") && (
					<AddButton
						type="button"
						onClick={() => history.push(`/shelters/detail/${id}/tasks/new`)}
					>
						<Icon name="add" color="light" size="18px" />
						<span>{t("shelters.tasks.add")}</span>
					</AddButton>
				)}
			</Header>

			{overdueOnly && (
				<FilterBanner>
					<span>{t("shelters.overview.filter_overdue")}</span>
					<ClearFilter
						type="button"
						onClick={() => setOverdueOnly(false)}
					>
						{t("shelters.overview.filter_clear")}
					</ClearFilter>
				</FilterBanner>
			)}

			<List>
				{shownTasks.map((task) => (
					<TaskCard
						key={task.id}
						task={task}
						canExecute={can("shelters.tasks.execute")}
						canEdit={can("shelters.tasks.update")}
						canDelete={can("shelters.tasks.delete")}
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

			{!loading && !error && shownTasks.length === 0 && (
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

const FilterBanner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	margin: 0 12px;
	padding: ${$uw(0.5)} ${$uw(1)};
	border-radius: 10px;
	background: ${$color("status.dangerBg")};
	> span {
		font-size: 1.2rem;
		font-weight: 700;
		color: ${$color("status.danger")};
	}
`;

const ClearFilter = styled.button`
	border: none;
	background: transparent;
	padding: ${$uw(0.5)};
	font-size: 1.2rem;
	font-weight: 700;
	color: ${$color("status.danger")};
	text-decoration: underline;
	cursor: pointer;
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
