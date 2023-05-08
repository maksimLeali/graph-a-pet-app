import { IonButton, IonIcon } from "@ionic/react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TextInput } from "../../../components";
import { MutationLoginArgs } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";
import { useHistory } from "react-router";


export const Login: React.FC = ()  => {
    const { register, handleSubmit } = useForm<MutationLoginArgs>({ mode: "onChange" });
    const [cookie, setCookie] = useCookies(["jwt"]);
    const history = useHistory()
    let timeout: string | number | NodeJS.Timeout | null | undefined = null;
    const [login, { loading }] = useLoginMutation({
        onCompleted: ({ login }) => {
            console.log("completed");
            console.log(login)
            if (login.error) {
                toast.error(t("errors.login"));
                return;
            }
            console.log('*****')
            if (login.user && login.token) {
                
                setCookie("jwt", login.token);
            }
            toast.success(t("success.login"))
            timeout = setTimeout(()=> {
                if(timeout) clearTimeout(timeout);
                return history.push('/home')
            }, 500)

        },
        onError: (error) => {
            console.log(error)
            toast.error(t("errors.login"));
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
            <Form
                onSubmit={handleSubmit((variables) => login({ variables } as any))}
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
