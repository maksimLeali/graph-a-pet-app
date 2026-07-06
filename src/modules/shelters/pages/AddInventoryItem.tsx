import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { TextInput, SelectInput, NumberInput, SubmitInput, Option } from "@components";
import { InventoryCategory } from "@types";
import { $color, $cssTRBL, $uw } from "@theme";
import { useCreateShelterInventoryItemMutation } from "../operations/__generated__/createShelterInventoryItem.generated";

type FormValues = {
	name: string;
	category: InventoryCategory;
	unit: string;
	minimum_threshold?: string;
	initial_quantity?: string;
	notes?: string;
};

const num = (v?: string) =>
	v !== undefined && v !== "" && !isNaN(parseFloat(v)) ? parseFloat(v) : undefined;

export const AddInventoryItem: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();

	const [createItem, { loading }] = useCreateShelterInventoryItemMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const methods = useForm<FormValues>({ mode: "onSubmit" });

	useEffect(() => {
		setPage({ name: t("shelters.inventory.add") });
	}, []);

	const categoryOptions: Option[] = Object.values(InventoryCategory).map((key) => ({
		value: key,
		label: t(`shelters.categories.${key.toLowerCase()}`),
	}));

	const onSubmit = methods.handleSubmit(async (data) => {
		const res = await createItem({
			variables: {
				data: {
					shelter_id: id,
					name: data.name.trim(),
					category: data.category,
					unit: data.unit.trim(),
					minimum_threshold: num(data.minimum_threshold),
					initial_quantity: num(data.initial_quantity),
					notes: data.notes,
				},
			},
		});
		if (!res.data?.createShelterInventoryItem?.success) {
			toast.error(t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.inventory.created_ok"));
		history.replace(`/shelters/detail/${id}/inventory`);
	});

	return (
		<IonContent>
			<FormProvider {...methods}>
				<Form onSubmit={onSubmit}>
					<h3>{t("shelters.inventory.add")}</h3>

					<Field>
						<span>{t("shelters.inventory.name")}</span>
						<TextInput name="name" required textLabel="shelters.inventory.name" />
					</Field>

					<Field>
						<span>{t("shelters.inventory.category")}</span>
						<SelectInput
							name="category"
							options={categoryOptions}
							required
							textLabel="shelters.inventory.category"
						/>
					</Field>

					<Field>
						<span>{t("shelters.inventory.unit")}</span>
						<TextInput name="unit" required textLabel="shelters.inventory.unit_hint" />
					</Field>

					<Field>
						<span>{t("shelters.inventory.min")}</span>
						<NumberInput name="minimum_threshold" textLabel="shelters.inventory.min" />
					</Field>

					<Field>
						<span>{t("shelters.inventory.initial")}</span>
						<NumberInput name="initial_quantity" textLabel="shelters.inventory.initial" />
					</Field>

					<Field>
						<span>{t("shelters.inventory.notes")}</span>
						<TextInput name="notes" textLabel="shelters.inventory.notes" />
					</Field>

					<SubmitInput color="primary" disabled={loading}>
						{t("shelters.inventory.add")}
					</SubmitInput>
				</Form>
			</FormProvider>
		</IonContent>
	);
};

const Form = styled.form`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${$uw(2.5)};
	padding: ${$cssTRBL(3, 1)};
	box-sizing: border-box;
	> h3 {
		margin: 0;
		color: ${$color("primary")};
	}
	.submit-input {
		margin-top: auto;
	}
`;

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;
