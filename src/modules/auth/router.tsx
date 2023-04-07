import { Redirect, Route, useRouteMatch } from 'react-router-dom';
import {Login} from '.'
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

        </>
    )
}