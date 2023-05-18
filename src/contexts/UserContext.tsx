import React, { useContext, useMemo, useState } from 'react'
import { User } from '../types'
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react'
import styled from 'styled-components'

export type IUserContext ={
    setPage: (page: Page)=> void,
} & Record<string, any>

type Page = {
    name: string , visible: boolean
}

const defaultValue: IUserContext = {
  setPage: ()=> {}
}
const UserContext = React.createContext<IUserContext>(defaultValue)

type Props= {
  children: React.ReactNode,
}

export const UserContextProvider: React.FC< Props & Record<string, unknown>> = ({ children }) => {
    const [pageName, setPageName] = useState("") 
    const [visible, setVisible] = useState(true) 
    
    const setPage = ({name, visible}: Page)=> {
        setPageName(name);
        setVisible(visible)
    }
    const value = useMemo(() => ({...defaultValue, setPage}), [])

  return <UserContext.Provider value={value}>
    <CustomIonHeader visible={visible}>
        <IonToolbar>
            <IonTitle>{pageName}</IonTitle>
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