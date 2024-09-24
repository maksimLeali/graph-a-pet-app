import { $breakPoint, $color, $cssTRBL, $uw } from "@theme";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TextInput, Option, Icon } from "@components";
import { COAT_LENGHTS as COATS } from "@utils";
import { useTranslation } from "react-i18next";

type Props = {
	onSelected: (option: Option | null) => void;

	changeCoatText: (value: string) => void;
	selectedCoat: Option | null;
};

export const CoatSeletor: React.FC<Props> = React.memo(
	({ onSelected, changeCoatText, selectedCoat }) => {
		const [applyFilter, setApplyFilter] = useState(false);
		const [filterText, setFilterText] = useState("");
		const { t } = useTranslation();
		const coatOptions: Option[] = Object.values(COATS).map((key) => ({
			value: key,
			label: t(`pets.coats.${key.toLowerCase()}`),
		}));

		const handleSelection = useCallback(
			(option: Option) => {
				if (selectedCoat?.value == option.value) {
					onSelected(null);
					changeCoatText("");
					setFilterText("");
					return;
				}
				console.log("Option selected:", option.label);
				onSelected(option);
				setFilterText(option.label);
				setApplyFilter(false);
			},
			[onSelected]
		);

		const filteredOptions = useMemo(() => {
			if (!applyFilter || !filterText?.length) return coatOptions;

			return coatOptions.filter((opt) =>
				opt.label.toLowerCase().includes(filterText.toLowerCase())
			);
		}, [filterText, applyFilter, coatOptions]);

		useEffect(() => {
			console.log("filterText:", filterText);
		}, [filterText]);

		return (
			<Container>
				<Head>
					<TextInput
						name="coat"
						value={filterText}
						bgColor="light"
						onChange={(v) => {
							if (!applyFilter) {
								setApplyFilter(true);
								onSelected(null);
							}
							setFilterText(v);
							changeCoatText(v);
						}}
					/>
					{selectedCoat ? (
						<Item
							className="selected"
							key={selectedCoat.value}
							onClick={() => handleSelection(selectedCoat)}
						>
							{selectedCoat.label}

							<Icon
								name="removeCircleOutline"
								size="18px"
								color="danger"
							/>
						</Item>
					) : (
						<></>
					)}
				</Head>
				<List>
					{filteredOptions.map((option) => (
						<Item
							key={option.value}
							className={
								selectedCoat?.value === option.value
									? "selected"
									: ""
							}
							onClick={() => handleSelection(option)}
						>
							{option.label}
							{selectedCoat &&
								selectedCoat.value === option.value && (
									<Icon
										name="removeCircleOutline"
										color="danger"
										size={"18px"}
									/>
								)}
						</Item>
					))}
				</List>
				{!selectedCoat && filterText.length > 1 && (
					<Footer>
						<p>{t("pets.add_pet_page.step_2.coat_alert")}</p>
					</Footer>
				)}
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
	padding: ${$cssTRBL(0, 2, 1)};
	border-bottom: 1px solid ${$color("medium")};
	margin-bottom: ${$uw(2)};
	> .text-input {
		margin-bottom: ${$uw(1)};
	}
`;

const List = styled.div`
	width: 100%;
	max-height: min(25dvh, ${$uw(28)});

	overflow-y: scroll;
`;

const Item = styled.div`
	width: 100%;
	height: ${$uw(2)};
	margin-bottom: ${$uw(1)};
	font-size: 1.4rem;
	border-radius: 4px;
	padding: ${$cssTRBL(0, 1, 0, 2)};
	border: 1px solid ${$color("medium")};
	display: flex;
	align-items: center;
	justify-content: space-between;
	&.selected {
		border: 1px solid ${$color("primary")};
	}
	${$breakPoint(390)} {
		height: ${$uw(2.5)};
		margin-bottom: ${$uw(2)};
	}
`;

const Footer = styled.div`
	width: 100%;
	padding: ${$uw(1)};
	> p {
		color: ${$color("dark-tint")};
	}
`;
