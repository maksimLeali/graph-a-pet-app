
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
    onClick?: ()=> void

}
export const Icon: React.FC<Props>= ({mode="md", name, color="dark", size="24px", className, reverse= false, onClick}) => {
 
    return (
        <Container onClick={onClick ? ()=> onClick() : ()=>{}}  size={size} className={`icon-wrapper ${className}`} iconColor={color} reverse={reverse}>
           
            <IonIcon mode={mode} size="large" icon={Icons[name]}  />
        </Container>
    )
}

type ContainerProps = {
    size?: string
    iconColor: string
    reverse: boolean
}

const Container = styled.div<ContainerProps>`
    display: flex;
    > * {
        color: var(--ion-color-${({iconColor})=> iconColor}) !important ;
        width: ${({size})=> size ? `${size}!important` : ''};
        aspect-ratio:1;
        ${({reverse})=> reverse? `transform: ScaleX(-1)` : ''}
        transition: color 1s ease-in;
    }
`