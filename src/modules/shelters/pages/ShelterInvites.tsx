import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { TextInput, SelectInput, Option, PullToRefresh } from "@components";
import { I18NKey } from "@i18n";
import { RoleLevel } from "@types";
import { $color, $uw } from "@theme";

import { useCreateShelterInviteMutation } from "../operations/__generated__/createShelterInvite.generated";
import { useMyShelterRole } from "../hooks/useMyShelterRole";

export const ShelterInvites: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const { role: myRole } = useMyShelterRole(id);
	const canManage = myRole === RoleLevel.Owner || myRole === RoleLevel.Manager;

	useEffect(() => {
		setPage({ name: t("shelters.invites.title") });
	}, []);

	const [createInvite, { loading }] = useCreateShelterInviteMutation();

	const [userId, setUserId] = useState("");
	const [role, setRole] = useState<RoleLevel>(RoleLevel.Staff);

	const onSend = async () => {
		if (!userId.trim()) {
			toast.error(t("shelters.invites.user_required"));
			return;
		}
		const res = await createInvite({
			variables: { data: { shelter_id: id, user_id: userId.trim(), role } },
		});
		const result = res.data?.createShelterInvite;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.invites.sent_ok"));
		setUserId("");
	};

	return (
		<IonContent>
		    <PullToRefresh />
			<Header>
				<h2>{t("shelters.invites.title")}</h2>
			</Header>

			{!canManage ? (
				<Message>{t("shelters.invites.no_permission")}</Message>
			) : (
				<Section>
					<Hint>{t("shelters.invites.hint")}</Hint>
					<Form>
						<TextInput
							ntTextLabel={t("shelters.invites.user_id_placeholder") ?? ""}
							value={userId}
							onChange={setUserId}
						/>
						<SelectInput
							currentValue={role}
							onSelected={(v) => setRole(v ?? RoleLevel.Staff)}
							options={Object.values(RoleLevel)
								.filter((r) => r !== RoleLevel.Owner)
								.map((r): Option => ({
									value: r,
									label: t(`shelters.roles.${r.toLowerCase()}` as I18NKey),
								}))}
						/>
						<SaveBtn type="button" disabled={loading} onClick={onSend}>
							{t("shelters.invites.send")}
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
	}
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px;
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

const SaveBtn = styled.button`
	align-self: flex-start;
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
