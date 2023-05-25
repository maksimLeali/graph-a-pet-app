
import { IonIcon } from "@ionic/react";
import styled, { CSSObject } from "styled-components";
import { IconName } from "./iconName";
import * as Icons from 'ionicons/icons'



type Props = {
    name : IconName,
    color?: string,
    size?: string
    className?: string,
    mode?: 'ios' | 'md'
    reverse?: boolean,
    time?: string,
    onClick?: ()=> void

}
export const Icon: React.FC<Props>= ({mode="md", name, color="dark", time="1s", size="24px", className, reverse= false, onClick}) => {
 
    return (
        <Container onClick={onClick ? ()=> onClick() : ()=>{}} time={time} size={size} className={`icon-wrapper ${className}`} iconColor={color} reverse={reverse}>
           
            <IonIcon mode={mode} size="large" icon={Icons[name]}  />
        </Container>
    )
}

type ContainerProps = {
    size?: string
    iconColor: string
    reverse: boolean,
    time: string,
}

const Container = styled.div<ContainerProps>`
    display: flex;
    > * {
        color: var(--ion-color-${({iconColor})=> iconColor}) !important ;
        width: ${({size})=> size ? `${size}!important` : ''};
        aspect-ratio:1;
        ${({reverse})=> reverse? `transform: ScaleX(-1)` : ''};
        transition: color ${({time})=> time} ease-in, transform ${({time})=> time} ease-in;
    }
`