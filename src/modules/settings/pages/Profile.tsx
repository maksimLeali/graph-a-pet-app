import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import styled from "styled-components";

import { MinUserFragment } from "@graphql_generated/minUser.generated";
import { Image2x, SubmitInput, TextInput } from "@components";
import { $cssTRBL, $uw, $color } from "@theme";
import { useUserContext } from "@contexts";

type Props = {};

export const Profile: React.FC<Props> = React.memo(({}) => {
	const { user, setPage } = useUserContext();

	const methods = useForm<Partial<MinUserFragment>>({
		mode: "onSubmit",
		defaultValues: {
			...user,
		},
	});
	const { t } = useTranslation();

	useEffect(() => {
		setPage({ name: "settings", visible: false });
	}, []);

	return (
		<FormProvider {...methods}>
			<Form
				onSubmit={methods.handleSubmit((data) => {
					console.log(data);
				})}
			>
				<Top>
					<Half>
						{user.profile_picture ? (
							<Image2x id={user.profile_picture.id} />
						) : (
							<></>
						)}
					</Half>
					<Half>
						<TextInput
							textLabel="auth.first_name"
							name="first_name"
						/>
						<TextInput
							textLabel="auth.last_name"
							name="last_name"
						/>
					</Half>
				</Top>
				<Row>
					<TextInput
						disabled
						textLabel="auth.email"
						name="email"
						disabledColor="primary"
					/>
				</Row>

				<SubmitInput color="primary">{t("actions.save")}</SubmitInput>
			</Form>
		</FormProvider>
	);
});

const Form = styled.form`
	padding: ${$cssTRBL(1)};
	display: flex;
	flex-direction: column;
	height: calc(100dvh - ${$uw(12)});

	.submit-input {
		margin-top: auto;
	}
`;

const Top = styled.div`
	display: flex;
	margin-bottom: ${$uw(2)};
`;

const Half = styled.div`
	width: 50%;
	padding: ${$uw(1)};
	aspect-ratio: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
    >* {
        &:last-child{
            margin-bottom: 0;
        }
    }
	> .img2x {
		overflow: hidden;
		border-radius: 999px;
		border: 2px solid ${$color("primary")};
	}
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	> * {
		width: 100%;
	}
`;
