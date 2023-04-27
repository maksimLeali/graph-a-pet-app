
import { IonIcon } from "@ionic/react";
import styled, { CSSObject } from "styled-components";
import { IconName } from "./IconName";
import * as Icons from 'ionicons/icons'



type Props = {
    name : IconName,
    color: CSSObject['color'],
    size?: string
    className?: string,
    reverse?: boolean,
    onClick?: ()=> void

}
export const Icon: React.FC<Props>= ({name, color, size, className, reverse= false, onClick}) => {
 
    return (
        <Container onClick={onClick ? ()=> onClick() : ()=>{}}  size={size} className={`icon-wrapper ${className}`} iconColor={color} reverse={reverse}>
           
            <IonIcon  size="large" icon={Icons[name]}  />
        </Container>
    )
}

type ContainerProps = {
    size?: string
    iconColor: CSSObject['color']
    reverse: boolean
}

const Container = styled.div<ContainerProps>`
    display: flex;
    > * {
        color: ${({iconColor})=> iconColor} !important ;
        width: ${({size})=> size ? `${size}!important` : ''};
        aspect-ratio:1;
        ${({reverse})=> reverse? `transform: ScaleX(-1)` : ''}
        transition: color 1s ease-in;
    }
`