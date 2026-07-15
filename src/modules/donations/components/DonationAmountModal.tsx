import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { $color, $uw } from "@theme";

import { formatCents } from "../utils/formatCurrency";

const PRESET_UNITS = [5, 10, 20, 50];
const MIN_CENTS = 100;

type Props = {
	currency: string;
	onChange: (cents: number) => void;
};

// stesso pattern di WeightPromptModal/ManualDurationModal: componente di
// solo contenuto per la Modal generica, notifica il valore corrente al
// parent via onChange (letto imperativamente in onConfirm, non da qui)
export const DonationAmountModal: React.FC<Props> = ({
	currency,
	onChange,
}) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState<number>(PRESET_UNITS[1] * 100);
	const [custom, setCustom] = useState("");

	const pick = (cents: number) => {
		setCustom("");
		setSelected(cents);
		onChange(cents);
	};

	const pickCustom = (raw: string) => {
		setCustom(raw);
		const units = Number(raw.replace(",", "."));
		const cents = Number.isFinite(units) ? Math.round(units * 100) : 0;
		setSelected(cents);
		onChange(cents);
	};

	return (
		<Wrap>
			<Head>
				<b>{t("donations.amount_label")}</b>
			</Head>
			<Presets>
				{PRESET_UNITS.map((units) => {
					const cents = units * 100;
					return (
						<PresetChip
							key={units}
							type="button"
							className={selected === cents && !custom ? "active" : ""}
							onClick={() => pick(cents)}
						>
							{formatCents(cents, currency)}
						</PresetChip>
					);
				})}
			</Presets>
			<Input
				type="number"
				inputMode="decimal"
				step="0.01"
				min="1"
				placeholder={t("donations.custom_amount_placeholder") ?? ""}
				value={custom}
				onChange={(e) => pickCustom(e.target.value)}
			/>
			{selected < MIN_CENTS && (
				<ErrorText>{t("donations.min_amount_error")}</ErrorText>
			)}
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

const Presets = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(0.75)};
`;

const PresetChip = styled.button`
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
	border-radius: 999px;
	padding: ${$uw(0.75)} ${$uw(1.25)};
	background: ${$color("background")};
	color: ${$color("dark")};
	font-size: 1.4rem;
	font-weight: 600;
	cursor: pointer;
	&.active {
		background: ${$color("primary")};
		color: ${$color("light")};
		border-color: ${$color("primary")};
	}
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

const ErrorText = styled.span`
	font-size: 1.3rem;
	color: ${$color("danger")};
`;
