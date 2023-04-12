import { useCookies } from "react-cookie";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TextInput } from "../../../components";
import { apolloClient } from "../../../main";
import { useLoginMutation } from "../operations/__generated__/login.generated";

type Inputs = {
    email: string;
    password: string;
};

export const Login = () => {
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
    const { register, handleSubmit } = useForm<Inputs>({ mode: "onChange" });

    const { t } = useTranslation();

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
                    console.log(apolloClient)
                    return login({ variables } as any);
                })}
            >
                {/* register your input into the hook by invoking the "register" function */}
                <TextInput name="email" innerRef={register} />
                <input type="password" {...register("password")} />

                <input type="submit" />
            </Form>
        </Container>
    );
};

const Container = styled.div``;

const Form = styled.form`
padding: 20px;
`;
