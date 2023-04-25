import React from 'react'
import styled from "styled-components"



export const Auth:React.FC<{children?: React.ReactNode}> = ({children})=> {

    return <AuthLayout>
        {children}
    </AuthLayout>
}

const AuthLayout = styled.div`
    width: 100%;
    height: 100%;
    overflow-y:scroll ;
    scroll-behavior: smooth ;
`