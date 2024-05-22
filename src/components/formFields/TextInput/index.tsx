import React from "react";
import { ControlledTextInput } from "./ControlledTextInput";
import { HookFormInput } from "./HookFormInput";
import { IconName } from "@components";
import { RegisterOptions } from "react-hook-form";

// Define props for controlled component
type ControlledProps = {
    value: string;
    onChange: (value: string) => void;
	name?:string;
};

// Define props for uncontrolled component using react-hook-form
type HookFormProps = {
    registerOptions?: RegisterOptions;
	name: string;
};

// Common props
type CommonProps = {
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
};

// Mutually exclusive props type
type ExclusiveProps = 
    | (CommonProps & ControlledProps)
    | (CommonProps & HookFormProps);

	export const TextInput: React.FC<ExclusiveProps> = (props) => {
		if ("value" in props && "onChange" in props) {
			return <ControlledTextInput {...props} />;
		} else {
			return <HookFormInput {...props} />;
		}
	};