import styled from "styled-components"
import { $color } from "@theme"

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
    background-color: ${({ color})=> $color(color)};
    border : 2px solid ${({ color})=> $color(color)}; ; 
    > span {
        color: ${$color('light')};
        
        .dark & {
            color:  ${$color('dark')};
        }
    }
    &.invert {
        background-color: ${$color('light')};
        > span {
            color:  ${$color('dark')};
        }

    }
`