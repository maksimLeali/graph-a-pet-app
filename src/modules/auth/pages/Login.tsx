import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";

type Inputs = {
    email: string;
    password: string;
};

export const Login = () => {
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    console.log("********");
    return (
      <Container>

        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input type="email"  {...register("email")} />
            <input type="password"  {...register("password")} />

            <input type="submit" />
        </Form>
      </Container>
    );
};

const Container = styled.div`
  
`

const Form = styled.form`
`;
