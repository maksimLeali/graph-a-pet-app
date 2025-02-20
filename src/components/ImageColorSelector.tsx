import { Media } from "@types"
import styled from "styled-components"

import { $color, $uw } from "@theme"
import { Image2x } from "./Image2x"
import { useState } from "react"

type Props = {
    image: Media,
    onColorSelected: (color: string) => {}
}

export const ImageColorSelector: React.FC<Props> = ({ image, onColorSelected }) => {
    const [selectedColor, setSelectedCOlor] = useState<string>();
    return <Container>
        {image.main_colors?.map((color) => <ColorBubble color={color.color} selected={image.main_color?.color === color.color} />)}
        <ImageContainer><Image2x id={image.id} /></ImageContainer>
    </Container>
}


const Container = styled.div`
    width: 100%;
    
`

const ColorBubble = styled.span<{ color: string; selected: boolean }>`
    background-color: ${({ color }) => color};
    &::after{
        width: 100%;
        height: 100%;
        content: "";
        border: 1px solid ${({ selected }) => $color(selected ? 'primary' : "dark")}
    }
`

const ImageContainer = styled.div<{ color?: string }>`
    width: ${$uw(12)};
    height: ${$uw(12)};
    border: 1px solid ${({ color }) => $color(color ?? 'primary')};

`