import React, { useContext, useMemo, useState } from 'react'
import { User } from '../types'
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react'
import styled from 'styled-components'
import { MinUserFragment } from '../modules/auth/operations/__generated__/minUser.generated'
import { Image2x } from '../components'

export type IUserContext ={
    setPage: (page: Page)=> void,
    setContextUser: (user: MinUserFragment) => void

} & Record<string, any>

type Page = {
    name: string , visible: boolean
}

const defaultValue: IUserContext = {
  setPage: ()=> {},
  setContextUser:()=> {}
}
const UserContext = React.createContext<IUserContext>(defaultValue)

type Props= {
  children: React.ReactNode,
}

export const UserContextProvider: React.FC< Props & Record<string, unknown>> = ({ children }) => {
    const [pageName, setPageName] = useState("") 
    const [visible, setVisible] = useState(true) 
    const [user, setUser] = useState<MinUserFragment | null>(null)
    const setPage = ({name, visible}: Page)=> {
        setPageName(name);
        setVisible(visible)
    }

    const setContextUser = (user: MinUserFragment)=> {
        console.log('setting context user',user)
        setUser(user)
    }

    
    const value = useMemo(() => ({...defaultValue, setPage, setContextUser}), [])

  return <UserContext.Provider value={value}>
    <CustomIonHeader visible={visible}>
        <IonToolbar>
            <IonTitle>{pageName}</IonTitle>
        <MainImage>
            {user && user.profile_picture
                ? <Image2x id={user.profile_picture.id} />
                : <></>
            }
        </MainImage>
        </IonToolbar>
    </CustomIonHeader>
    {children}
    </UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)

const CustomIonHeader = styled(IonHeader)<{visible: boolean}>`
    position: absolute;
    top: ${({visible})=> visible ? '0' : '-100%'};   
    height: 64px;
    > * {
        height: 100%;
        > * {
            height: 100%;
        }
    }
`

const MainImage = styled.div`
    width:40px;
    height: 40px;
    position:absolute;
    right: 12px;
    top:12px;
    background-color: var(--ion-color-primary);
    border-radius:40px;
`