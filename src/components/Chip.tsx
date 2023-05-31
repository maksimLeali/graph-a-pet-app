import { useEffect } from "react"
import styled from "styled-components"



type props = {
    label:string,
    color?: string,
    onClick?: ()=> void,
    invert?:boolean
}

export const Chip: React.FC<props> = ({label, color="primary", invert= false, onClick})=> {

    return <Container onClick={onClick ? ()=>{  onClick()} : ()=> {}} color={color} className={`${invert? 'invert' : ''}`}>
        <span>{label}</span>
    </Container>
}

const Container = styled.div<{color: string}>`
    width: fit-content;
    padding: 5px 24px;
    border-radius: 30px;
    background-color: ${({ color})=>   `var(--ion-color-${color})`};
    border : 2px solid ${({ color})=>   `var(--ion-color-${color})`} ; 
    > span {
        color: var(--ion-color-light);
        
        .dark & {
            color:  var(--ion-color-dark);
        }
    }
    &.invert {
        background-color:  var(--ion-color-light)  ;
        > span {
            color:  var(--ion-color-dark);
        }

    }
`