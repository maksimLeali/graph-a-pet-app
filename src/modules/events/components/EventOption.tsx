import styled from "styled-components"
import { SpecialIconName } from "../../../components/SpecialIcons/SpecialIcons"
import { SpecialIcon } from "../../../components"

type props ={
    iconName: SpecialIconName,
    label: string
    color?: string,
}

export const EventOption:React.FC<props> = ({iconName, label, color="primary"})=> {
    return <Wrapper>
        <IconWrapper>

        <SpecialIcon  name={iconName} color={color} />
        </IconWrapper>
        <p>{label}</p>
    </Wrapper>
}

const Wrapper = styled.div`
width: 100%;
height:100%;
display: flex;
align-items: center;
justify-content: start;
gap: 12px;
> p {
    font-size: 1.6rem;
}
`

const IconWrapper = styled.div`
    width: 25px;
    height: 25px;
    > * {
        width: 100%;

    }
`