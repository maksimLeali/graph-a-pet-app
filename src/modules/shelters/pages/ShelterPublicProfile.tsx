import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { TextInput, Toggle } from "@components";
import { RoleLevel } from "@types";
import { $color, $uw } from "@theme";

import { useGetShelterPublicProfileQuery } from "../operations/__generated__/getShelterPublicProfile.generated";
import { useUpdateShelterPublicProfileMutation } from "../operations/__generated__/updateShelterPublicProfile.generated";
import { useMyShelterRole } from "../hooks/useMyShelterRole";

export const ShelterPublicProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { role: myRole } = useMyShelterRole(id);
	const canManage = myRole === RoleLevel.Owner || myRole === RoleLevel.Manager;

	useEffect(() => {
		setPage({ name: t("shelters.public_profile.title") });
	}, []);

	const { data, loading } = useGetShelterPublicProfileQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { id },
	});
	const shelter = data?.getShelter?.shelter ?? undefined;

	const [form, setForm] = useState({
		public_description: "",
		public_contact_email: "",
		public_contact_phone: "",
		accepts_volunteers: false,
		public_location_label: "",
	});
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		if (!shelter || hydrated) return;
		setForm({
			public_description: shelter.public_description ?? "",
			public_contact_email: shelter.public_contact_email ?? "",
			public_contact_phone: shelter.public_contact_phone ?? "",
			accepts_volunteers: shelter.accepts_volunteers,
			public_location_label: shelter.public_location_label ?? "",
		});
		setHydrated(true);
	}, [shelter, hydrated]);

	const [updateProfile, { loading: saving }] = useUpdateShelterPublicProfileMutation();

	const onSave = async () => {
		const res = await updateProfile({
			variables: {
				id,
				data: {
					public_description: form.public_description || undefined,
					public_contact_email: form.public_contact_email || undefined,
					public_contact_phone: form.public_contact_phone || undefined,
					accepts_volunteers: form.accepts_volunteers,
					public_location_label: form.public_location_label || undefined,
				},
			},
		});
		const result = res.data?.updateShelter;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.public_profile.saved_ok"));
	};

	return (
		<IonContent>
			<Header>
				<h2 className={loading ? "skeleton" : ""}>
					{shelter ? t("shelters.public_profile.title") : ""}
				</h2>
			</Header>

			{!loading && !canManage && (
				<Message>{t("shelters.invites.no_permission")}</Message>
			)}

			{shelter && canManage && (
				<Section>
					<Hint>{t("shelters.public_profile.hint")}</Hint>
					<Form>
						<TextInput
							ntTextLabel={t("shelters.public_profile.description") ?? ""}
							value={form.public_description}
							onChange={(v) => setForm({ ...form, public_description: v })}
						/>
						<TextInput
							ntTextLabel={t("shelters.public_profile.contact_email") ?? ""}
							inputMode="email"
							value={form.public_contact_email}
							onChange={(v) => setForm({ ...form, public_contact_email: v })}
						/>
						<TextInput
							ntTextLabel={t("shelters.public_profile.contact_phone") ?? ""}
							value={form.public_contact_phone}
							onChange={(v) => setForm({ ...form, public_contact_phone: v })}
						/>
						<TextInput
							ntTextLabel={t("shelters.public_profile.location_label") ?? ""}
							value={form.public_location_label}
							onChange={(v) => setForm({ ...form, public_location_label: v })}
						/>
						<CheckboxRow>
							<Toggle
								value={form.accepts_volunteers}
								onChange={(v) => setForm({ ...form, accepts_volunteers: v })}
							/>
							<span>{t("shelters.public_profile.accepts_volunteers")}</span>
						</CheckboxRow>
						<SaveBtn type="button" disabled={saving} onClick={onSave}>
							{t("shelters.public_profile.save")}
						</SaveBtn>
					</Form>
				</Section>
			)}
		</IonContent>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(2)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
		min-height: 28px;
	}
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(3)};
`;

const Hint = styled.p`
	font-size: 1.3rem;
	color: ${$color("medium")};
	margin: 0 0 ${$uw(1.5)};
`;

const Form = styled.div`
	display: flex;
	flex-direction: column;
`;

const CheckboxRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
	margin: ${$uw(0.5)} 0 ${$uw(1.5)};
	> span {
		font-size: 1.4rem;
		color: ${$color("dark")};
	}
`;

const SaveBtn = styled.button`
	align-self: flex-start;
	margin-top: ${$uw(1)};
	border: none;
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
