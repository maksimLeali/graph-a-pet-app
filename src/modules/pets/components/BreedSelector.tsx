import { $break_point, $color, $cssTRBL, $uw } from "@theme";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TextInput, Option, Icon } from "@components";
import { BREEDS } from "@utils";
import { useTranslation } from "react-i18next";

type Props = {
	onSelected: (option: Option | null) => void;

	changeBreedText: (value: string) => void;
	selectedBreed: Option | null;
};

export const BreedSeletor: React.FC<Props> = React.memo(
	({ onSelected, changeBreedText, selectedBreed }) => {
		const [applyFilter, setApplyFilter] = useState(false);
		const [filterText, setFilterText] = useState("");
		const { t } = useTranslation();
		const breedOptions: Option[] = Object.values(BREEDS).map((key) => ({
			value: key,
			label: t(`pets.breeds.${key.toLowerCase()}`),
		}));

		const handleSelection = useCallback(
			(option: Option) => {
				console.log("Option selected:", option.label);
				onSelected(option);
				setFilterText(option.label);
				setApplyFilter(false);
			},
			[onSelected]
		);

		const filteredOptions = useMemo(() => {
			if (!applyFilter || !filterText?.length) return breedOptions;

			return breedOptions.filter((opt) =>
				opt.label.toLowerCase().includes(filterText.toLowerCase())
			);
		}, [filterText, applyFilter, breedOptions]);

		useEffect(() => {
			console.log("filterText:", filterText);
		}, [filterText]);

		return (
			<Container>
				<Head>
					<TextInput
						name="breed"
						value={filterText}
						bgColor="light"
						onChange={(v) => {
							if (!applyFilter) {
								setApplyFilter(true);
							}

							setFilterText(v);
							changeBreedText(v);
						}}
					/>
				</Head>
				<List>
					{filteredOptions.map((option) => (
						<Item
							key={option.value}
							onClick={() => handleSelection(option)}
						>
							{option.label}
							{selectedBreed &&
								selectedBreed.value === option.value && (
									<Icon
										name="removeCircleOutline"
										color="danger"
									/>
								)}
						</Item>
					))}
				</List>
			</Container>
		);
	}
);

const Container = styled.div`
	width: 100%;
	padding: ${$cssTRBL(0, 1, 1)};
`;

const Head = styled.div`
	width: 100%;
	padding: ${$cssTRBL(0, 2)};
	border-bottom: 1px solid ${$color("medium")};
	margin-bottom: ${$uw(2)};
`;

const List = styled.div`
	width: 100%;
	max-height: ${$uw(30)};
	height: 800px;
	overflow-y: scroll;
`;

const Item = styled.div`
	width: 100%;
	height: ${$uw(2)};
	margin-bottom: ${$uw(1)};
	font-size: 1.4rem;
	border-radius: 4px;
	padding: ${$cssTRBL(0, 1, 0 ,2)};
	border: 1px solid ${$color("medium")};
	display: flex;
	align-items: center;
	justify-content: space-between;
	${$break_point(390)} {
		height: ${$uw(2.5)};
		margin-bottom: ${$uw(2)};
	}
`;
