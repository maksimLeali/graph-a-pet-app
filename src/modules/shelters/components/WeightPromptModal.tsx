import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { $color, $uw } from "@theme";

type Props = {
	petName: string;
	onChange: (value: string) => void;
};

// Modale "aggiorna il peso?" mostrata dopo un rating di passeggiata quando
// l'ultimo peso registrato per il cane risale a più di una settimana fa.
export const WeightPromptModal: React.FC<Props> = ({ petName, onChange }) => {
	const { t } = useTranslation();
	const [value, setValue] = useState("");

	return (
		<Wrap>
			<Head>
				<b>{t("stats.update_weight_title")}</b>
			</Head>
			<Msg>{t("stats.update_weight_msg", { name: petName })}</Msg>
			<Input
				type="number"
				inputMode="decimal"
				step="0.1"
				min="0"
				placeholder={t("stats.add_weight") ?? ""}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
			/>
		</Wrap>
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

const Msg = styled.p`
	margin: 0;
	font-size: 1.4rem;
	color: ${$color("medium")};
`;

const Input = styled.input`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1)} ${$uw(1.5)};
	border-radius: 999px;
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
	background: ${$color("background")};
	color: ${$color("dark")};
	font-size: 1.5rem;
`;
