import React from "react";
import { ControlledTextInput } from "./ControlledTextInput";
import { HookFormInput } from "./HookFormInput";
import { ExclusiveProps } from "./components/types";

export const TextInput: React.FC<ExclusiveProps> = (props) => {
	if ("value" in props && "onChange" in props) {
		return <ControlledTextInput {...props} />;
	} else {
		return <HookFormInput {...props} />;
	}
};
