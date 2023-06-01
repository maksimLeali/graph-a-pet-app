import styled from "styled-components"
import { Icon } from "../components"
import { ModalContextProvider } from "../contexts"
import { Link } from "react-router-dom"



export const MainLayout:React.FC<{children: React.ReactNode}> = ({children: nodes})=> {

    return <ModalContextProvider >
    
    <Main>
            {nodes}
        <BottomMenu>
            <Link to="/home" >
            <Icon name="home"  size="32px" color="primary" />
            </Link>
            <Link to="#">
                <Icon name="paw" size="32px" color="medium"/>
            </Link>
            <Link to="#">
                <Icon name="warning" size="32px" color="medium" />
            </Link>
            <Link to="#">
                <Icon name="calendar" size="32px" color="medium" />
            </Link>
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
    background-color: var(--ion-color-step-50);
    display: flex;
    justify-content: space-between;
    padding: 20px 60px 20px 60px;
    box-sizing: border-box;
`