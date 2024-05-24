import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import  _ from 'lodash'
import { useOnClickOutside } from "@hooks";
import {
	FocusBox,
	IconContainer,
	InputLabel,
	InputWrapper,
	InvisibleInput,
	LabelContainer,
	OptionsContainer,
	Wrapper,
	Option,
} from "./components";
import { CommonProps, HookFormProps } from "./components/types";
import { Icon } from "@components";

export const HookFormSelectInput: React.FC<HookFormProps & CommonProps> = ({
    name,
    textLabel,
    ntTextLabel,
    required = false,
    bgColor,
    color = "medium",
    hoverColor = "light-tint",
    focusColor = "primary",
    disabledColor = "medium",
    forceOptionsUp = false,
    textColor = "dark",
    errorText,
    disabled = false,
    rowsPerList = 7,
    registerOptions,
    errorColor = "danger",
    options,
}) => {
    const [focused, setFocused] = useState(false);
    const [compiled, setCompiled] = useState(false);
    const [up, setUp] = useState(false)

    const ref = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const {
        formState: { errors },
        control,
        register,
        getValues,
    } = useFormContext();

    useOnClickOutside(ref, () => setFocused(false));

    useEffect(() => {
        if (getValues(name)) setCompiled(true);
        else setCompiled(false);
    }, [getValues(name)]);


    useEffect(() => {
		const itemsHeight =
			options.length > rowsPerList
				? rowsPerList * 60
				: options.length * 60;
		setUp(
			itemsHeight +
				((optionsRef.current?.offsetParent as HTMLDivElement)
					?.offsetTop ?? 0) >
				window.innerHeight
		);
	}, [rowsPerList, optionsRef.current]);

    const classes = useMemo(() => {
		return `${disabled && "disabled"} ${focused && "focused"} ${
			compiled && "compiled"
		} ${errors[name] && "error"}`;
	}, [errors[name], disabled, focused, compiled]);
    

    return (
        <Wrapper
            focusColor={focusColor}
            hoverColor={hoverColor}
            textColor={textColor}
            bgColor={color}
            disabledColor={disabledColor}
            errorColor={errorColor}
            color={color}
            className={classes}
        >
            <InputLabel
                className={`inputLabel ${classes}`}
                htmlFor={name}
                onClick={() => setFocused(!focused)}
            >
                {textLabel ? t(textLabel) : ntTextLabel}
                {required && !compiled && " *"}
            </InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, ref,  name } }) => (
                    <InputWrapper ref={ref} className="inputWrapper">
                        <InvisibleInput
                            id={name}
                            onFocus={() => setFocused(!focused)}
                            {...register(name, {
                                required: {
                                    value: required,
                                    message: "messages.errors.required",
                                },
                                ...registerOptions,
                            })}
                        />
                        <LabelContainer
                            bgColor={bgColor}
                            className="label-container"
                            onClick={() => setFocused(!focused)}
                        >
                            {value
                                ? _.find(options, (opt) => opt.value === value)
                                      ?.render || (
                                      <p>
                                          {
                                              _.find(
                                                  options,
                                                  (opt) => opt.value === value
                                              )?.label
                                          }
                                      </p>
                                  )
                                : ""}
                        </LabelContainer>
                        <IconContainer bgColor={bgColor}>
                            <Icon
                                size="30px"
                                time=".5s"
                                onMouseUp={() => setFocused(!focused)}
                                className={`selectIcon ${classes}`}
                                name="caretDownCircleOutline"
                            />
                        </IconContainer>
                        <OptionsContainer
                            maxHeight={
                                options.length > rowsPerList
                                    ? rowsPerList * 50
                                    : options.length * 50
                            }
                            className={`options-container ${classes} ${
                                up || forceOptionsUp ? "up" : ""
                            }`}
                            ref={optionsRef}
                        >
                            {_.map(options, (option, i) => (
                                <Option
                                    key={i}
                                    className="option"
                                    onMouseUp={() => {
                                        setFocused(false);
                                        if (option.value === value) {
                                            onChange(null);
                                            setCompiled(false);
                                            return;
                                        }
                                        onChange(option.value);
                                        setCompiled(true);
                                    }}
                                >
                                    {option.render ? option.render : option.label}
                                    {option.value === value && (
                                        <Icon
                                            name="closeCircleOutline"
                                            color={color}
                                        />
                                    )}
                                </Option>
                            ))}
                        </OptionsContainer>
                        <FocusBox
                            className={`focusBox ${classes}`}
                        />
                    </InputWrapper>
                )}
            />
        </Wrapper>
    );
};
