import { IonApp,  setupIonicReact } from '@ionic/react';
import { AppRouter } from './router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from './contexts';

setupIonicReact();

const App: React.FC = () => (

    <IonApp>
      <AppContextProvider>
      <Toaster

            
            containerStyle={{ fontFamily: "'Karla', sans-serif" ,fontSize: '18px' }}
            />
      <AppRouter/>
      </AppContextProvider>
    </IonApp>
);

export default App;

