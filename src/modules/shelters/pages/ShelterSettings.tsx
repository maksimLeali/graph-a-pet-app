import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, type IconName } from "@components";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

import { useShelterAuthorization } from "../hooks/useShelterAuthorization";

type Entry = {
	key: string;
	icon: IconName;
	label: I18NKey;
	path: string;
	permission: string;
};

// raccoglie le pagine amministrative prima sparse tra le chip del detail;
// ogni voce resta permission-gated dal backend
const ENTRIES: Entry[] = [
	{
		key: "public_profile",
		icon: "globeOutline",
		label: "shelters.tabs.public_profile",
		path: "public-profile",
		permission: "shelters.public_profile.manage",
	},
	{
		key: "verification",
		icon: "ribbonOutline",
		label: "shelters.tabs.verification",
		path: "verification",
		permission: "shelters.claim.create",
	},
	{
		key: "ownership",
		icon: "swapHorizontal",
		label: "shelters.tabs.ownership",
		path: "ownership",
		permission: "shelters.ownership.transfer",
	},
	{
		key: "invites",
		icon: "personAddOutline",
		label: "shelters.invites.title",
		path: "invites",
		permission: "shelters.members.invite",
	},
];

export const ShelterSettings: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const { can } = useShelterAuthorization(id);

	useEffect(() => {
		setPage({ name: t("shelters.overview.settings") });
	}, []);

	const visible = ENTRIES.filter((e) => can(e.permission));

	return (
		<IonContent>
			<Header>
				<h2>{t("shelters.overview.settings")}</h2>
			</Header>
			<List>
				{visible.map((entry) => (
					<Row
						key={entry.key}
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${id}/${entry.path}`)
						}
					>
						<Icon name={entry.icon} color="primary" size="18px" />
						<span>{t(entry.label)}</span>
						<Icon name="chevronForward" color="medium" size="14px" />
					</Row>
				))}
				{visible.length === 0 && (
					<Empty>{t("shelters.invites.no_permission")}</Empty>
				)}
			</List>
		</IonContent>
	);
};

const Header = styled.div`
	display: flex;
	align-items: center;
	padding: ${$uw(2)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1)} 12px;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
`;

const Row = styled.button`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	min-height: ${$uw(3.5)};
	padding: ${$uw(0.75)} ${$uw(1)};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	border-radius: 12px;
	background: ${$color("background")};
	cursor: pointer;
	text-align: left;
	> span {
		flex: 1 1 auto;
		font-size: 1.4rem;
		font-weight: 500;
		color: ${$color("dark")};
	}
	&:active {
		opacity: 0.7;
	}
`;

const Empty = styled.p`
	margin: 0;
	padding: ${$uw(2)} 0;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.4rem;
`;
