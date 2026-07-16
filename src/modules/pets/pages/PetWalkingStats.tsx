import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { WalkingStatsCard, PullToRefresh } from "@components";
import { StatsPeriod } from "@types";

import { useGetPetWalkingStatsQuery } from "../operations/__generated__/getPetWalkingStats.generated";

export const PetWalkingStats: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.Monthly);

	useEffect(() => {
		setPage({ name: t("stats.title") });
	}, []);

	const { data, loading } = useGetPetWalkingStatsQuery({
		fetchPolicy: "cache-and-network",
		variables: { pet_id: id, period },
	});
	const chart = data?.getPetWalkingStats?.chart;

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
