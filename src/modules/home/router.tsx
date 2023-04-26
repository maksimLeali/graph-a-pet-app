import { Redirect, Route, useRouteMatch } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
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