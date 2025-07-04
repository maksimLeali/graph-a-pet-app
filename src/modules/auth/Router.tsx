import { Redirect, Route } from "@router-components";
import { useRouteMatch } from 'react-router-dom';
import {Login, SignUp, Verify} from '.'
export const AuthRouter = ()=> {
    const { path } = useRouteMatch()
    return (
        <>
            <Route exact path={`${path}`}>                
                <Redirect to={`${path}/login`} />
            </Route>
            <Route exact path={`${path}/login`}>
                <Login />
            </Route>
            <Route exact path={`${path}/signup`}>
                <SignUp />
            </Route>
            <Route exact path={`${path}/verify`}>
                <Verify />
            </Route>
        </>
    )
}