import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { config } from "../config"


type props = {
    id: string,
    alt?: string, 
    fit?: boolean,
    rounded?: boolean
    className?: string
}

export const Image2x: React.FC<props>= ({id, alt, fit= false, rounded=false ,className})=> {
    const [src,setSrc] = useState<string>() ;
    const [src2x, setSrc2x] =useState<string>() ; 
    const ref = useRef<HTMLDivElement>(null)
    useEffect(()=> {
        console.log(ref)
    }, [ref])

    useEffect(()=> {
        const baseUrl = `${config.baseUrl?.replace('graphql', 'media')}/${id}`
        setSrc (`${baseUrl}/${ref.current ? ref.current.offsetWidth : 0}x${ref.current ? ref.current.offsetHeight : 0}${fit ? '/fit' : ''}`)
        setSrc2x (`${baseUrl}/${ref.current ? ref.current.offsetWidth*2 : 0}x${ref.current ? ref.current.offsetHeight*2 : 0}${fit ? '/fit' : ''}`)
    }, [ref.current?.offsetHeight, ref.current?.offsetWidth])
    return <ImageContainer className={`img2x ${className}`} ref={ref} rounded>
        {src && src2x &&<img src={src} alt={alt} srcSet={`${src2x} 2x`} />}
    </ImageContainer>
}

const ImageContainer = styled.div<{rounded: boolean}>`
    ${({rounded})=> rounded && `border-radius: 999px; overflow: hidden;`}
    
    > img {
        width: 100%;
        height:  100%;
    }
`