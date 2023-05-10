import styled from "styled-components"
import { Icon, Modal, useModal } from "../components"
import { IonNavLink } from "@ionic/react"
import { ModalContextProvider } from "../components/system/ModalContext"
import { useState } from "react"



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
    box-shadow: 0 -2px 3px 0px var(--ion-color-medium);
    background-color: var(--ion-color-light);
    display: flex;
    justify-content: space-between;
    padding: 20px 60px 20px 60px;
    box-sizing: border-box;
`