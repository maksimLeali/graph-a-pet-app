import { useCookies } from "react-cookie";
import { Redirect, Route } from "react-router-dom";

type Props = {
    
}


export const AuthenticatedRoute = ({
    header,
    component: Component,
    ...rest
  }: {
    component: React.ElementType;
    [key: string]: any;
  }) => {
    const [cookies, setCookie ] = useCookies(['jwt'])
    console.log(cookies.jwt)

    return (
      <Route
        {...rest}
        render={(props) => {
          return cookies.jwt ? (
            <Component {...props} />
          ) : (
            <Redirect to="/auth/login" />
          );
        }}
      />
    );
  };