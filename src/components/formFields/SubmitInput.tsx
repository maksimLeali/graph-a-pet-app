import { IonButton } from "@ionic/react"
import { Children } from "react"
import styled from "styled-components"



type props = {
    children: React.ReactNode,
    color: string
}

export const SubmitInput:React.FC<props> = ({color, children})=> {
    return <>
        <HiddenSubmit type="submit"/>
        <IonButton type="submit" color={color} >{children}</IonButton>
    </>
}

const HiddenSubmit = styled.input`
    width: 0;
    height: 0;
    opacity: 0;
    position:absolute;
`