import { IonButton, IonIcon } from "@ionic/react";
import { useCookies } from "react-cookie";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Icon, SubmitInput, TextInput } from "../../../components";
import { MutationLoginArgs } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";
import { useHistory } from "react-router";
import { useUserContext } from "../../../contexts";
import { Link } from "react-router-dom";


export const Login: React.FC = ()  => {
    const methods = useForm<MutationLoginArgs>({ mode: "onSubmit" });
    const [cookie, setCookie] = useCookies(["jwt", "user"]);
    const history = useHistory()
    const { setContextUser } = useUserContext()
    let timeout: string | number | NodeJS.Timeout | null | undefined = null;
    const [login, { loading }] = useLoginMutation({
        onCompleted: ({ login }) => {
            if (!login.user || !login.token) {
                toast.error(t("messages.errors.login"));
                return
            }
            setCookie("jwt", login.token);
            setCookie("user", JSON.stringify(login.user));
            toast.success(t("messages.success.login"))
            timeout = setTimeout(()=> {
                if(timeout) clearTimeout(timeout);
                const lastLocation = localStorage.getItem('userLastLocation')
                return history.push( lastLocation ?? '/home')
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
                        inputMode="email"
                        required
                        registerOptions={{pattern:  {value :/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'messages.errors.invalid_email'}}}
                        textLabel="auth.email"
                    />
                    <TextInput required type='password' name="password" textLabel="auth.password" />
                    <SubmitInput color="primary">{t('auth.login')} </SubmitInput>

                </Form>
            </FormProvider>
            <InfoBox>
                <span>{t('auth.not_registered')} <Link to="/auth/signup">{t("auth.signup")}<Icon color="primary" size="2.5rem" name="idCardOutline" /></Link></span>
            </InfoBox>
      </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content:center ;
    flex-direction:column ;
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
    padding-top: 30px;
`;

const InfoBox = styled.div`
    width:100%;
    color: var(--ion-color-dark);
    padding: 10px 24px;
    > span {
        display:flex;
        width:100%;
        font-size: 1.2rem;
        gap: 5px;
        > a {
            text-decoration:none ;
            display:flex ;
            align-items:flex-start ;
            gap: 5px;
            > .icon-wrapper {
                height: 2rem;
                align-items:center ;
            }
        }
    }
`;