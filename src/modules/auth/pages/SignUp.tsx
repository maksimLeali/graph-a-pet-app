import { IonButton } from "@ionic/react";
import { useCookies } from "react-cookie";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TextInput } from "../../../components";
import { apolloClient } from "../../../main";
import { MutationSignUpArgs } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";
import { useSignUpMutation } from "../operations/__generated__/signup.generated";



export const SignUp = () => {
    const { register, handleSubmit } = useForm<MutationSignUpArgs>({ mode: "onChange" });

    const { t } = useTranslation();
    if (window.PublicKeyCredential) {
    
        
        
      } else {
        
      }
    const [signup, { loading }] = useSignUpMutation({
        onCompleted: ({ signUp }) => {
            console.log("completed");
            if (signUp.error) {
                toast.error(t("errors.login"));
                return;
            }
            
        },
        onError: (error) => {
            toast.error(t("errors.login"));
        },
    });

    return (
        <Container>
            <Form
                onSubmit={handleSubmit((variables) => {
                    console.log("vars", variables);
                    console.log(apolloClient);
                    return signup({ variables } as any);
                })}
            >
                <TextInput name="firstName" innerRef={register} ntTextLabel="First name"/>
                <TextInput name="lasrName" innerRef={register} ntTextLabel="Last name"/>
                <TextInput
                    name="email"
                    innerRef={register}
                    ntTextLabel="Email"
                />

                <TextInput name="password" innerRef={register} ntTextLabel="Password"/>

                <IonButton type="submit" >{"Sign Up"} </IonButton>
            </Form>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const Form = styled.form`
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 60px;
    padding-top: 30px;
`;
