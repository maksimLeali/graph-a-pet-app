import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { config } from "../config"
import { useAppContext } from "../contexts"


type props = {
    id: string,
    alt?: string, 
    fit?: boolean,
    rounded?: boolean
    className?: string,
    lazy?: boolean
}

export const Image2x: React.FC<props>= ({id, alt, fit= false, rounded=false ,className, lazy})=> {
    const [src,setSrc] = useState<string>() ;
    const [src2x, setSrc2x] =useState<string>() ; 
    const ref = useRef<HTMLDivElement>(null)
    const { webpSupported } = useAppContext()
    
    useEffect(()=> {
        const baseUrl = `${config.baseUrl?.replace('graphql', 'media')}/${id}`
        const parameters = [
            ...(webpSupported ? ["format=webp"] : [])
        ]

        setSrc (`${baseUrl}/${ref.current ? ref.current.offsetWidth : 0}x${ref.current ? ref.current.offsetHeight : 0}${fit ? '/fit' : ''}${parameters.length > 0 ? '?' + parameters.join('&') : ''}`)
        setSrc2x (`${baseUrl}/${ref.current ? ref.current.offsetWidth*2 : 0}x${ref.current ? ref.current.offsetHeight*2 : 0}${fit ? '/fit' : ''}${parameters.length > 0 ? '?' + parameters.join('&') : ''}`)
    }, [ref.current?.offsetHeight, ref.current?.offsetWidth])
    return <ImageContainer className={`img2x ${className}`} ref={ref} rounded>
        {src && src2x &&<img src={src} alt={alt ?? `${id}`} srcSet={`${src2x} 2x`} loading={ lazy ? "lazy" : 'eager'} />}
    </ImageContainer>
}

const ImageContainer = styled.div<{rounded: boolean}>`
    ${({rounded})=> rounded && `border-radius: 999px; overflow: hidden;`}
    width:100%;
    height: 100%;
    > img {
        width: 100%;
        height:  100%;
    }
`