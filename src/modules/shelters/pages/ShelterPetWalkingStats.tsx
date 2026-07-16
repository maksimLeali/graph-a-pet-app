import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { WalkingStatsCard, PullToRefresh } from "@components";
import { StatsPeriod } from "@types";

import { useGetShelterPetWalkingStatsQuery } from "../operations/__generated__/getShelterPetWalkingStats.generated";

export const ShelterPetWalkingStats: React.FC = () => {
	const { petId } = useParams<{ id: string; petId: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.Monthly);

	useEffect(() => {
		setPage({ name: t("stats.title") });
	}, []);

	const { data, loading } = useGetShelterPetWalkingStatsQuery({
		fetchPolicy: "cache-and-network",
		variables: { shelter_pet_id: petId, period },
	});
	const chart = data?.getShelterPetWalkingStats?.chart;

	return (
		<IonContent>
		    <PullToRefresh />
			<WalkingStatsCard
				loading={loading && !chart}
				labels={chart?.labels ?? []}
				series={(chart?.series ?? []).filter(
					(s): s is NonNullable<typeof s> => !!s
				)}
				period={period}
				onPeriodChange={setPeriod}
			/>
		</IonContent>
	);
};
