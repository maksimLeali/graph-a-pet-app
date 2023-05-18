import styled from "styled-components"
import { Icon } from "../components"
import { IonNavLink } from "@ionic/react"
import { ModalContextProvider } from "../contexts"



export const MainLayout:React.FC<{children: React.ReactNode}> = ({children: nodes})=> {

    return <ModalContextProvider >
    
    <Main>
            {nodes}
        <BottomMenu>
            <IonNavLink>
            <Icon name="home" color="var(--ion-color-primary)" />
            </IonNavLink>
            <IonNavLink >
                <Icon name="paw" color="var(--ion-color-medium)"/>
            </IonNavLink>
            <IonNavLink >
                <Icon name="warning"  color="var(--ion-color-medium)" />
            </IonNavLink>
            <IonNavLink >
                <Icon name="calendar"  color="var(--ion-color-medium)" />
            </IonNavLink>
        </BottomMenu>
    </Main>

    </ModalContextProvider>
}

const Main = styled.div`
    width: 100%;
    height: 100%;
    overflow-y:scroll ;
    max-width: var(--max-width);
    margin-left:auto; 
    margin-right: auto;
    position: relative;
    scroll-behavior: smooth ;
    padding-bottom: 80px;
    padding-top: 64px;
    &::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
    }
`

const BottomMenu = styled.div`
    position:fixed;
    z-index:200;
    bottom: 0;
    height: 80px;
    border-radius: 10px 10px 0 0;
    width: 100%;
    max-width: var(--max-width);
    box-shadow: 0 -1px 2px 0px var(--ion-color-medium);
    background-color: var(--ion-background-color);
    display: flex;
    justify-content: space-between;
    padding: 20px 60px 20px 60px;
    box-sizing: border-box;
`