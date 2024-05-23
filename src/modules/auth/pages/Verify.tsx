import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { useCookies } from "react-cookie";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useVerifyMutation } from "../operations/__generated__/verifyUser.generated";
import { useResendCodeMutation } from "../operations/__generated__/resendCode.generated";

import {
	DateTimePicker,
	Icon,
	SubmitInput,
	TextInput,
} from "@components";
import {  MutationVerifyUserArgs } from "@types";
import { $color, $uw } from "@theme";

export const Verify: React.FC = () => {
	const methods = useForm<MutationVerifyUserArgs>({
		mode: "onSubmit",
	});
	const [disableResend, setDisableResend] = useState(false);
	const [cookie, setCookie] = useCookies(["jwt", "user"]);
	const history = useHistory();
	let timeout: string | number | NodeJS.Timeout | null | undefined = null;
	const [verify, { loading }] = useVerifyMutation({
		onCompleted: ({ verifyUser }) => {
			if (!verifyUser.user || !verifyUser.token) {
				toast.error(t("messages.errors.code"));
				return;
			}
			setCookie("jwt", verifyUser.token);
			setCookie("user", JSON.stringify(verifyUser.user));
			toast.success(t("messages.success.login"));
			timeout = setTimeout(() => {
				if (timeout) clearTimeout(timeout);
				const lastLocation = localStorage.getItem("userLastLocation");
				return history.push(lastLocation ?? "/events");
			}, 500);
		},
	});

	const [resendCode] = useResendCodeMutation({
		onCompleted: (response) => {
			setTimeout(() => {
				setDisableResend(false);
			}, 10000);
		},
	});

	const { t } = useTranslation();

	return (
		<Container>
			<FormProvider {...methods}>
				<h4>{t("auth.code")}</h4>
				<Form
					onSubmit={methods.handleSubmit((variables) => {
						verify({
							variables: {
								code: variables.code,
								email: cookie.user.email,
							},
						} as any);
					})}
				>
					<TextInput
						required
						name="code"
						textLabel="auth.insert_code"
					/>
					<SubmitInput color="primary">
						{t("auth.send_code")}
					</SubmitInput>
				</Form>
			</FormProvider>
			<InfoBox>
				<span>{t("auth.code_not_recived")}</span>
				<IonButton
					disabled={disableResend}
					onClick={() => {
						setDisableResend(true);
						if (!cookie.user) return;
						resendCode({ variables: { email: cookie.user.email } });
					}}
				>
					{t("auth.resend_code")}
				</IonButton>
			</InfoBox>
			<InfoBox>
				<span>
					{t("auth.already_registered")}{" "}
					<Link to="/auth/login">
						{t("auth.login")}
						<Icon
							size="2.4rem"
							name="enterOutline"
							color="primary"
						/>
					</Link>
				</span>
			</InfoBox>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;

	flex-direction: column;
	width: 100%;
	height: 100%;
	> button {
		width: 100px;
		height: 30px;
	}
	h4 {
		color: ${$color('dark')};
		align-self: flex-start;
		margin-top: ${$uw(10)};
		padding-left: ${$uw(1)};
		margin-bottom: ${$uw(6)};
	}
`;

const Form = styled.form`
	padding: 20px;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-top: 30px;
	margin-bottom: ${$uw(2)};
`;

const InfoBox = styled.div`
	width: 100%;
	color: ${$color('dark')};
	padding: 10px 24px;
	margin-bottom: ${$uw(6)};
	&:last-child {
		margin-bottom: auto;
	}
	> span {
		display: flex;
		width: 100%;
		font-size: 1.8rem;
		gap: 5px;

		> a {
			text-decoration: none;
			display: flex;
			align-items: flex-start;
			gap: 5px;
			> .icon-wrapper {
				height: 2rem;
				align-items: center;
			}
		}
	}
`;
