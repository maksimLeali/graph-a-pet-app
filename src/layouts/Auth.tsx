import React from 'react'
import styled from "styled-components"



export const AuthLayout:React.FC<{children?: React.ReactNode}> = ({children})=> {

    return <Auth>
        {children}
    </Auth>
}

const Auth = styled.div`
    width: 100%;
    height: 100%;
    overflow-y:scroll ;
    max-width: var(--max-width);
    margin-left:auto; 
    margin-right: auto;
    scroll-behavior: smooth ;
`