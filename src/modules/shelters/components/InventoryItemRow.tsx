import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Icon } from "@components";
import { IconName } from "../../../components/icons/iconName";
import { $color, $uw } from "@theme";
import { InventoryCategory, MovementType } from "@types";
import { MinInventoryItemFragment } from "../operations/__generated__/MinInventoryItem.generated";
import { ActionMenu, ActionMenuItem } from "./ActionMenu";

type Props = {
	item: MinInventoryItemFragment;
	onMovement: (itemId: string, type: MovementType) => void;
	onEdit: (itemId: string) => void;
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

export const InventoryItemRow: React.FC<Props> = ({ item, onMovement, onEdit, onDelete }) => {
	const { t } = useTranslation();

	const menuItems: ActionMenuItem[] = [
		{
			icon: "remove",
			label: t("shelters.inventory.consume"),
			onClick: () => onMovement(item.id, MovementType.Consumption),
		},
		{
			icon: "add",
			label: t("shelters.inventory.restock"),
			onClick: () => onMovement(item.id, MovementType.Restock),
		},
		{ icon: "pencil", label: t("actions.edit"), onClick: () => onEdit(item.id) },
		{
			icon: "trashOutline",
			label: t("actions.delete"),
			tone: "danger",
			onClick: () => onDelete(item.id),
		},
	];

	return (
		<Row $low={item.is_below_threshold}>
			<IconBox>
				<Icon name={CATEGORY_ICON[item.category]} color="light" size="16px" />
			</IconBox>
			<Info>
				<Name>{item.name}</Name>
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
			<ActionMenu items={menuItems} />
		</Row>
	);
};

const Row = styled.div<{ $low: boolean }>`
	width: 100%;
	min-height: 56px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 14px;
	background: ${({ $low }) => ($low ? "rgba(245, 196, 24, 0.1)" : $color("background"))};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.12);
`;

const IconBox = styled.div`
	flex: 0 0 auto;
	width: 34px;
	height: 34px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${$color("primary")};
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const Name = styled.span`
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 1.2;
`;

const Sub = styled.span`
	font-size: 1.2rem;
	color: ${$color("medium")};
	line-height: 1.2;
`;

const Qty = styled.div<{ $low: boolean }>`
	flex: 0 0 auto;
	display: flex;
	align-items: baseline;
	gap: 3px;
	> b {
		font-size: 2rem;
		font-weight: 800;
		color: ${({ $low }) => ($low ? "#f5c518" : "#34d399")};
	}
	> span {
		font-size: 1.1rem;
		color: ${$color("medium")};
	}
`;
