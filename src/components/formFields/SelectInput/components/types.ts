import { RegisterOptions } from "react-hook-form";
import { IconName } from "@components";
import { I18NKey } from "@i18n";

export type Option = {
    value: any;
    label: string;
    render?: React.ReactNode;
};

export type ControlledProps = {
    currentValue: any;
    onSelected: (value: any) => void;
    name?: string;
};

export type HookFormProps = {
    registerOptions?: RegisterOptions;
    name: string;
};

export type CommonProps = {
    required?: boolean;
    bgColor?: string;
    textLabel?: I18NKey;
    ntTextLabel?: string;
    color?: string;
    focusColor?: string;
    forceOptionsUp?: boolean;
    disabledColor?: string;
    disabled?: boolean;
    hoverColor?: string;
    textColor?: string;
    errorText?: string;
    icon?: IconName;
    rowsPerList?: number;
    errorColor?: string;
    options: Option[];
};

export type ExclusiveProps =
    | (CommonProps & ControlledProps)
    | (CommonProps & HookFormProps);