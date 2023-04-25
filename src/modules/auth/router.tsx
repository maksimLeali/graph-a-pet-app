import { Redirect, Route, useRouteMatch } from 'react-router-dom';
import {Login, SignUp} from '.'
import { Auth } from '../../layouts';
export const AuthRouter = ()=> {
    const { path } = useRouteMatch()
    return (
        <>
            <Route exact path={`${path}`}>
                <Redirect to={`${path}/login`} />
            </Route>
            <Route exact path={`${path}/login`}>
                <Auth >
                    <Login />
                </Auth >
            </Route>
            <Route exact path={`${path}/signup`}>
                <SignUp />
            </Route>
        </>
    )
}