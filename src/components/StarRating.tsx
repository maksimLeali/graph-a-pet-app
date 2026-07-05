import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Icon } from "@components";
import { I18NKey } from "@i18n";
import { $uw } from "@theme";

type Props = {
	name: string;
	textLabel?: I18NKey;
	ntTextLabel?: string;
	max?: number;
	color?: string;
	emptyColor?: string;
};

/**
 * Controlled-by-react-hook-form star rating.
 * Tapping the Nth star sets the form value to N and fills stars 1..N.
 * Tapping the currently selected star again clears the value (optional field).
 */
export const StarRating: React.FC<Props> = ({
	name,
	textLabel,
	ntTextLabel,
	max = 5,
	color = "primary",
	emptyColor = "medium",
}) => {
	const { t } = useTranslation();
	const { setValue, watch } = useFormContext();
	const value: number = watch(name) ?? 0;
	const [hover, setHover] = useState(0);

	const active = hover || value;

	const select = (n: number) => {
		// tap same star again -> clear (optional)
		setValue(name, value === n ? undefined : n, { shouldValidate: true });
	};

	return (
		<Wrapper>
			{(textLabel || ntTextLabel) && (
				<Label>{textLabel ? t(textLabel) : ntTextLabel}</Label>
			)}
			<Stars>
				{Array.from({ length: max }, (_, i) => i + 1).map((n) => (
					<StarButton
						key={n}
						type="button"
						onMouseEnter={() => setHover(n)}
						onMouseLeave={() => setHover(0)}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							select(n);
						}}
					>
						<Icon
							name={n <= active ? "star" : "starOutline"}
							color={n <= active ? color : emptyColor}
							size="32px"
						/>
					</StarButton>
				))}
			</Stars>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	margin-bottom: ${$uw(2)};
`;

const Label = styled.span`
	display: block;
	font-size: 1.8rem;
	color: var(--ion-color-primary);
	margin-bottom: ${$uw(1)};
`;

const Stars = styled.div`
	display: flex;
	gap: ${$uw(1)};
`;

const StarButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	margin: 0;
	cursor: pointer;
	line-height: 0;
`;
