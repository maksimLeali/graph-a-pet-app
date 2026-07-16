import React, { useEffect, useState } from "react";
import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";

import { MinUserFragment } from "@graphql_generated/minUser.generated";
import { useUpdateUserMutation } from "../../../components/operations/__generated__/updateUser.generated";
import { Image2x, TextInput, Icon, PullToRefresh } from "@components";
import { UserPlaceholder } from "@components";
import { useUserContext, useModal } from "@contexts";
import { UserUpdate } from "@types";
import { I18NKey } from "@i18n";
import { $uw, $color } from "@theme";
import { ProfileImageEditor } from "../components";

type Props = {};

type EditableField = "first_name" | "last_name";

export const Profile: React.FC<Props> = React.memo(({}) => {
	const { user, setPage, updateUserData } = useUserContext();
	const { t } = useTranslation();
	const { openModal, closeModal } = useModal();
	const [imgOpen, setImgOpen] = useState(false);

	const methods = useForm<Pick<MinUserFragment, EditableField>>({
		mode: "onSubmit",
		defaultValues: {
			first_name: user.first_name,
			last_name: user.last_name,
		},
	});

	useEffect(() => {
		setPage({ name: "settings", visible: false });
	}, []);

	useEffect(() => {
		methods.reset({
			first_name: user.first_name,
			last_name: user.last_name,
		});
	}, [user.first_name, user.last_name]);

	const [updateUser] = useUpdateUserMutation({
		onCompleted: ({ updateUser }) => {
			if (!updateUser?.success || updateUser.error) {
				toast.error(
					updateUser?.error?.message
						? t(updateUser.error.message as I18NKey)
						: t("messages.errors.fetch")
				);
				return;
			}
			if (updateUser.user) updateUserData(updateUser.user);
			toast.success(t("messages.success.pet_updated"));
		},
		onError: () => toast.error(t("messages.errors.fetch")),
	});

	const saveField = (data: UserUpdate) =>
		updateUser({ variables: { id: user.id, data } });

	// annulla / X: ripristina il valore salvato
	const revert = (field: EditableField) => () => {
		methods.setValue(field, user[field]);
		closeModal();
	};

	const openFieldEdit = (
		field: EditableField,
		textLabel: I18NKey,
		buildData: () => UserUpdate
	) => {
		openModal({
			onClose: revert(field),
			onCancel: revert(field),
			onConfirm: async () => {
				const ok = await methods.trigger(field);
				if (!ok) return;
				await saveField(buildData());
				closeModal();
			},
			children: (
				<FormProvider {...methods}>
					<ModalField>
						<TextInput
							name={field}
							textLabel={textLabel}
							bgColor="light"
							required
						/>
					</ModalField>
				</FormProvider>
			),
		});
	};

	return (
		<IonContent>
			<PullToRefresh />
			<Container>
				<Top>
					<Avatar
						role="button"
						tabIndex={0}
						onClick={() => setImgOpen(true)}
					>
						{user.profile_picture ? (
							<Image2x id={user.profile_picture.id} />
						) : (
							<UserPlaceholder />
						)}
					</Avatar>
					<NameCol>
						<Row
							label={t("auth.first_name")}
							value={user.first_name || "—"}
							onEdit={() =>
								openFieldEdit("first_name", "auth.first_name", () => ({
									first_name: methods.getValues("first_name"),
								}))
							}
						/>
						<Row
							label={t("auth.last_name")}
							value={user.last_name || "—"}
							onEdit={() =>
								openFieldEdit("last_name", "auth.last_name", () => ({
									last_name: methods.getValues("last_name"),
								}))
							}
						/>
					</NameCol>
				</Top>

				<Fields>
					<ReadOnlyCard className="full">
						<CardLabel>{t("auth.email")}</CardLabel>
						<CardValueRow>
							<CardValue>{user.email || "—"}</CardValue>
						</CardValueRow>
					</ReadOnlyCard>
				</Fields>

				<ProfileImageEditor
					open={imgOpen}
					onClose={() => setImgOpen(false)}
					userId={user.id}
					mediaId={user.profile_picture?.id}
					onSaved={(newMediaId) =>
						updateUserData({ profile_picture: { id: newMediaId } })
					}
				/>
			</Container>
		</IonContent>
	);
});

type rowProps = {
	label: string;
	value: string;
	onEdit: () => void;
};

const Row: React.FC<rowProps> = ({ label, value, onEdit }) => (
	<Card role="button" tabIndex={0} onClick={onEdit}>
		<CardLabel>{label}</CardLabel>
		<CardValueRow>
			<CardValue>{value}</CardValue>
			<Chevron name="chevronForward" color="medium" />
		</CardValueRow>
	</Card>
);

const Container = styled.div`
	width: 100%;
`;

const Top = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: ${$uw(2)};
	padding: ${$uw(3)} 12px ${$uw(2)};
	box-sizing: border-box;
`;

const Avatar = styled.div`
	flex: 0 0 40%;
	max-width: 160px;
	aspect-ratio: 1/1;
	border: 2px solid ${$color("primary")};
	border-radius: 260px;
	overflow: hidden;
	cursor: pointer;
	> .img2x,
	> .avatar {
		width: 100%;
		height: 100%;
	}
`;

const NameCol = styled.div`
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Fields = styled.div`
	width: 100%;
	padding: 0 12px ${$uw(4)};
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${$uw(2.5)} ${$uw(2)};
	align-items: start;
`;

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.75)};
	border-radius: 12px;
	background: ${$color("background")};
	border: 1px solid rgba(255, 255, 255, 0.12);
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease;
	&:active {
		border-color: ${$color("primary")};
	}
	@media (hover: hover) {
		&:hover {
			border-color: ${$color("primary")};
		}
	}
	&.full {
		grid-column: 1 / -1;
	}
`;

const ReadOnlyCard = styled(Card)`
	cursor: default;
	&:active {
		border-color: rgba(255, 255, 255, 0.12);
	}
	@media (hover: hover) {
		&:hover {
			border-color: rgba(255, 255, 255, 0.12);
		}
	}
`;

const CardLabel = styled.span`
	font-size: 1.3rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.4px;
`;

const CardValueRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${$uw(1)};
`;

const CardValue = styled.span`
	font-size: 1.9rem;
	font-weight: 700;
	word-break: break-word;
`;

const Chevron = styled(Icon)`
	width: 18px;
	height: 18px;
	min-width: 18px;
	opacity: 0.6;
`;

const ModalField = styled.div`
	width: 100%;
	padding: ${$uw(4)} ${$uw(2)} ${$uw(2)};
	box-sizing: border-box;
`;
