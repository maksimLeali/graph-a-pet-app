import { IonButton, IonIcon } from "@ionic/react";
import { useCookies } from "react-cookie";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SubmitInput, TextInput } from "../../../components";
import { MutationLoginArgs } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";
import { useHistory } from "react-router";
import { useUserContext } from "../../../contexts";


export const Login: React.FC = ()  => {
    const methods = useForm<MutationLoginArgs>({ mode: "onChange" });
    const [cookie, setCookie] = useCookies(["jwt", "user"]);
    const history = useHistory()
    const { setContextUser } = useUserContext()
    let timeout: string | number | NodeJS.Timeout | null | undefined = null;
    const [login, { loading }] = useLoginMutation({
        onCompleted: ({ login }) => {
            if (!login.user || !login.token) {
                toast.error(t("message.errors.login"));
                return
            }
            setCookie("jwt", login.token);
            setCookie("user", JSON.stringify(login.user));
            toast.success(t("message.success.login"))
            timeout = setTimeout(()=> {
                if(timeout) clearTimeout(timeout);
                return history.push('/home')
            }, 500)

        },

    });
   
    const { t } = useTranslation();
    // if (window.PublicKeyCredential) {
    
    //     // do your webauthn stuff
        
    //   } else {
    //     // wah-wah, back to passwords for you
    //   }
    // login({variables: {email: "mario", password: 'pp'}})
    

    return (
        
        <Container>
            <FormProvider {...methods}>
                <Form
                    onSubmit={methods.handleSubmit((variables) => login({ variables } as any))}
                >
                    <TextInput
                        name="email"
                        required
                        registerOptions={{pattern:  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/}}
                        ntTextLabel="Email"
                    />
                    <TextInput type='password' name="password" ntTextLabel="Password" />
                    <SubmitInput color="primary">{t('auth.login')} </SubmitInput>

                </Form>
            </FormProvider>
      </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    > button {
        width: 100px;
        height: 30px;
    }
`;

const Form = styled.form`
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 60px;
    padding-top: 30px;
`;
