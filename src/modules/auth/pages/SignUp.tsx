import { IonButton } from "@ionic/react";
import { useCookies } from "react-cookie";
import { useForm, SubmitHandler, FormProvider} from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SelectInput, SubmitInput, TextInput } from "../../../components";
import { apolloClient } from "../../../main";
import { MutationSignUpArgs } from "../../../types";
import { useLoginMutation } from "../operations/__generated__/login.generated";
import { useSignUpMutation } from "../operations/__generated__/signup.generated";



export const SignUp = () => {
    const methods = useForm<MutationSignUpArgs>({ mode: "onChange" });
    
    const { t } = useTranslation();
    
    
    const [signup, { loading }] = useSignUpMutation({
        onCompleted: ({ signUp }) => {
            console.log("completed");
            if (signUp.error) {
                toast.error(t("message.errors.login"));
                return;
            }
            
        },
        onError: (error) => {
            toast.error(t("message.errors.login"));
        },
    });

    return (
        <Container>
            <FormProvider {...methods}>
                <Form
                    onSubmit={methods.handleSubmit((variables) => {
                        console.log("vars", variables);
                        console.log(apolloClient);
                        return signup({ variables } as any);
                    }, (err, e)=> {
                        console.error(err,e)
                    })}
                >
                    <TextInput name="firstName"  ntTextLabel="First name"/>
                    <SelectInput ntTextLabel="Select example" name="test"  control={methods.control} options={[{label: "test", value :1},{label: "test2", value :2}]}/>
                 
                    <SubmitInput color="primary">
                        {t('auth.signup')}
                    </SubmitInput>
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
`;

const Form = styled.form`
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 60px;
    padding-top: 30px;
`;
