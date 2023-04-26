import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import styled from 'styled-components';
import { Pets } from '../components';



export const Home: React.FC = () => {
  return (
    <Container>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Pets />
      </IonContent>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  
`