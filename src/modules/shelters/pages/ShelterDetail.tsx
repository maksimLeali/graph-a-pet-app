import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useLocation } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { PullToRefresh } from "@components";

import { useGetShelterLazyQuery } from "../operations/__generated__/getShelter.generated";
import { useGetPublicShelterQuery } from "../operations/__generated__/getPublicShelter.generated";
import { useGetShelterOperationalDashboardQuery } from "../operations/__generated__/getShelterOperationalDashboard.generated";
import { FullShelterFragment } from "../operations/__generated__/FullShelter.generated";
import { useShelterAuthorization } from "../hooks/useShelterAuthorization";
import { useShelterAnimalStatuses } from "../hooks/useShelterAnimalStatuses";
import { ShelterHeader } from "../components/detail/ShelterHeader";
import { TodaySection } from "../components/detail/TodaySection";
import { ManagementGrid } from "../components/detail/ManagementGrid";
import { DonationsSection } from "../components/detail/DonationsSection";
import { AnimalsSection } from "../components/detail/AnimalsSection";

const SETTINGS_PERMISSIONS = [
	"shelters.public_profile.manage",
	"shelters.claim.create",
	"shelters.ownership.transfer",
	"shelters.members.invite",
];

export const ShelterDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const location = useLocation();

	const [getShelter, { data, loading }] = useGetShelterLazyQuery({
		fetchPolicy: "no-cache",
	});

	const shelter = data?.getShelter?.shelter ?? undefined;

	useEffect(() => {
		setPage({ name: t("pages.shelters") });
	}, [id]);

	// refetch a ogni ingresso nella pagina (es. ritorno da add-pet)
	useEffect(() => {
		if (location.pathname === `/shelters/detail/${id}`) {
			getShelter({ variables: { id } });
		}
	}, [id, location.key]);

	return (
		<IonContent>
			<PullToRefresh />
			{shelter ? (
				<Detail shelter={shelter} />
			) : (
				<ShelterHeader loading={loading} />
			)}
		</IonContent>
	);
};

type detailProps = {
	shelter: FullShelterFragment;
};

const Detail: React.FC<detailProps> = ({ shelter }) => {
	const history = useHistory();
	const { can } = useShelterAuthorization(shelter.id);

	const { data: dashData, loading: dashLoading } =
		useGetShelterOperationalDashboardQuery({
			variables: { shelter_id: shelter.id },
			fetchPolicy: "cache-and-network",
		});
	const dash = dashData?.getShelterOperationalDashboard?.dashboard;

	// profilo pubblico: serve solo per il logo dell'header
	const { data: pubData } = useGetPublicShelterQuery({
		variables: { id: shelter.id },
		fetchPolicy: "cache-and-network",
	});
	const logoMediaId = pubData?.getPublicShelter?.logo_media_id;

	const canReadNeeds = can("shelters.funding_needs.read");
	const { animals, loading: animalsLoading } = useShelterAnimalStatuses({
		shelterId: shelter.id,
		canWalks: can("shelters.walks.read"),
		canBoxes: can("shelters.map.read"),
		canNeeds: canReadNeeds,
	});

	const petsById = useMemo(
		() =>
			new Map(
				animals.map((a) => [
					a.petId,
					{ name: a.name, pictureId: a.pictureId },
				])
			),
		[animals]
	);

	const address = [
		[shelter.street, shelter.street_number].filter(Boolean).join(" "),
		shelter.postal_code,
		[shelter.city, shelter.province_code].filter(Boolean).join(" "),
		shelter.region,
	]
		.filter(Boolean)
		.join(", ");

	const roles = (shelter.roles?.items ?? []).filter(Boolean);
	const canSettings = SETTINGS_PERMISSIONS.some((p) => can(p));

	return (
		<>
			<ShelterHeader
				name={shelter.name}
				address={address}
				verificationStatus={shelter.verification_status}
				logoMediaId={logoMediaId}
				onSettings={
					canSettings
						? () =>
								history.push(
									`/shelters/detail/${shelter.id}/settings`
								)
						: undefined
				}
			/>

			<TodaySection
				shelterId={shelter.id}
				dash={dash ?? undefined}
				loading={dashLoading}
			/>

			<ManagementGrid
				shelterId={shelter.id}
				can={can}
				animalsCount={dash?.pets_total ?? animals.length}
				overdueTasksCount={dash?.tasks_overdue}
				peopleCount={roles.length}
			/>

			<DonationsSection
				shelterId={shelter.id}
				canReadNeeds={canReadNeeds}
				petsById={petsById}
			/>

			<AnimalsSection
				shelterId={shelter.id}
				animals={animals}
				loading={animalsLoading}
			/>
		</>
	);
};
