import { useRef, useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks";
import { I18NKey } from "../../i18n";

type props = {
    name: string;
    required?: boolean;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    textColor?: string;
    errorText?: string;
    innerRef?: UseFormRegister<any>;
    registerOptions?: RegisterOptions;
    errorColor?: string;
};

export const TextInput: React.FC<props> = ({
    textColor = "primary",
    ntTextLabel,
    textLabel,
    color = "medium",
    required = false,
    registerOptions,
    focusColor = "primary",
    disabledColor = "lightGray",
    errorColor = "danger",

    innerRef,
    name,
}: props) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(true)
    const ref = useRef<HTMLDivElement>(null);
    
    useOnClickOutside(ref, () => {
        setFocused(false)
        const hide = ref.current?.children[0]
        if(!hide ) return
        hide.classList.remove('hide')
    });


    return (
        <Wrapper ref={ref} color={color} className={focused ? 'ripple' : ''}  >
            
            <label>{textLabel ? t(textLabel) : ntTextLabel}</label>
            
            <StyledInput
                onFocus={()=>setFocused(true)}
                type="text"
                {...(innerRef
                    ? innerRef(name, { required, ...registerOptions })
                    : null)}
            />
            {/* <FocusCircle color={color} /> */}
            
        </Wrapper>
    );
};

type wrapperProps = {
    color: string,
    
}

type focusCircleProps = {
    color: string,
    
}

const Wrapper = styled.div<wrapperProps>`
    background-color: var(--ion-color-${({color})=>color });
    display: flex;
    position:relative;
    padding: 0 0 2px 2px;
    flex-direction: column;
    height: 30px;
    overflow: hidden;
    box-sizing: border-box;
    &.ripple:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #f00 10%, transparent 10.01%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10, 10);
        opacity: 0;
        transition: transform .5s, opacity 1s;
    }

    &.ripple:active:after {
        transform: scale(0,0);
        opacity: 1;
        transition: 0s;
    }
`

const FocusCircle = styled.span<focusCircleProps>`
    background-color: var(--ion-color-${({color})=>color });
    position: relative;
    z-index:1;
    width: 0;
    border-radius: 9999px;
    aspect-ratio: 1;
    transition: all 1s ease-out;

`

const StyledInput = styled.input`
    outline: none;
    border: none;
    position: relative;
    z-index: 2;
    background-image: none;
    background-color: var(--ion-background-color);
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    height: 30px;
    width: 100%;
`;
