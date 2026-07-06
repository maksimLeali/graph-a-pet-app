import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Icon } from "@components";
import { IconName } from "../../../components/icons/iconName";
import { $color, $uw } from "@theme";
import { InventoryCategory, MovementType } from "@types";
import { MinInventoryItemFragment } from "../operations/__generated__/MinInventoryItem.generated";

type Props = {
	item: MinInventoryItemFragment;
	onMovement: (itemId: string, type: MovementType) => void;
	onDelete: (itemId: string) => void;
};

const CATEGORY_ICON: Record<InventoryCategory, IconName> = {
	[InventoryCategory.FoodDry]: "nutrition",
	[InventoryCategory.FoodWet]: "fishOutline",
	[InventoryCategory.Medicine]: "medkit",
	[InventoryCategory.Hygiene]: "sparkles",
	[InventoryCategory.Equipment]: "construct",
	[InventoryCategory.Other]: "cubeOutline",
};

export const InventoryItemRow: React.FC<Props> = ({ item, onMovement, onDelete }) => {
	const { t } = useTranslation();
	return (
		<Row $low={item.is_below_threshold}>
			<IconBox>
				<Icon name={CATEGORY_ICON[item.category]} color="light" />
			</IconBox>
			<Info>
				<Name>
					{item.name}
					{item.is_below_threshold && (
						<Icon name="warning" color="warning" size="14px" />
					)}
				</Name>
				<Sub>
					{t(`shelters.categories.${item.category.toLowerCase()}`)}
					{item.minimum_threshold != null &&
						` · ${t("shelters.inventory.min")} ${item.minimum_threshold}`}
				</Sub>
			</Info>
			<Qty $low={item.is_below_threshold}>
				<b>{item.current_quantity}</b>
				<span>{item.unit}</span>
			</Qty>
			<Actions>
				<Round $c="danger" onClick={() => onMovement(item.id, MovementType.Consumption)}>
					<Icon name="remove" color="light" size="18px" />
				</Round>
				<Round $c="success" onClick={() => onMovement(item.id, MovementType.Restock)}>
					<Icon name="add" color="light" size="18px" />
				</Round>
				<Round $c="medium" onClick={() => onDelete(item.id)}>
					<Icon name="trashOutline" color="light" size="14px" />
				</Round>
			</Actions>
		</Row>
	);
};

const Row = styled.div<{ $low: boolean }>`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.25)};
	border-radius: 14px;
	background: ${({ $low }) =>
		$low ? "rgba(var(--ion-color-warning-rgb), 0.12)" : $color("background")};
	border: 1px solid
		${({ $low }) =>
			$low
				? "rgba(var(--ion-color-warning-rgb), 0.4)"
				: "rgba(var(--ion-color-primary-rgb), 0.2)"};
`;

const IconBox = styled.div`
	flex: 0 0 auto;
	width: ${$uw(3.5)};
	height: ${$uw(3.5)};
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
	> .icon-wrapper {
		width: ${$uw(1.8)};
		height: ${$uw(1.8)};
	}
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.25)};
`;

const Name = styled.span`
	font-size: 1.6rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
`;

const Sub = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
`;

const Qty = styled.div<{ $low: boolean }>`
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: ${$uw(4)};
	> b {
		font-size: 1.8rem;
		font-weight: 800;
		color: ${({ $low }) => $color($low ? "warning" : "primary")};
	}
	> span {
		font-size: 1.1rem;
		color: ${$color("medium")};
	}
`;

const Actions = styled.div`
	flex: 0 0 auto;
	display: flex;
	gap: ${$uw(0.4)};
`;

const Round = styled.button<{ $c: string }>`
	width: ${$uw(2.8)};
	height: ${$uw(2.8)};
	border: none;
	border-radius: 999px;
	background: ${({ $c }) => $color($c)};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;
