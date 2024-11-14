import React from 'react'
import styled from "styled-components"
import { LanguageSelector } from '../modules/settings/components'
import { $cssTRBL, $uw } from '@theme'



export const AuthLayout:React.FC<{children?: React.ReactNode}> = ({children})=> {

    return <Auth>
        <SelectorContainer>

        <LanguageSelector />
        </SelectorContainer>
        {children}
    </Auth>
}

const Auth = styled.div`
    width: 100%;
    height: 100dvh;
    overflow-y:scroll ;
    max-width: var(--max-width);
    margin-left:auto; 
    margin-right: auto;
    scroll-behavior: smooth ;
`

const SelectorContainer = styled.div`
    width: 100%;
    max-width: var(--max-width);
    padding: ${$cssTRBL(2)};
    position: absolute;
`
