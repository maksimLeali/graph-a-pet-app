import { useRef, useState , useEffect} from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks";
import { Toggle } from "../formFields";
import { Icon } from "../icons";

type props = {
    open: boolean;
    onClose: () => void;
};

export const MainMenu: React.FC<props> = ({ open, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => onClose());
    const [darkMode, setDarkMode] = useState(false);
    const [inited, setInited] = useState(false);

    useEffect(()=> {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if(prefersDark.matches){
            setDarkMode(true)
        }
        setInited(true)
    }, [])

    useEffect(()=> {
        if(!inited) return
        console.log( document.body.classList)
        document.body.classList.toggle('dark', darkMode)
    }, [darkMode, inited])

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');


    

    return (
        <MenuBackground className={`${open ? "open" : ""}`}>
            <Container ref={ref}>
                <MainOptions>
                    <Option>
                        <span>Impostazioni</span>
                    </Option>
                    <Option>
                        <span>Profilo</span>
                    </Option>
                </MainOptions>
                <Option className="modeSelector">
                    <Toggle value={darkMode} onChange={()=> {setDarkMode(!darkMode)}} rigthElement={ <Icon size="18px" name="sunny" color="var(--ion-color-dark)" /> } leftElement={ <Icon size="18px"   name="moonOutline" color="var(--ion-color-dark)" />} />
                </Option>
            </Container>
        </MenuBackground>
    );
};

const MenuBackground = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: var(--ion-trasparent-bg);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
    opacity: 0;
    animation: overMenuClose 0.5s ease-in-out;
    top: 0;
    left: 0;
    padding: 40px 10px;
    transition: opacity 0.5s ease-in-out;
    box-sizing: border-box;
    &.open {
        animation: overMenuOpen 0.5s ease-in-out;
        z-index: 201;
        opacity: 1;
    }
`;

const Container = styled.div`
    width: 100%;
    position: absolute;
    max-width: var(--max-width);
    bottom: -100%;
    padding: 20px 12px;
    background-color: var(--ion-color-light);
    box-sizing: border-box;
    border-radius: 4px 4px 0 0;
    transition: bottom 0.5s ease-in-out;
    .open & {
        bottom: 0px;
    }
`;

const MainOptions = styled.div`
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--ion-color-dark);
    gap: 10px;
    margin-bottom: 20px;
`;
const Option = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    box-sizing: border-box;
    &.modeSelector {
        justify-content: flex-end;
    }
`;
