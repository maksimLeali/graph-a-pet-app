import styled from "styled-components"



type props = {
    label:string,
    color?: string,
    invert?:boolean
}

export const Chip: React.FC<props> = ({label, color="primary", invert= false,})=> {
    return <Container color={color} invert={invert}>
        <span>{label}</span>
    </Container>
}

const Container = styled.div<{color: string, invert: boolean}>`
    width: fit-content;
    padding: 5px 24px;
    border-radius: 30px;
    background-color: ${({invert, color})=> invert ?  'var(--ion-color-light)'  : `var(--ion-color-${color})`};
    border : 2px slid ; 
    > span {
        color:  ${({invert, color})=> invert ? `var(--ion-color-${color})`  : 'var(--ion-color-light)' };

        .dark & {
            color:  ${({invert, color})=> invert ? `var(--ion-color-${color})` :'var(--ion-color-dark)'};
        }
    }
`