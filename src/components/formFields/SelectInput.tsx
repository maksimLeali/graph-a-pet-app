import { UseFormRegister, RegisterOptions } from "react-hook-form";
import { I18NKey } from "../../i18n";
import { IconName } from "../";
import styled from "styled-components";

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
    color,
    focusColor,
    disabledColor,
    textColor,
    errorText,
    icon,
    control,
    registerOptions,
    errorColor,
    options,
}) => {


    return <Wrapper>
        <InputLabel htmlFor={name}>
        </InputLabel>
        <InputWrapper>
            
        </InputWrapper>
    </Wrapper>
};

const Wrapper = styled.div`
    width: 100%;
    position: relative;
`

const InputLabel = styled.label`
    
`

const InputWrapper = styled.div`
    
`