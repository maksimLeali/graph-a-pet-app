import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Image2x, Icon } from "@components";
import { I18NKey } from "@i18n";
import { $color, $uw } from "@theme";

export type PickablePet = {
	id: string; // shelter_pet id
	name: string;
	pictureId?: string | null;
	borderColor?: string | null;
};

type Props = {
	pets: PickablePet[];
	// quanti pet posso ancora aggiungere nel box (capacità - occupanti)
	max: number;
	// selezione notificata verso l'esterno (letta al confirm)
	onChange: (ids: string[]) => void;
};

// Modale scelta pet: tap = seleziona; X in alto a destra = deseleziona.
// Selezione multipla fino a `max` (capacità residua del box).
export const AssignPetsModal: React.FC<Props> = ({ pets, max, onChange }) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState<string[]>([]);

	const commit = (next: string[]) => {
		setSelected(next);
		onChange(next);
	};

	const toggle = (id: string) => {
		if (selected.includes(id)) {
			commit(selected.filter((x) => x !== id));
			return;
		}
		if (selected.length >= max) return; // box pieno per questa selezione
		commit([...selected, id]);
	};

	return (
		<Wrap>
			<Head>
				<b>{t("shelters.map.assign_pet")}</b>
				<Counter $full={selected.length >= max}>
					{selected.length}/{max}
				</Counter>
			</Head>

			{pets.length === 0 ? (
				<Empty>{t("shelters.no_pets")}</Empty>
			) : (
				<Grid>
					{pets.map((p) => {
						const isSel = selected.includes(p.id);
						const disabled = !isSel && selected.length >= max;
						return (
							<Card
								key={p.id}
								className={disabled ? "disabled" : ""}
								role="button"
								tabIndex={0}
								onClick={() => toggle(p.id)}
							>
								<ImgWrap
									$border={p.borderColor ?? undefined}
									className={isSel ? "sel" : ""}
								>
									{p.pictureId ? (
										<Image2x id={p.pictureId} />
									) : (
										<Fill />
									)}
									{isSel && (
										<Badge
											onClick={(e) => {
												e.stopPropagation();
												toggle(p.id);
											}}
										>
											<Icon name="close" color="light" />
										</Badge>
									)}
								</ImgWrap>
								<Name>{p.name}</Name>
							</Card>
						);
					})}
				</Grid>
			)}

			{max <= 0 && <Hint>{t("shelters.map.box_full" as I18NKey)}</Hint>}
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	> b {
		font-size: 1.8rem;
		color: ${$color("primary")};
	}
`;

const Counter = styled.span<{ $full: boolean }>`
	font-size: 1.5rem;
	font-weight: 700;
	color: ${({ $full }) => ($full ? $color("danger") : $color("medium"))};
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${$uw(1.5)};
	max-height: 55dvh;
	overflow-y: auto;
`;

const Card = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.5)};
	cursor: pointer;
	transition: transform 0.15s ease, opacity 0.15s ease;
	&:active {
		transform: scale(0.96);
	}
	&.disabled {
		opacity: 0.35;
		pointer-events: none;
	}
`;

const ImgWrap = styled.div<{ $border?: string }>`
	position: relative;
	width: 100%;
	aspect-ratio: 1/1;
	box-sizing: border-box;
	border-radius: 999px;
	overflow: visible;
	background: ${({ $border }) =>
		$border ? $color($border) : $color("primary")};
	/* img fuori dal flusso: altezza del wrap solo da aspect-ratio, no feedback loop */
	> .img2x,
	> span {
		position: absolute;
		inset: 3px;
		border-radius: 999px;
		overflow: hidden;
		display: block;
	}
	&.sel {
		box-shadow: 0 0 0 3px ${$color("primary")};
	}
`;

const Fill = styled.span`
	display: block;
	border-radius: 999px;
	background: ${$color("primary")};
`;

const Badge = styled.div`
	position: absolute;
	top: -${$uw(0.4)};
	right: -${$uw(0.4)};
	width: ${$uw(2)};
	height: ${$uw(2)};
	border-radius: 999px;
	background: ${$color("danger")};
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	> .icon {
		width: 60%;
		height: 60%;
	}
`;

const Name = styled.span`
	font-size: 1.4rem;
	font-weight: 600;
	text-align: center;
	word-break: break-word;
`;

const Empty = styled.div`
	width: 100%;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.6rem;
	padding: ${$uw(2)} 0;
`;

const Hint = styled.div`
	width: 100%;
	text-align: center;
	color: ${$color("danger")};
	font-size: 1.5rem;
`;
