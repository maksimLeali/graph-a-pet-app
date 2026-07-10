import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";

import { StarRating } from "@components";
import { WalkRatingType } from "@types";
import { $color, $uw } from "@theme";

const walkRatingLabels: Record<WalkRatingType, string> = {
	[WalkRatingType.Overall]: "Generale",
	[WalkRatingType.Behavior]: "Comportamento",
	[WalkRatingType.Calm]: "Calma",
	[WalkRatingType.Aggression]: "Aggressività",
	[WalkRatingType.LeashPulling]: "Tiro al guinzaglio",
};

export type ShelterWalkRatings = Partial<Record<WalkRatingType, number>>;

type Props = {
	// selezione notificata verso l'esterno (letta al confirm)
	onChange: (ratings: ShelterWalkRatings) => void;
};

// Modale valutazione passeggiata canile: stessi criteri/UI del rating delle
// passeggiate dei pet personali (Object.values(WalkRatingType) + StarRating).
export const ShelterWalkRatingModal: React.FC<Props> = ({ onChange }) => {
	const { t } = useTranslation();
	const methods = useForm<ShelterWalkRatings>({ mode: "onSubmit" });
	const values = methods.watch();

	useEffect(() => {
		onChange(values);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(values)]);

	return (
		<FormProvider {...methods}>
			<Wrap>
				<Head>
					<b>{t("shelters.walks.rate_walk")}</b>
				</Head>
				{Object.values(WalkRatingType).map((rt) => (
					<StarRating
						key={rt}
						name={rt}
						ntTextLabel={walkRatingLabels[rt]}
						size={$uw(2)}
					/>
				))}
			</Wrap>
		</FormProvider>
	);
};

const Wrap = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 ${$uw(2)} ${$uw(1)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Head = styled.div`
	width: 100%;
	> b {
		font-size: 1.8rem;
		color: ${$color("primary")};
	}
`;
