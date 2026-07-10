import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { $color, $uw } from "@theme";
import { I18NKey } from "@i18n";

type Props = {
	initialMinutes?: number | null;
	onChange: (minutes: number | undefined) => void;
};

const QUICK_OPTIONS: { minutes: number; labelKey: I18NKey }[] = [
	{ minutes: 15, labelKey: "shelters.walks.quarter_hour" },
	{ minutes: 30, labelKey: "shelters.walks.half_hour" },
	{ minutes: 45, labelKey: "shelters.walks.three_quarter_hour" },
	{ minutes: 60, labelKey: "shelters.walks.full_hour" },
];

// Modale durata manuale: tasti rapidi (quarto/mezza/tre quarti/un'ora) o
// minuti a piacere. Impostarla azzera start/end lato BE (assenza = "manuale").
export const ManualDurationModal: React.FC<Props> = ({
	initialMinutes,
	onChange,
}) => {
	const { t } = useTranslation();
	const [minutes, setMinutes] = useState<string>(
		initialMinutes != null ? String(initialMinutes) : ""
	);

	const set = (value: string) => {
		setMinutes(value);
		const n = Number(value);
		onChange(value && n > 0 ? n : undefined);
	};

	return (
		<Wrap>
			<Head>
				<b>{t("shelters.walks.edit_duration")}</b>
			</Head>

			<QuickGrid>
				{QUICK_OPTIONS.map((o) => (
					<QuickBtn
						key={o.minutes}
						type="button"
						className={Number(minutes) === o.minutes ? "active" : ""}
						onClick={() => set(String(o.minutes))}
					>
						{t(o.labelKey)}
					</QuickBtn>
				))}
			</QuickGrid>

			<Input
				type="number"
				inputMode="numeric"
				step="1"
				min="1"
				placeholder={t("shelters.walks.custom_minutes") ?? ""}
				value={minutes}
				onChange={(e) => set(e.target.value)}
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

const QuickGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${$uw(1)};
`;

const QuickBtn = styled.button`
	padding: ${$uw(1)};
	border: none;
	border-radius: 12px;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	color: ${$color("primary")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
	&.active {
		background: ${$color("primary")};
		color: ${$color("light")};
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
