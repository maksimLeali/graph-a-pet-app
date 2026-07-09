import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, Chip, Image2x, TextInput, Toggle } from "@components";
import { $color, $uw } from "@theme";
import { useDiscoverSheltersQuery } from "../operations/__generated__/discoverShelters.generated";
import { PublicShelterFragment } from "../operations/__generated__/PublicShelter.generated";
import { useShelters } from "../hooks/useShelters";

const PAGE_SIZE = 30;

export const ShelterDiscover: React.FC = () => {
	const { t } = useTranslation();
	const { setPage, user } = useUserContext();
	const history = useHistory();
	const [name, setName] = useState("");
	const [city, setCity] = useState("");
	const [volunteersOnly, setVolunteersOnly] = useState(false);

	useEffect(() => {
		setPage({ name: t("shelters.discover.title") });
	}, []);

	const { shelters: myShelters } = useShelters();
	const myIds = new Set(myShelters.map((s) => s.id));

	const { data, loading, error } = useDiscoverSheltersQuery({
		skip: !user.id,
		fetchPolicy: "cache-and-network",
		variables: {
			search: {
				name: name.trim() || undefined,
				city: city.trim() || undefined,
				accepts_volunteers: volunteersOnly || undefined,
				page: 0,
				page_size: PAGE_SIZE,
			},
		},
	});

	const shelters = (data?.discoverShelters?.items ?? [])
		.filter((s): s is PublicShelterFragment => !!s)
		.filter((s) => !myIds.has(s.id));
	const fetchError = data?.discoverShelters?.error?.message ?? error?.message;

	return (
		<IonContent>
			<SearchSection>
				<TextInput
					icon="search"
					ntTextLabel={t("shelters.discover.search_placeholder") ?? ""}
					value={name}
					onChange={setName}
				/>
				<TextInput
					icon="locationOutline"
					ntTextLabel={t("shelters.discover.city_placeholder") ?? ""}
					value={city}
					onChange={setCity}
				/>
			</SearchSection>

			<FilterRow>
				<Toggle value={volunteersOnly} onChange={setVolunteersOnly} />
				<span>{t("shelters.discover.accepts_volunteers_filter")}</span>
			</FilterRow>

			<List>
				{loading &&
					[0, 1, 2].map((i) => <Skeleton key={i} className="skeleton" />)}
				{!loading &&
					shelters.map((shelter) => (
						<Card
							key={shelter.id}
							onClick={() => history.push(`/shelters/public/${shelter.id}`)}
						>
							<Logo>
								{shelter.logo_media_id ? (
									<Image2x id={shelter.logo_media_id} />
								) : (
									<Icon name="paw" color="light" />
								)}
							</Logo>
							<Info>
								<Name>{shelter.name}</Name>
								{(shelter.city || shelter.region) && (
									<Address>
										{[shelter.city, shelter.region].filter(Boolean).join(", ")}
									</Address>
								)}
								{shelter.accepts_volunteers && (
									<Chip
										label={t("shelters.discover.accepts_volunteers_badge")}
										color="success"
									/>
								)}
							</Info>
						</Card>
					))}
			</List>

			{!loading && fetchError && <Message>{fetchError}</Message>}
			{!loading && !fetchError && shelters.length === 0 && (
				<Message>{t("shelters.discover.empty")}</Message>
			)}
		</IonContent>
	);
};

const SearchSection = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1)} 12px 0;
`;

const FilterRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: 0 12px ${$uw(0.5)};
	> span {
		font-size: 1.4rem;
		font-weight: 600;
		color: ${$color("dark")};
	}
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px ${$uw(3)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Skeleton = styled.div`
	width: 100%;
	height: ${$uw(6)};
	border-radius: 16px;
`;

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1.5)};
	padding: ${$uw(1.25)} ${$uw(1.5)};
	border-radius: 16px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: pointer;
`;

const Logo = styled.div`
	flex: 0 0 auto;
	width: ${$uw(4.5)};
	height: ${$uw(4.5)};
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
	> .img2x {
		width: 100%;
		height: 100%;
	}
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.25)};
`;

const Name = styled.span`
	font-size: 1.8rem;
	font-weight: 700;
	word-break: break-word;
`;

const Address = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
	word-break: break-word;
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
