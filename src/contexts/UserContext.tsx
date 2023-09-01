import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Pet, User } from '../types'
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react'
import styled from 'styled-components'

import { Image2x } from '../components'
import { useCookies } from 'react-cookie'
import { MainMenu } from '../components/system'
import { MinUserFragment } from '../components/operations/__generated__/minUser.generated'
import { DashboardPetFragment } from '../components/operations/__generated__/dashboardPet.generated'

export type IUserContext ={
    setPage: (page: Page)=> void,
    updatePets: (pets: DashboardPetFragment[])=> void

} & Record<string, any>

type Page = {
    name: string , visible?: boolean
}

const defaultValue: IUserContext = {
  setPage: ()=> {},
  updatePets: ()=> {}
  
}
const UserContext = React.createContext<IUserContext>(defaultValue)

type Props= {
  children: React.ReactNode,
}

export const UserContextProvider: React.FC< Props & Record<string, unknown>> = ({ children }) => {
    const [pageName, setPageName] = useState("") 
    const [cookie] = useCookies(["jwt", "user"]);
    const [visible, setVisible] = useState(true) 
    const [pets, setPets] = useState<DashboardPetFragment[]>([]) 
    const [user, setUser] = useState<MinUserFragment | null>(null)
    const [menuOpen,setMenuOpen ]= useState(false)
    const setPage = ({name, visible = true}: Page)=> {
        setPageName(name);
        setVisible(visible)
    }

    const updatePets = (pets: DashboardPetFragment[])=> {
        console.log(pets.length)
        setPets(pets)
    }
    useEffect(()=> {
        setUser(cookie.user)
    }, [cookie.user])

    
    const value = useMemo(() => ({...defaultValue,pets ,updatePets , setPage, visible}), [visible, pets])

  return <UserContext.Provider value={value}>
    <CustomIonHeader visible={visible}  className='MainHeader'>
        <IonToolbar>
            <IonTitle>{pageName}</IonTitle>
        </IonToolbar>
        <MainImage className='skeleton' onClick={()=> setMenuOpen(true)}>
            {user && user.profile_picture
                ? <Image2x id={user.profile_picture.id} />
                : <></>
            }
        </MainImage>
    </CustomIonHeader>
    <MainBody className={ !visible ?  "noUserMenu" : ''}>
    {children}
    </MainBody>
    <MainMenu open ={menuOpen} onClose={()=> {setMenuOpen(false)}}/>
    </UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)

const CustomIonHeader = styled(IonHeader)<{visible: boolean}>`
    position: absolute;
    top: ${({visible})=> visible ? '0' : '-100%'};   
    height: 64px;
    max-width: var(--max-width);
    margin-left: auto;
    left: calc(50% - 240px);
    @media only screen and (max-width: 480px) {
        left:0;
    }
    > * {
        height: 100%;
        > * {
            height: 100%;
        }
    }
`

const MainImage = styled.div`
    width:50px;
    height: 50px;
    position:absolute;
    right: 20px;
    z-index:10;
    top:6px;
    border: 2px solid var(--ion-color-primary);
    /* background-color: var(--ion-color-primary); */
    border-radius:40px;
    > .img2x {
        width: 100%;
        height: 100%;
    }
`

const MainBody = styled.div`
    width: 100%;
    padding-top: 64px;
    height: 100%;;
    &.noUserMenu{
        padding-top:0 ;
    }
`