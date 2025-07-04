import { Redirect, Route, Switch } from './components';
import { IonReactRouter } from '@ionic/react-router';
import type { RedirectProps } from 'react-router-dom'
import { IonRouterOutlet } from '@ionic/react';
import { AuthenticatedRoute } from '../components';
import { AuthRouter, HomeRouter, PetsRouter, EventsRouter, BoardRouter, SettingsRouter } from '../modules';
import { AuthLayout } from '../layouts';


export const AppRouter = ()=> {
    
    return (
        <IonReactRouter>
            <IonRouterOutlet>
                
                <Switch>
                <AuthenticatedRoute path="/home" component={()=><HomeRouter />} />    
                <AuthenticatedRoute path="/pets" component={()=><PetsRouter />} />    
                <AuthenticatedRoute path="/board" component={()=><BoardRouter />} />    
                <AuthenticatedRoute path="/events" component={()=><EventsRouter />} />    
                <AuthenticatedRoute path="/settings" component={()=><SettingsRouter />} />    
                
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