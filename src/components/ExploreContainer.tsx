import './ExploreContainer.css';
import styled from 'styled-components'
interface ContainerProps { }

export const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <Container className='container'>

      <strong>Ready to create an app?</strong>
      <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    </Container>
  );
};



const Container = styled.div`
  
  background-color: var(--ion-color-secondary);
`