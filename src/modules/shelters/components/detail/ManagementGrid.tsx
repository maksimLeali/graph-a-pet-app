import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { Icon, type IconName } from "@components";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

type Props = {
	shelterId: string;
	can: (permission: string) => boolean;
	animalsCount?: number;
	overdueTasksCount?: number;
	peopleCount?: number;
};

type Tile = {
	key: string;
	icon: IconName;
	permission: string;
	path: string;
	badge?: number;
	badgeTone?: "primary" | "danger";
};

export const ManagementGrid: React.FC<Props> = ({
	shelterId,
	can,
	animalsCount,
	overdueTasksCount,
	peopleCount,
}) => {
	const { t } = useTranslation();
	const history = useHistory();

	const tiles: Tile[] = [
		{
			key: "animals",
			icon: "paw",
			permission: "shelters.pets.read",
			path: "animals",
			badge: animalsCount,
			badgeTone: "primary",
		},
		{
			key: "boxes",
			icon: "albumsOutline",
			permission: "shelters.boxes.read",
			path: "boxes",
		},
		{
			key: "tasks",
			icon: "checkboxOutline",
			permission: "shelters.tasks.read",
			path: "tasks",
			badge:
				overdueTasksCount && overdueTasksCount > 0
					? overdueTasksCount
					: undefined,
			badgeTone: "danger",
		},
		{
			key: "walks",
			icon: "walkOutline",
			permission: "shelters.walks.read",
			path: "walks",
		},
		{
			key: "inventory",
			icon: "cubeOutline",
			permission: "shelters.inventory.read",
			path: "inventory",
		},
		{
			key: "map",
			icon: "mapOutline",
			permission: "shelters.map.read",
			path: "map",
		},
		{
			key: "people",
			icon: "peopleOutline",
			permission: "shelters.people.read",
			path: "people",
			badge: peopleCount,
			badgeTone: "primary",
		},
		{
			key: "photos",
			icon: "imagesOutline",
			permission: "shelters.read",
			path: "photos",
		},
	];

	// RBAC backend-driven: tile nascosta (non disabilitata) senza permission
	const visible = tiles.filter((tile) => can(tile.permission));
	if (visible.length === 0) return null;

	return (
		<Section>
			<Label>{t("shelters.overview.management")}</Label>
			<Grid>
				{visible.map((tile) => (
					<TileButton
						key={tile.key}
						type="button"
						onClick={() =>
							history.push(
								`/shelters/detail/${shelterId}/${tile.path}`
							)
						}
					>
						{tile.badge != null && tile.badge > 0 && (
							<Badge $tone={tile.badgeTone ?? "primary"}>
								{tile.badge}
							</Badge>
						)}
						<Icon name={tile.icon} color="primary" size="20px" />
						<span>
							{t(`shelters.overview.tiles.${tile.key}` as I18NKey)}
						</span>
					</TileButton>
				))}
			</Grid>
		</Section>
	);
};

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
`;

const Label = styled.span`
	display: block;
	font-size: 1.1rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: ${$color("primary")};
	margin-bottom: ${$uw(0.75)};
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: ${$uw(0.75)};
`;

const TileButton = styled.button`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.5)};
	min-height: ${$uw(4)};
	padding: ${$uw(0.75)} ${$uw(0.25)};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	border-radius: 12px;
	background: ${$color("background")};
	cursor: pointer;
	> span {
		font-size: 1.1rem;
		font-weight: 500;
		color: ${$color("dark")};
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	&:active {
		opacity: 0.7;
	}
`;

const Badge = styled.span<{ $tone: "primary" | "danger" }>`
	position: absolute;
	top: ${$uw(0.25)};
	right: ${$uw(0.25)};
	min-width: ${$uw(1.2)};
	height: ${$uw(1.2)};
	padding: 0 ${$uw(0.3)};
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	font-size: 0.9rem;
	font-weight: 700;
	background: ${({ $tone }) => $color($tone)};
	color: ${({ $tone }) => $color(`${$tone}-contrast`)};
`;
