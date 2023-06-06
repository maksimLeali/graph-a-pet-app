import { IonButton } from "@ionic/react"
import { Children } from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"



type props = {
    children: React.ReactNode,
    color: string
    submitting?: boolean,
    disabled?: boolean
}

export const SubmitInput:React.FC<props> = ({color, children, submitting=false, disabled=false})=> {
    
    const {
        formState: {isSubmitting},
      } = useFormContext();

    return <>
        <HiddenSubmit className={`${submitting ? 'submitting' : ''}`} type="submit"/>
        <IonButton disabled={isSubmitting|| submitting || disabled} type="submit" color={color} >{children}</IonButton>
    </>
}

const HiddenSubmit = styled.input`
    width: 0;
    height: 0;
    opacity: 0;
    position:absolute;
`