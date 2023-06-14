import { RegisterOptions, Controller, useFormContext } from "react-hook-form";
import { I18NKey } from "../../i18n";
import { Icon, IconName } from "../";
import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";
import _ from "lodash";
type Option = {
    value: any;
    label: string;
    render?: React.ReactNode
};

type props = {
    name: string;
    required?: boolean;
    bgColor?: string
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    disabledColor?: string;
    hoverColor?: string;
    textColor?: string;
    errorText?: string;
    icon?: IconName;
    rowsPerList?: number;
    control?: any;
    registerOptions?: RegisterOptions;
    errorColor?: string;
    options: Option[];
    onSelected?: (v: any)=> void
    currentValue?: any
};

export const SelectInput: React.FC<props> = ({
    name,
    required,
    bgColor,
    textLabel,
    ntTextLabel,
    color = "medium",
    hoverColor = "light-tint",
    focusColor = "primary",
    disabledColor = "medium",
    textColor = "dark",
    errorText = "danger",
    rowsPerList = 7,
    control,
    onSelected,
    registerOptions,
    errorColor,
    options,
    currentValue,
}) => {
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const [up, setUp] = useState(false)
    const ref = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    useOnClickOutside(ref, () => {
        setFocused(false);
        const hide = ref.current?.children[0];
        if (!hide) return;
        hide.classList.remove("hide");
    });

    const {
        formState: {isSubmitting},
      } = useFormContext();

    useEffect(()=> {
        const itemsHeight = options.length > rowsPerList ? rowsPerList * 50 : options.length * 50
        setUp( itemsHeight +((optionsRef.current?.offsetParent as HTMLDivElement)?.offsetTop ?? 0)> window.innerHeight );
    }, [rowsPerList, optionsRef.current])


    return (
        <Wrapper
            className={`${isSubmitting ? 'submitting' : ''}`}
            focusColor={focusColor}
            hoverColor={hoverColor}
            txtColor={textColor}
            bgColor={color}
            disabledColor={disabledColor}
        >
            <InputLabel
                className={`inputLabel ${focused ? "focused" : ""} ${
                    compiled ? "compiled" : ""
                }`}
                htmlFor={name}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
            </InputLabel>
            
            {control ? <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                    <InputWrapper
                        ref={ref}
                        className="inputWrapper "
                        
                    >
                        <InvisibleInput
                            id={name}
                            onFocus={()=>setFocused(!focused)}
                        />
                        <LabelContainer bgColor={bgColor} className="label-container" onClick={()=>setFocused(!focused)}>
                            {value ? (
                                <p>
                                    {
                                        _.find(
                                            options,
                                            (opt) => opt.value === value
                                        )?.render 
                                        ?? _.find(
                                            options,
                                            (opt) => opt.value === value
                                        )?.label
                                    }
                                </p>
                            ) : (
                                <></>
                            )}
                        </LabelContainer>
                        <IconContainer bgColor={bgColor}>
                            <Icon
                                size="30px"
                                time=".5s"
                                onMouseUp={()=>setFocused(!focused)}
                                className={`selectIcon ${
                                    focused ? "focused" : ""
                                } ${compiled ? "compiled" : ""}`}
                                name="caretDownCircleOutline"
                            />
                        </IconContainer>
                        <OptionsContainer maxHeight={ options.length > rowsPerList ? rowsPerList * 50 : options.length * 50} className={`options-container ${focused ? "focused" : ""} ${
                                compiled ? "compiled" : ""
                            } ${
                                up? 'up' : ""
                            }`} ref={optionsRef}>
                            {_.map(options , (option,i)=>{
                                return <Option key={i} className="option" onMouseUp={()=>{
                                    setFocused(false)
                                    if (option.value === value) {
                                        onChange(null);
                                        setCompiled(false)
                                        return;
                                    }
                                    setCompiled(true)
                                    
                                    onChange(option.value)
                                    console.log(option)
                                }} > 
                                    {
                                    option.render 
                                    ? option.render 
                                    : <span>{option.label}</span>
                                    }

                                    {option.value === value ? <Icon name="closeCircleOutline" color={color} /> : <></>}
                                </Option>
                            })}
                        </OptionsContainer>
                        <FocusBox
                            className={`focusBox ${focused ? "focused" : ""} ${
                                compiled ? "compiled" : ""
                            }`}
                        />
                    </InputWrapper>
                )}
            />
        : <InputWrapper
        ref={ref}
        className="inputWrapper "
        
    >
        <InvisibleInput
            id={name}
            onFocus={()=>setFocused(!focused)}
        />
        <LabelContainer bgColor={bgColor} className="label-container" onClick={()=>setFocused(!focused)}>
            {currentValue ? (
                    _.find(
                            options,
                            (opt) => opt.value === currentValue
                        )?.render ??
                         <p>
                            {
                         _.find(
                            options,
                            (opt) => opt.value === currentValue
                        )?.label
                         }
                        </p>
    
            ) : (
                <></>
            )}
        </LabelContainer>
        <IconContainer bgColor={bgColor}>
            <Icon
                size="30px"
                time=".5s"
                onMouseUp={()=>setFocused(!focused)}
                className={`selectIcon ${
                    focused ? "focused" : ""
                } ${compiled ? "compiled" : ""}`}
                name="caretDownCircleOutline"
            />
        </IconContainer>
        <OptionsContainer maxHeight={ options.length > rowsPerList ? rowsPerList * 50 : options.length * 50} className={`options-container ${focused ? "focused" : ""} ${
                compiled ? "compiled" : ""
            } ${
                up? 'up' : ""
            }`} ref={optionsRef}>
            {_.map(options , (option,i)=>{
                return <Option key={i} className="option" onMouseUp={()=>{
                    setFocused(false)
                    if (option.value === currentValue) {
                        onSelected!(null);
                        setCompiled(false)
                        return;
                    }
                    setCompiled(true)
                    
                    onSelected!(option.value)
                    console.log(option)
                }} > 
                    {
                    option.render 
                    ? option.render 
                    : <span>{option.label}</span>
                    }

                    {option.value === currentValue ? <Icon name="closeCircleOutline" color={color} /> : <></>}
                </Option>
            })}
        </OptionsContainer>
        <FocusBox
            className={`focusBox ${focused ? "focused" : ""} ${
                compiled ? "compiled" : ""
            }`}
        />
    </InputWrapper>
        }
        </Wrapper>
    );
};

type selectProps = {
    bgColor: string;
    disabledColor: string;
    txtColor: string;
    focusColor: string;
    hoverColor: string;
};

const InvisibleInput = styled.input`
    height: 0;
    width: 0;
    position: absolute;
    opacity: 0;
`;

const Wrapper = styled.div<selectProps>`
    width: 100%;
    position: relative;
    height: 40px;
    &.submitting {
        opacity: .5;
        pointer-events: none;
    }

    .inputWrapper {
        background-color: var(--ion-color-${({ bgColor }) => bgColor});
    }
    .selectIcon {
        > * {
            color: var(--ion-color-${({ bgColor }) => bgColor}) !important ;
        }
        &.focused {
            > * {
                color: var(
                    --ion-color-${({ focusColor }) => focusColor}
                ) !important;
            }
        }
        &.compiled {
            > * {
                color: var(
                    --ion-color-${({ focusColor }) => focusColor}
                ) !important;
            }
        }
    }
    .inputLabel {
        color: var(--ion-color-${({ bgColor }) => bgColor});
        &.focused {
            color: var(--ion-color-${({ focusColor }) => focusColor});
        }
        &.compiled {
            color: var(--ion-color-${({ focusColor }) => focusColor});
        }
    }
    .focusBox {
        &.focused {
            background-color: var(
                --ion-color-${({ focusColor }) => focusColor}
                );
            }
            &.compiled {
                background-color: var(
                    --ion-color-${({ focusColor }) => focusColor}
                    );
                }
            }
        .label-container {
            > p {
                color: var(--ion-color-${({txtColor})=> txtColor});
            }
        }
    .options-container {
        background-color: var(--ion-background-color);
        border-color: var(--ion-color-${({ bgColor }) => bgColor});
    }
    .option {
        color: var(--ion-color-${({ txtColor }) => txtColor});
        border-color: var(--ion-color-${({ bgColor }) => bgColor});
        &:hover {
            border-color: var(--ion-color-${({ focusColor }) => focusColor});
            background-color: var(
                --ion-color-${({ hoverColor }) => hoverColor}
            );
        }
    }
`;

const InputLabel = styled.label`
    z-index: 3;
    position: absolute;
    left: 20px;
    top: 2px;
    font-size: 2rem;
    color: var(--ion-color-${({ color }) => color});
    transition: top 0.5s ease-in, left 0.5s ease-in, color 0.5s ease-in,
        font-size 0.5s ease-in;
    &.focused {
        font-size: 1.8rem;
        top: -25px;
        left: 0px;
    }
    &.compiled {
        font-size: 1.8rem;
        top: -25px;
        left: 0px;
    }
`;

const InputWrapper = styled.div`
    width: 100%;
    height: 40px;
    padding-bottom: 2px;
    padding-left: 2px;
    box-sizing: border-box;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
`;

const LabelContainer = styled.div<{bgColor?: string}>`
    height: 100%;
    position: relative;
    z-index: 2;
    width: calc(100% - 40px);
    font-size: 1.3rem;
    padding-left: 20px;
    
    background-color: ${ ({bgColor})=> bgColor ? `var(--ion-color-${bgColor})` : 'var(--ion-background-color)'};
    
    > p {
        margin:0;
    }
`;

const IconContainer = styled.div<{bgColor?: string}>`
    width: 38px;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${ ({bgColor})=> bgColor ? `var(--ion-color-${bgColor})` : 'var(--ion-background-color)'};
    .selectIcon {
        &.focused {
            > * {
                transform: rotate(-180deg);
            }
        }
    }
`;

const FocusBox = styled.span`
    background-color: var(--ion-color-medium);
    position: absolute;
    display: block;
    z-index: 1;
    left: 0;

    bottom: 0;
    width: 0;
    max-height: 0;
    height: 100%;

    transition: background-color 1s cubic-bezier(1, 0.07, 1, 0.12) 0s,
        width 0.5s ease-out, max-height 0.5s ease-out;
    &.focused {
        width: 100%;
        max-height: 100%;
        transition: background-color 1s cubic-bezier(0.02, 1.17, 0, 0.97) 0s,
            width 0.5s ease-out, max-height 0.5s ease-out;
    }
    &.compiled {
        width: 100%;
        max-height: 100%;
    }
`;

const OptionsContainer = styled.div<{maxHeight: number}>`
    width:calc(100% - 40px);
    position: absolute;
    z-index:4;
    top:100%;
    border-radius:2px ;
    left:0;
    overflow-y: scroll;
    border-left: 1px solid;
    opacity: 0;
    // margin-left: 20px ;
    max-height: 0;
    box-shadow: 1px 1px 2px 0px #2b2b2b;
    transition: max-height .5s ease-in-out, opacity .5s ease-in-out;
    
    @media (prefers-color-scheme: dark) {
        background-color: var(--ion-background-color);
    }
    &.focused {
        opacity: 1;
        max-height: ${({maxHeight})=> maxHeight}px;
    }
    &.up {
        bottom: 50px;
        top: unset;
    }
`;

const Option = styled.div`
    width:100%;
    height:50px;
    border-bottom: 1px solid ;
    padding: 5px 12px ;
    font-size: 1.3rem;
    box-sizing: border-box;
    position:relative;
    display: flex;
    justify-content:space-between ;
    align-items: center ;
    &:hover {
        border-left: 1px solid ; 
    }
`;
