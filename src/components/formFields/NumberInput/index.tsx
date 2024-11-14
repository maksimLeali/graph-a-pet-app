import React from "react";
import { ControlledNumberInput } from "./ControlledNumberInput";
import { HookFormInput } from "./HookFormInput";
import { ExclusiveProps } from "./components/types";

export const NumberInput: React.FC<ExclusiveProps> = (props) => {
	if ("value" in props && "onChange" in props) {
		return <ControlledNumberInput {...props} />;
	} else {
		return <HookFormInput {...props} />;
	}
};
