import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { PetWeightChart, PullToRefresh } from "@components";
import { StatsPeriod } from "@types";
import { $color, $uw } from "@theme";

import { useGetPetWeightStatsQuery } from "../operations/__generated__/getPetWeightStats.generated";
import { useCreatePetWeightMutation } from "../operations/__generated__/createPetWeight.generated";

export const PetWeightStats: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.Monthly);
	const [value, setValue] = useState("");

	useEffect(() => {
		setPage({ name: t("stats.weight_view_link") });
	}, []);

	const { data, loading, refetch } = useGetPetWeightStatsQuery({
		fetchPolicy: "cache-and-network",
		variables: { pet_id: id, period },
	});
	const chart = data?.getPetWeightStats?.chart;

	const [createWeight, { loading: saving }] = useCreatePetWeightMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
		onCompleted: (res) => {
			if (!res.createPetWeight?.success) {
				toast.error(t("messages.errors.fetch"));
				return;
			}
			toast.success(t("stats.weight_updated_ok"));
			setValue("");
			refetch();
		},
	});

	const submit = () => {
		const weight_kg = Number(value);
		if (!weight_kg || weight_kg <= 0) return;
		createWeight({ variables: { data: { pet_id: id, weight_kg } } });
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2>{t("stats.weight_view_link")}</h2>
			</Header>
			<Body>
				<AddRow>
					<input
						type="number"
						inputMode="decimal"
						step="0.1"
						min="0"
						placeholder={t("stats.add_weight") ?? ""}
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					<AddBtn type="button" disabled={saving || !value} onClick={submit}>
						{t("stats.add_weight")}
					</AddBtn>
				</AddRow>

				<PetWeightChart
					loading={loading && !chart}
					labels={chart?.labels ?? []}
					data={chart?.data ?? []}
					period={period}
					onPeriodChange={setPeriod}
				/>
			</Body>
		</IonContent>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(2)} 12px;
	border-bottom: 2px solid ${$color("primary")};
	> h2 {
		margin: 0;
		text-align: center;
	}
`;

const Body = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const AddRow = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	gap: ${$uw(1)};
	> input {
		flex: 1;
		box-sizing: border-box;
		padding: ${$uw(1)} ${$uw(1.5)};
		border-radius: 999px;
		border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
		background: ${$color("background")};
		color: ${$color("dark")};
		font-size: 1.5rem;
	}
`;

const AddBtn = styled.button`
	flex: 0 0 auto;
	padding: 0 ${$uw(1.5)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
	&:disabled {
		opacity: 0.5;
		cursor: default;
	}
`;
