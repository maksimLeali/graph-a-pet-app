import { IonButton } from "@ionic/react";
import { useCookies } from "react-cookie";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { Icon, SelectInput, SubmitInput, TextInput } from "../../../components";
import { apolloClient } from "../../../main";
import { MutationSignUpArgs, UserCreate } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";
import { useSignUpMutation } from "../operations/__generated__/signup.generated";
import _ from 'lodash'

export const SignUp = () => {
  const methods = useForm<UserCreate>({ mode: "onSubmit" });
  let timeout: string | number | NodeJS.Timeout | null | undefined = null;
  const { t } = useTranslation();
  const history = useHistory()
  const [signup, { loading }] = useSignUpMutation({
    onCompleted: ({ signUp }) => {
      console.log("completed");
      if (signUp.error) {
        toast.error(t("messages.errors.login"));
        return;
      }
      toast.success(t("messages.success.signup"))
      timeout = setTimeout(()=> {
          if(timeout) clearTimeout(timeout);
          return history.push('/auth')
      }, 500)
    },
  
  });

  return (
    <Container>
      <FormProvider {...methods}>
        <Form
          onSubmit={methods.handleSubmit(
            (variables) => {
              console.log("vars", variables);
              console.log(apolloClient);
              return signup({ variables: { data: _.omit(variables, 'confirm_password') } });
            },
            (err, e) => {
              console.log(methods.getValues());
              console.log("errore");
              console.error(err, e);
            }
          )}
        >
          <TextInput required textLabel="auth.first_name" name="first_name" />
          <TextInput required textLabel="auth.last_name" name="last_name" />
          <TextInput
            required
            textLabel="auth.email"
            name="email"
            registerOptions={{
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "messages.errors.invalid_email",
              },
            }}
          />
          <TextInput
            required
            textLabel="auth.password"
            name="password"
            type="password"
          />
          <TextInput
            required
            textLabel="auth.confirm_password"
            name="confirm_password"
            type="password"
            ntTextLabel="Confirm Password"
            registerOptions={{
              validate: (value) =>
                value == methods.getValues("password") ||
                "messages.errors.password_mismatch",
            }}
          />

          <SubmitInput color="primary">{t("auth.signup")}</SubmitInput>
        </Form>
      </FormProvider>
      <InfoBox>
        <span>
          {t("auth.already_registered")}{" "}
          <Link to="/auth/login">
            {t("auth.login")}
            <Icon size="1rem" name="enterOutline" color="primary" />
          </Link>
        </span>
      </InfoBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Form = styled.form`
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
`;

const InfoBox = styled.div`
    width:100%;
    color: var(--ion-color-dark);
    padding: 10px 24px;
    > span {
        display:flex;
        width:100%;
        font-size: .8rem;
        gap: 5px;
        > a {
            text-decoration:none ;
            display:flex ;
            align-items:flex-start ;
            gap: 5px;
            > .icon-wrapper {
                height: 1rem;
                align-items:center ;
            }
        }
    }
`;
