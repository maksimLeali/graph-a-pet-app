import { IonButton, IonIcon } from "@ionic/react";
import { useCookies } from "react-cookie";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TextInput } from "../../../components";
import { apolloClient } from "../../../main";
import { MutationLoginArgs } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";


export const Login = () => {
    const { register, handleSubmit } = useForm<MutationLoginArgs>({ mode: "onChange" });

    const { t } = useTranslation();
    if (window.PublicKeyCredential) {
    
        // do your webauthn stuff
        
      } else {
        // wah-wah, back to passwords for you
      }
    const [login, { loading }] = useLoginMutation({
        onCompleted: ({ login }) => {
            console.log("completed");
            if (login.error) {
                toast.error(t("errors.login"));
                return;
            }
            if (login.user && login.token) {
                const [cookie, setCookie] = useCookies(["jwt"]);
                setCookie("jwt", login.token);
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
                    return login({ variables } as any);
                })}
            >
                <TextInput
                    name="email"
                    innerRef={register}
                    ntTextLabel="Email"
                />
                <TextInput type='password' name="password" innerRef={register} ntTextLabel="Password"/>
                <IonButton type="submit" >{"Login"} </IonButton>
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
