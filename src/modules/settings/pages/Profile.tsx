import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import styled from "styled-components";

import { MinUserFragment } from "@graphql_generated/minUser.generated";
import { Image2x, TextInput } from "@components";
import { $cssTRBL, $uw } from "@theme";
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
						<TextInput name="first_name" />
						<TextInput name="last_name" />
					</Half>
				</Top>
				<Row>
					<TextInput disabled name="email" disabledColor="primary" />
				</Row>
			</Form>
		</FormProvider>
	);
});

const Form = styled.form`
	padding: ${$cssTRBL(4, 1)};
`;

const Top = styled.div`
	display: flex;
	margin-bottom: ${$uw(2)};
`;

const Half = styled.div`
	width: 50%;
	padding: ${$uw(1)};
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Row = styled.div``;
