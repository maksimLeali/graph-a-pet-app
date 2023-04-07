import { Redirect, Route, Switch } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { AuthenticatedRoute } from '../components';
import { AuthRouter, HomeRouter, Login, } from '../modules';

export const AppRouter = ()=> {
    
    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <Switch>
                <AuthenticatedRoute exact path="/home" component={()=><HomeRouter />} />    
                <Route path="/auth">
                    <AuthRouter />
                </Route>
                <Route  path="/">
                    <Redirect to="/home" />
                </Route>
                </Switch>
            </IonRouterOutlet>
        </IonReactRouter>
    )
}