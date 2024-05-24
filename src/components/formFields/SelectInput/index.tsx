

import type {ExclusiveProps} from './components/types'
import { ControlledSelectInput } from './ControlledSelectInput';
import { HookFormSelectInput } from './HookFormSelectInput';

export const SelectInput: React.FC<ExclusiveProps> = (props) => {
    if ("currentValue" in props && "onSelected" in props) {
        return <ControlledSelectInput {...props} />;
    } else {
        return <HookFormSelectInput {...props} />;
    }
};