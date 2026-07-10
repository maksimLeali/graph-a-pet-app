import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useModal } from "@contexts";
import { WeightPromptModal } from "../components/WeightPromptModal";
import { useGetLatestPetWeightLazyQuery } from "../../pets/operations/__generated__/getLatestPetWeight.generated";
import { useCreatePetWeightMutation } from "../../pets/operations/__generated__/createPetWeight.generated";

const STALE_AFTER_DAYS = 7;

// Dopo un rating di passeggiata, se l'ultimo peso registrato per il cane
// risale a più di una settimana fa (o non esiste), chiede se aggiornarlo.
export const useWeightUpdatePrompt = () => {
	const { t } = useTranslation();
	const { openModal, closeModal } = useModal();
	const [getLatestWeight] = useGetLatestPetWeightLazyQuery({ fetchPolicy: "no-cache" });
	const [createWeight] = useCreatePetWeightMutation({
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const maybePromptWeightUpdate = async (petId: string, petName: string) => {
		const res = await getLatestWeight({ variables: { pet_id: petId } });
		const latest = res.data?.getLatestPetWeight?.weight;
		const stale =
			!latest || dayjs(latest.created_at).isBefore(dayjs().subtract(STALE_AFTER_DAYS, "day"));
		if (!stale) return;

		const value = { current: "" };
		openModal({
			onClose: closeModal,
			onCancel: closeModal,
			onConfirm: async () => {
				const weight_kg = Number(value.current);
				if (weight_kg > 0) {
					await createWeight({ variables: { data: { pet_id: petId, weight_kg } } });
					toast.success(t("stats.weight_updated_ok"));
				}
				closeModal();
			},
			children: (
				<WeightPromptModal petName={petName} onChange={(v) => (value.current = v)} />
			),
		});
	};

	return { maybePromptWeightUpdate };
};
