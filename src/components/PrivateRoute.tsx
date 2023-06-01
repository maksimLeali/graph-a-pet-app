import { useCookies } from "react-cookie";
import { Redirect, Route } from "react-router-dom";
import { MainLayout } from "../layouts";
import { UserContextProvider } from "../contexts/UserContext";

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
    console.log(window.location.pathname)
    localStorage.setItem('userLastLocation',window.location.pathname);
    console.log('********')
    const [cookies, setCookie ] = useCookies(['jwt'])
    
    
    return (
      <Route
        {...rest}
        render={(props) => {
          // return (
          return cookies.jwt ? (
            <MainLayout >
              <UserContextProvider >

              <Component {...props} />
              </UserContextProvider>
            </MainLayout>
          ) 
          : (
            <Redirect to="/auth/login" />
          );
        }}
      />
    );
  };