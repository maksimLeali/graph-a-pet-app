import { Redirect, Route, Switch } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { AuthenticatedRoute } from '../components';
import { AuthRouter, HomeRouter, PetsRouter } from '../modules';
import { AuthLayout } from '../layouts';


export const AppRouter = ()=> {
    
    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <Switch>
                <AuthenticatedRoute path="/home" component={()=><HomeRouter />} />    
                <AuthenticatedRoute path="/pets" component={()=><PetsRouter />} />    
                <AuthenticatedRoute path="/board" component={()=><PetsRouter />} />    
                <AuthenticatedRoute path="/events" component={()=><PetsRouter />} />    
                <Route path="/auth">
                    <AuthLayout>
                        <AuthRouter />
                    </AuthLayout>
                </Route>
                <Route path="/">
                    <Redirect to="/home" />
                </Route>
                </Switch>
            </IonRouterOutlet>
        </IonReactRouter>
    )
}