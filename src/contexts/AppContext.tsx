import React, { useContext, useMemo } from 'react'

export type IAppContext = Record<string, unknown>

const defaultValue: IAppContext = {
  theme: 'dark',
  modalOpen: false,
}
const AppContext = React.createContext<IAppContext>(defaultValue)

type Props= {
  children: React.ReactNode,
}

export const AppContextProvider: React.FC< Props & Record<string, unknown>> = ({ children }) => {
  const value = useMemo(() => ({}), [])
  
  return <AppContext.Provider value={value}>
    {children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
