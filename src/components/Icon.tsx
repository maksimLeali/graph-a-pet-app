
import { IonIcon } from "@ionic/react";
import 'ionicons/icons'
import styled, { CSSObject } from "styled-components";
 


type Props = {
    name : string,
    color: CSSObject['color'],
    size?: string
    className?: string,
    reverse?: boolean

}
export const Icon: React.FC<Props>= ({name, color, size, className, reverse= false}) => {
 
    return (
        <Container size={size} className={className} iconColor={color} reverse={reverse}>
            <IonIcon  name={name}  />
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
        font-size: ${({size})=> size};
        ${({reverse})=> reverse? `transform: ScaleX(-1)` : ''}
    }
`