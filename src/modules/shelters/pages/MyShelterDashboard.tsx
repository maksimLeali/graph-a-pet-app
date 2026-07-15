import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import dayjs from "dayjs";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { RoleLevel, UserRole, TaskStatus, ShelterWalkStatus } from "@types";
import { $color, $uw } from "@theme";
import { StatusPill, taskStatusTone, walkStatusTone } from "../components/StatusPill";
import { Avatar } from "../components/Avatar";

import { useGetMyShelterDashboardQuery } from "../operations/__generated__/getMyShelterDashboard.generated";
import { useListShelterRolesMinQuery } from "../operations/__generated__/listShelterRolesMin.generated";

const MANAGER_LEVEL_ROLES = [RoleLevel.Manager, RoleLevel.Owner];

const isOpenTask = (status: TaskStatus) =>
	status === TaskStatus.Pending || status === TaskStatus.InProgress;

export const MyShelterDashboard: React.FC = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { setPage, user } = useUserContext();

	useEffect(() => {
		setPage({ name: t("shelters.dashboard.title") });
	}, []);

	const dateFrom = useMemo(() => dayjs().startOf("day").toISOString(), []);
	const dateTo = useMemo(() => dayjs().startOf("day").add(7, "days").toISOString(), []);

	const { data, loading } = useGetMyShelterDashboardQuery({
		fetchPolicy: "cache-and-network",
		variables: { date_from: dateFrom, date_to: dateTo },
	});
	const dash = data?.getMyShelterDashboard?.dashboard;

	// visibilita' sezione inventory: solo se manager-level in almeno uno shelter
	const isAdmin = user.role === UserRole.Admin;
	const { data: rolesData } = useListShelterRolesMinQuery({
		skip: !user.id || isAdmin,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 50,
				filters: { fixed: [{ key: "user_id", value: user.id }] },
			},
		},
	});
	const canSeeInventory =
		isAdmin ||
		(rolesData?.listShelterRoles?.items ?? []).some(
			(r) => !!r && MANAGER_LEVEL_ROLES.includes(r.role)
		);

	const tasks = dash?.tasks ?? [];
	const walks = dash?.walks ?? [];
	const alerts = dash?.inventory_alerts ?? [];

	const openTaskCount = tasks.filter((tk) => isOpenTask(tk.status)).length;
	const openWalkCount = walks.filter(
		(w) => w.status !== ShelterWalkStatus.Completed && w.status !== ShelterWalkStatus.Cancelled
	).length;
	const inventoryAlertCount = alerts.length;

	const shelterCount = useMemo(() => {
		const ids = new Set([
			...tasks.map((tk) => tk.shelter_id),
			...walks.map((w) => w.shelter_id),
			...alerts.map((a) => a.shelter_id),
		]);
		return ids.size;
	}, [tasks, walks, alerts]);

	return (
		<IonContent>
			<Header>
				<h2>{dayjs(dateFrom).format("D MMM")} – {dayjs(dateTo).subtract(1, "day").format("D MMM")}</h2>
				<Subtitle>
					{shelterCount > 0
						? t("shelters.dashboard.shelters_scope", { count: shelterCount })
						: t("shelters.dashboard.title")}
				</Subtitle>
			</Header>

			<Overview>
				<OverviewCell $accent={dash && dash.overdue_task_count > 0 ? "red" : undefined}>
					<b>{dash ? openTaskCount : "-"}</b>
					<span>{t("shelters.tabs.tasks")}</span>
				</OverviewCell>
				<OverviewCell>
					<b>{dash ? openWalkCount : "-"}</b>
					<span>{t("shelters.tabs.walks")}</span>
				</OverviewCell>
				{canSeeInventory && (
					<OverviewCell $accent={inventoryAlertCount > 0 ? "yellow" : undefined}>
						<b>{dash ? inventoryAlertCount : "-"}</b>
						<span>{t("shelters.tabs.inventory")}</span>
					</OverviewCell>
				)}
			</Overview>

			{/* Tasks assigned to me */}
			<Section>
				<SectionTitle>{t("shelters.tabs.tasks")}</SectionTitle>
				<List>
					{tasks.map((tk) => (
						<Row key={tk.id} type="button" onClick={() => history.push(tk.action_url)}>
							<Avatar size={32} icon="checkboxOutline" color="primary" />
							<Info>
								<Name>{t(`shelters.task_types.${tk.task_type.toLowerCase()}`)}</Name>
								<Sub>
									{[
										tk.area,
										tk.scheduled_at && dayjs(tk.scheduled_at).format("DD/MM HH:mm"),
										tk.shelter_name,
									]
										.filter(Boolean)
										.join(" · ")}
								</Sub>
							</Info>
							<StatusPill
								label={
									tk.is_overdue
										? t("shelters.dashboard.overdue")
										: t(`shelters.task_status.${tk.status.toLowerCase()}`)
								}
								tone={taskStatusTone(tk.status, tk.is_overdue)}
							/>
						</Row>
					))}
					{!loading && tasks.length === 0 && (
						<Empty>{t("shelters.dashboard.empty_tasks")}</Empty>
					)}
				</List>
			</Section>

			{/* Walks assigned to me */}
			<Section>
				<SectionTitle>{t("shelters.tabs.walks")}</SectionTitle>
				<List>
					{walks.map((w) => (
						<Row key={w.id} type="button" onClick={() => history.push(w.action_url)}>
							<Avatar size={32} icon="walk" color="primary" />
							<Info>
								<Name>{w.pet_name}</Name>
								<Sub>
									{[
										w.scheduled_at && dayjs(w.scheduled_at).format("DD/MM HH:mm"),
										w.shelter_name,
									]
										.filter(Boolean)
										.join(" · ")}
								</Sub>
							</Info>
							<StatusPill
								label={t(`shelters.walk_status.${w.status.toLowerCase()}`)}
								tone={walkStatusTone(w.status)}
							/>
						</Row>
					))}
					{!loading && walks.length === 0 && (
						<Empty>{t("shelters.dashboard.empty_walks")}</Empty>
					)}
				</List>
			</Section>

			{/* Inventory critical alerts (manager-level only) */}
			{canSeeInventory && (
				<Section>
					<SectionTitle>{t("shelters.tabs.inventory")}</SectionTitle>
					<List>
						{alerts.map((a) => (
							<Row key={a.id} type="button" onClick={() => history.push(a.action_url)}>
								<Avatar size={32} icon="cubeOutline" color="primary" />
								<Info>
									<Name>{a.name}</Name>
									<Sub>
										{[
											`${a.current_quantity}${
												a.minimum_threshold != null
													? ` / ${t("shelters.inventory.min")} ${a.minimum_threshold}`
													: ""
											}`,
											a.shelter_name,
										]
											.filter(Boolean)
											.join(" · ")}
									</Sub>
								</Info>
								<StatusPill
									label={
										a.status === "OUT_OF_STOCK"
											? t("shelters.dashboard.out_of_stock")
											: t("shelters.dashboard.low_stock")
									}
									tone={a.status === "OUT_OF_STOCK" ? "red" : "yellow"}
								/>
							</Row>
						))}
						{!loading && alerts.length === 0 && (
							<Empty>{t("shelters.dashboard.empty_inventory")}</Empty>
						)}
					</List>
				</Section>
			)}
		</IonContent>
	);
};

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: ${$uw(2)} 12px ${$uw(0.5)};
	> h2 {
		margin: 0;
		font-size: 1.9rem;
		color: ${$color("primary")};
	}
`;

const Subtitle = styled.span`
	font-size: 1.3rem;
	color: ${$color("medium")};
`;

const Overview = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${$uw(1)};
	padding: ${$uw(1)} 12px;
`;

const OverviewCell = styled.div<{ $accent?: "red" | "yellow" }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
	padding: ${$uw(0.75)} ${$uw(0.5)};
	border-radius: 12px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.12);
	> b {
		font-size: 2rem;
		font-weight: 800;
		color: ${({ $accent }) =>
			$accent === "red" ? $color("danger") : $accent === "yellow" ? $color("warning") : $color("primary")};
	}
	> span {
		font-size: 1.1rem;
		text-align: center;
		color: ${$color("medium")};
		line-height: 1.2;
	}
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.25)} 12px 0;
`;

const SectionTitle = styled.h3`
	margin: 0 0 ${$uw(1)};
	font-size: 1.4rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	&::after {
		content: "";
		flex: 1;
		height: 2px;
		background: rgba(var(--ion-color-primary-rgb), 0.25);
	}
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding-bottom: ${$uw(1)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const Row = styled.button`
	width: 100%;
	min-height: 56px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	cursor: pointer;
	text-align: left;
	&:active {
		opacity: 0.7;
	}
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

const Empty = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(2.5)} 12px;
	opacity: 0.6;
	margin: 0;
	font-size: 1.3rem;
`;
