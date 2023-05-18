import { Route, useRouteMatch } from 'react-router-dom';
import { Home } from '.';

export const HomeRouter = ()=> {
    const { path } = useRouteMatch()
    return (
        <>
            <Route path={`${path}`}>
                   <Home />
            </Route>
        </>
    )
}