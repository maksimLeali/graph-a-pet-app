
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
    dropShadow?: boolean,
    reverse?: boolean,
    time?: string,
    onClick?: ()=> void
    onMouseUp?: ()=> void

}
export const Icon: React.FC<Props>= ({mode="md", name, color="dark", time="1s", size="24px", className, reverse= false, onClick, onMouseUp, dropShadow=false}) => {
 
    return (
        <Container dropShadow={dropShadow} onMouseUp={onMouseUp? onMouseUp : ()=> {}} onClick={onClick ? ()=> onClick() : ()=>{}} time={time} size={size} className={`icon-wrapper ${className}`} iconColor={color} reverse={reverse}>
           
            <IonIcon mode={mode} size="large" icon={Icons[name]}  />
        </Container>
    )
}

type ContainerProps = {
    size?: string
    iconColor: string
    reverse: boolean,
    dropShadow: boolean,
    time: string,
}

const Container = styled.div<ContainerProps>`
    display: flex;
    > * {
        color: var(--ion-color-${({iconColor})=> iconColor}) !important ;
        width: ${({size})=> size ? `${size}` : ''};
        aspect-ratio:1;
        
        ${({dropShadow})=> dropShadow ? 'filter: drop-shadow(0px 4px 2px #000 );' : ''}
        /* ${({dropShadow})=> dropShadow ? 'filter: drop-shadow(1px 1px 2px var(--ion-color-primary-shade)) ;' : ''} */
        /* ${({dropShadow})=> dropShadow ? 'filter: dropShadow(0 10px 3px var(--ion-color-dark)) ' : ''} */
        ${({reverse})=> reverse? `transform: ScaleX(-1);` : ''}
        transition: color ${({time})=> time} ease-in, transform ${({time})=> time} ease-in;
    }
`