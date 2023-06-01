import { useRef, useState , useEffect, useCallback} from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import styled from "styled-components";
import { useModal } from "../../contexts";
import { useOnClickOutside } from "../../hooks";
import { Toggle } from "../formFields";
import { Icon } from "../icons";
import { toast } from "react-hot-toast";

type props = {
    open: boolean;
    onClose: () => void;
};

export const MainMenu: React.FC<props> = ({ open, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => {if(!modalOpen) onClose()});
    const [darkMode, setDarkMode] = useState(false);
    const [inited, setInited] = useState(false);
    const [isPWA, setIsPWA] = useState(false)
    const [cookies, setCookies, removeCookies] = useCookies(['user','jwt'])
    const [modalOpen, setModalOpen] = useState(false);
    const history = useHistory()
    const {t} = useTranslation()

    useEffect(()=> {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const isRunningAsPWA = !window.matchMedia('(display-mode: browser)').matches;
        setIsPWA(isRunningAsPWA)
        setDarkMode(prefersDark.matches)
        setInited(true)
    }, [])

    const exit= useCallback(()=> {
        removeCookies('user')
        removeCookies('jwt')
        toast.success('messages.success.logout')
        setTimeout(()=> {
            history.push('/')
        }, 1500)
    }, [])

    const {openModal, closeModal} = useModal()

    const openLogoutModal = useCallback(() => {
        setModalOpen(true)
        openModal({
            onClose: () => {setModalOpen(false); closeModal()},
            children: (
                <ConfirmLogout />
            ),
            onConfirm: ()=> {
                exit()
            },
            onCancel: ()=> {
                setModalOpen(false); closeModal()
            }
        });
    }, []);

    useEffect(()=> {
        if(!inited) return
        document.body.classList.toggle('dark', darkMode)
    }, [darkMode, inited])

    return (
        <MenuBackground className={`${open ? "open" : ""} ${isPWA ? '' : 'browser'}`}>
            <Container ref={ref}>
                <MainOptions>
                    <Option href="#settings">
                        <Icon size="24px" name="settingsOutline" />
                        <span>{t('system.menu.settings')}</span>
                    </Option>
                    <Option href="#profile">
                        <Icon size="24px" name="personOutline" />
                        <span>{t('system.menu.profile')}</span>
                    </Option>
                </MainOptions>
                <ActionOptions>
                    <Option onClick={(e)=> {e.preventDefault(); openLogoutModal()}}>
                        <Icon name="exitOutline" />
                        <span>Logout</span>
                    </Option>
                </ActionOptions>
                <ToggleOption className="modeSelector">
                    <Toggle value={darkMode} onChange={()=> {setDarkMode(!darkMode)}} rigthElement={ <Icon size="18px" name="sunny" color="dark" /> } leftElement={ <Icon size="18px"   name="moonOutline" color="dark" />} />
                </ToggleOption>
            </Container>
        </MenuBackground>
    );
};

const ConfirmLogout = ()=> {
    const {t}= useTranslation()
    return <LogoutContainer>
            <p>{t('system.logout_modal.text')}</p>
        </LogoutContainer>
}

const MenuBackground = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: var(--ion-trasparent-bg-shade);
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
        bottom: 0;
    }
    .browser & {
        padding-bottom:80px;
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
const ActionOptions = styled.div`
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--ion-color-dark);
    gap: 10px;
    margin-bottom: 20px;
`;
const Option = styled.a`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items:center ;
    gap:20px;
    padding-bottom: 12px;
    box-sizing: border-box;
    text-decoration: none;
    color: inherit;
    &.modeSelector {
        justify-content: flex-end;
    }
    > span {
        color: var(--ion-color-dark);
    }
`;
const ToggleOption = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items:center ;
    gap:20px;
    padding-bottom: 12px;
    box-sizing: border-box;
    &.modeSelector {
        justify-content: flex-end;
    }
    > span {
        color: var(--ion-color-dark);
    }
`;

const LogoutContainer = styled.div`
    width:100%;
    display:flex;
    flex-direction: column;
    padding: 0 12px;
    > p {
        text-align: center ;
    }
`