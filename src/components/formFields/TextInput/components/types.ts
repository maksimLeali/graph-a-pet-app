import { IconName } from "@components";
import { RegisterOptions } from "react-hook-form";

// Define props for controlled component
export type ControlledProps = {
    value: string;
    onChange: (value: string) => void;
	name?:string;
};

// Define props for uncontrolled component using react-hook-form
export type HookFormProps = {
    registerOptions?: RegisterOptions;
	name: string;
};

// Common props
export type CommonProps = {
    required?: boolean;
    textLabel?: string;
    ntTextLabel?: string;
    color?: string;
    disabled?: boolean;
    focusColor?: string;
    disabledColor?: string;
    textColor?: string;
    type?: "text" | "password";
    inputMode?: "text" | "email";
    errorText?: string;
    pattern?: RegExp;
    icon?: IconName;
    errorColor?: string;
    bgColor?: string;
    error?: string;
};

// Mutually exclusive props type
export type ExclusiveProps = 
    | (CommonProps & ControlledProps)
    | (CommonProps & HookFormProps);
