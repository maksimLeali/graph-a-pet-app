import { useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Image2x, Icon } from "@components";
import { $color, $uw } from "@theme";

export type LocatablePet = {
	id: string; // shelter_pet id
	name: string;
	pictureId?: string | null;
	borderColor?: string | null;
	// box in cui il pet è tenuto (se assegnato)
	boxKey?: string | null;
	boxLabel?: string | null;
};

type Props = {
	pets: LocatablePet[];
	// true = nasconde i pet già in un box; false = li mostra con targhetta del box
	hideAlreadyInBox?: boolean;
	// tap su un pet: il chiamante decide (evidenzia box o warning)
	onPick: (pet: LocatablePet) => void;
};

// Modale ricerca/localizzazione pet: search in cima, tap = onPick.
export const FindPetModal: React.FC<Props> = ({
	pets,
	hideAlreadyInBox = false,
	onPick,
}) => {
	const { t } = useTranslation();
	const [q, setQ] = useState("");

	const list = useMemo(() => {
		const base = hideAlreadyInBox ? pets.filter((p) => !p.boxKey) : pets;
		const needle = q.trim().toLowerCase();
		if (!needle) return base;
		return base.filter((p) => p.name.toLowerCase().includes(needle));
	}, [pets, hideAlreadyInBox, q]);

	return (
		<Wrap>
			<Head>
				<b>{t("shelters.map.find_pet")}</b>
			</Head>

			<Search>
				<Icon name="search" color="medium" size="18px" />
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder={t("shelters.map.search_pet") ?? ""}
				/>
			</Search>

			{list.length === 0 ? (
				<Empty>{t("shelters.no_pets")}</Empty>
			) : (
				<Grid>
					{list.map((p) => (
						<Card
							key={p.id}
							role="button"
							tabIndex={0}
							onClick={() => onPick(p)}
						>
							<ImgWrap $border={p.borderColor ?? undefined}>
								{p.pictureId ? (
									<Image2x id={p.pictureId} />
								) : (
									<Fill />
								)}
							</ImgWrap>
							<Name>{p.name}</Name>
							{!hideAlreadyInBox && p.boxLabel && (
								<BoxTag>{p.boxLabel}</BoxTag>
							)}
						</Card>
					))}
				</Grid>
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	> b {
		font-size: 1.8rem;
		color: ${$color("primary")};
	}
`;

const Search = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.5)};
	border-radius: ${$uw(1)};
	background: ${$color("background")};
	> input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 1.5rem;
		color: ${$color("dark")};
	}
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
	transition: transform 0.15s ease;
	&:active {
		transform: scale(0.96);
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
	> .img2x,
	> span {
		position: absolute;
		inset: 3px;
		border-radius: 999px;
		overflow: hidden;
		display: block;
	}
`;

const Fill = styled.span`
	display: block;
	border-radius: 999px;
	background: ${$color("primary")};
`;

const Name = styled.span`
	font-size: 1.4rem;
	font-weight: 600;
	text-align: center;
	word-break: break-word;
`;

const BoxTag = styled.span`
	font-size: 1.1rem;
	font-weight: 700;
	color: ${$color("light")};
	background: ${$color("primary")};
	border-radius: 999px;
	padding: 1px ${$uw(1)};
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Empty = styled.div`
	width: 100%;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.6rem;
	padding: ${$uw(2)} 0;
`;
