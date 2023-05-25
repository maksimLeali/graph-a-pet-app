import { UseFormRegister, RegisterOptions, Controller } from "react-hook-form";
import { I18NKey } from "../../i18n";
import { Icon, IconName } from "../";
import styled from "styled-components";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";

type Option = {
    value: any;
    label: string;
};

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
    icon?: IconName;
    control: any;
    registerOptions?: RegisterOptions;
    errorColor?: string;
    options: Option[];
};

export const SelectInput: React.FC<props> = ({
    name,
    required,
    textLabel,
    ntTextLabel,
    color="medium",
    focusColor="primary",
    disabledColor="medium",
    textColor="dark",
    errorText="danger",
    
    control,
    registerOptions,
    errorColor,
    options,
}) => {

    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const {t} = useTranslation()
    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });

    return <Wrapper  focusColor={focusColor} txtColor={textColor} bgColor={color} disabledColor={disabledColor} >
        <InputLabel className={`inputLabel ${focused ? "focused" : ""} ${
                        compiled ? "compiled" : ""
                    }`} htmlFor={name}>
            {textLabel ? t(textLabel) : ntTextLabel}
        </InputLabel>
         <Controller
         name={name}
         control={control}
         render={({ field: { onChange, value, name } }) => (
             <InputWrapper ref={ref} className="inputWrapper " onClick={()=>setFocused(true)}>
                 <InvisibleInput id={name} onFocus={()=>setFocused(true)}/>
                 <LabelContainer ></LabelContainer>
                 <IconContainer>
                    <Icon size="30px" reverse={focused} className={`selectIcon ${focused ? "focused" : ""} ${
                        compiled ? "compiled" : ""
                    }`} name="caretDownCircleOutline"  />
                 </IconContainer>
                 <FocusBox
                    className={`focusBox ${focused ? "focused" : ""} ${
                        compiled ? "compiled" : ""
                    }`}
                />
             </InputWrapper>

         )}
         />

    </Wrapper>
};

type selectProps = {
    bgColor: string
    disabledColor: string
    txtColor: string
    focusColor: string
}

const InvisibleInput = styled.input`
    height:0;
    width:0;
    position:absolute;
    opacity:0;
`

const Wrapper = styled.div<selectProps>`
    width: 100%;
    position: relative;
    height: 40px;
    
    .inputWrapper {
        background-color:var(--ion-color-${({bgColor})=> bgColor}) ;
    }
    .selectIcon {
        > * {
            color: var(--ion-color-${({bgColor})=> bgColor})!important ;
        }
        &.focused {
            > * {
                color: var(--ion-color-${({ focusColor }) => focusColor})!important;
            }
        }
        &.compiled {
            > * {
                color: var(--ion-color-${({ focusColor }) => focusColor})!important;
            }
        }
    }
    .inputLabel {
        color:var(--ion-color-${({bgColor})=> bgColor});
        &.focused {
            color: var(--ion-color-${({ focusColor }) => focusColor});
        }
        &.compiled {
            color: var(--ion-color-${({ focusColor }) => focusColor});
        }

    }
    .focusBox {
        &.focused {
            background-color: var(--ion-color-${({ focusColor }) => focusColor});
        }
        &.compiled {
            background-color: var(--ion-color-${({ focusColor }) => focusColor});
        }
    }

`

const InputLabel = styled.label`
    z-index: 3;
    position: absolute;
    left: 20px;
    top: 2px;
    font-size: 1.3rem;
    color: var(--ion-color-${({ color }) => color});
    transition: top 0.5s ease-in, left 0.5s ease-in, color 0.5s ease-in,
        font-size 0.5s ease-in;
    &.focused {
        font-size: 0.8rem;
        top: -25px;
        left: 0px;
        
    }
    &.compiled {
        font-size: 0.8rem;
        top: -25px;
        left: 0px;
        
    }
`

const InputWrapper = styled.div`
    width: 100%;
    height: 40px;
    padding-bottom: 2px;
    padding-left: 2px;
    box-sizing: border-box;
    border-radius:2px;
    display: flex;
    justify-content: space-between;
`

const LabelContainer = styled.div`
    height:100%;
    position:relative;
    z-index: 2;
    width: calc(100% - 40px);
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color)
    }
`

const IconContainer = styled.div`
    width: 38px;
    position:relative;
    z-index: 2;
    display:flex;
    justify-content: center;
    align-items: center;
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color)
    }
`

const FocusBox = styled.span`
    background-color: var(--ion-color-medium);
    position: absolute;
    display: block;
    z-index: 1;
    left:0;
    
    bottom:0;
    width: 0;
    max-height: 0;
    height:100%;
    
    
    transition: background-color 1s cubic-bezier(1, 0.07, 1, 0.12) 0s,
        width .5s ease-out, max-height .5s ease-out;
    &.focused {
        width: 100%;
        max-height: 100%;
        transition: background-color 1s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
            width .5s ease-out, max-height .5s ease-out;
            
            

    }
    &.compiled {
        width: 100%;
        max-height:100%;
        
    }
`;