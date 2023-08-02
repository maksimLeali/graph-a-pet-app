import React, { useContext, useMemo } from 'react'

export type IAppContext = Record<string, unknown>

const defaultValue: IAppContext = {
  theme: 'dark',
  modalOpen: false,
  webpSupported: true
}
const AppContext = React.createContext<IAppContext>(defaultValue)

type Props= {
  children: React.ReactNode,
}

export const AppContextProvider: React.FC< Props & Record<string, unknown>> = ({ children }) => {
  const webpSupported = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
  const value = useMemo(() => ({webpSupported}), [])
  return <AppContext.Provider value={value}>
    {children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
