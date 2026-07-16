import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useLocation } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Icon, PullToRefresh } from "@components";
import { MovementType } from "@types";
import { $color, $uw } from "@theme";
import { InventoryItemRow } from "../components/InventoryItemRow";
import { useShelterInventory } from "../hooks/useShelterInventory";
import { useCreateShelterInventoryMovementMutation } from "../operations/__generated__/createShelterInventoryMovement.generated";
import { useDeleteShelterInventoryItemMutation } from "../operations/__generated__/deleteShelterInventoryItem.generated";

export const ShelterInventory: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();
	const location = useLocation();
	const { items, loading, error, refetch } = useShelterInventory(id);

	// filtro arrivando dalla riga "scorte sotto soglia" della pagina rifugio
	const [lowStockOnly, setLowStockOnly] = useState(
		() => new URLSearchParams(location.search).get("filter") === "low_stock"
	);

	const shownItems = useMemo(
		() =>
			lowStockOnly
				? items.filter((item) => item.is_below_threshold)
				: items,
		[items, lowStockOnly]
	);

	useEffect(() => {
		setPage({ name: t("shelters.tabs.inventory") });
	}, []);

	const onError = () => toast.error(t("messages.errors.fetch"));
	const [createMovement] = useCreateShelterInventoryMovementMutation({ onError });
	const [deleteItem] = useDeleteShelterInventoryItemMutation({ onError });

	const onMovement = async (itemId: string, type: MovementType) => {
		await createMovement({
			variables: { data: { item_id: itemId, movement_type: type, quantity: 1 } },
		});
		refetch();
	};

	const onDelete = async (itemId: string) => {
		await deleteItem({ variables: { id: itemId } });
		toast.success(t("shelters.inventory.deleted_ok"));
		refetch();
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2>{t("shelters.tabs.inventory")}</h2>
				<AddButton
					type="button"
					onClick={() => history.push(`/shelters/detail/${id}/inventory/new`)}
				>
					<Icon name="add" color="light" size="18px" />
					<span>{t("shelters.inventory.add")}</span>
				</AddButton>
			</Header>

			{lowStockOnly && (
				<FilterBanner>
					<span>{t("shelters.overview.filter_low_stock")}</span>
					<ClearFilter
						type="button"
						onClick={() => setLowStockOnly(false)}
					>
						{t("shelters.overview.filter_clear")}
					</ClearFilter>
				</FilterBanner>
			)}

			<List>
				{shownItems.map((item) => (
					<InventoryItemRow
						key={item.id}
						item={item}
						onMovement={onMovement}
						onEdit={(itemId) =>
							history.push(
								`/shelters/detail/${id}/inventory/${itemId}/edit`
							)
						}
						onDelete={onDelete}
					/>
				))}
			</List>

			{!loading && !error && shownItems.length === 0 && (
				<Message>{t("shelters.inventory.empty")}</Message>
			)}
			{!loading && error && <Message>{error}</Message>}
		</IonContent>
	);
};

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	padding: ${$uw(2)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
	}
`;

const AddButton = styled.button`
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.75)} ${$uw(1.25)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.4rem;
	font-weight: 700;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const FilterBanner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
	margin: 0 12px;
	padding: ${$uw(0.5)} ${$uw(1)};
	border-radius: 10px;
	background: ${$color("status.warningBg")};
	> span {
		font-size: 1.2rem;
		font-weight: 700;
		color: ${$color("status.warning")};
	}
`;

const ClearFilter = styled.button`
	border: none;
	background: transparent;
	padding: ${$uw(0.5)};
	font-size: 1.2rem;
	font-weight: 700;
	color: ${$color("status.warning")};
	text-decoration: underline;
	cursor: pointer;
`;

const List = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1)} 12px ${$uw(4)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
