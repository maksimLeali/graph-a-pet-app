import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
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
  Option as OptionItem,
  ErrorSpan,
} from "./components";
import { CommonProps, HookFormProps } from "./components/types";
import { Icon } from "@components";
import { I18NKey } from "@i18n";

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
  hideIcon = false,
  forceOptionsUp = false,
  textColor = "dark",
  disabled = false,
  rowsPerList = 7,
  registerOptions,
  errorColor = "danger",
  options,
}) => {
  const [focused, setFocused] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [up, setUp] = useState(false);
  const [tempText, setTempText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  useOnClickOutside(containerRef, () => setFocused(false));

  useEffect(() => {
    const current = getValues(name);
    setCompiled(!!current);
  }, [getValues(name)]);

  useEffect(() => {
    if (!focused) {
      setTempText("");
      return;
    }
    textRef.current?.focus();
  }, [focused]);

  useEffect(() => {
    const itemsHeight =
      options.length > rowsPerList
        ? rowsPerList * 60
        : options.length * 60;
    const parentTop =
      (optionsRef.current?.offsetParent as HTMLDivElement)?.offsetTop ?? 0;
    setUp(itemsHeight + parentTop > window.innerHeight);
  }, [rowsPerList, options, optionsRef.current]);

  const classes = useMemo(
    () =>
      `${disabled && "disabled"} ${
        focused && "focused"
      } ${compiled && "compiled"} ${errors[name] && "error"}`,
    [errors[name], disabled, focused, compiled]
  );

  return (
    <Wrapper
      focusColor={focusColor}
      hoverColor={hoverColor}
      textColor={textColor}
      bgColor={bgColor}
      disabledColor={disabledColor}
      errorColor={errorColor}
      color={color}
      className={`select-input ${classes}`}
    >
      <InputLabel
        className={`inputLabel ${classes}`}
        htmlFor={name}
        onClick={() => setFocused((f) => !f)}
      >
        {textLabel ? t(textLabel) : ntTextLabel}
        {required && !compiled && " *"}
      </InputLabel>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required && {
            value: true,
            message: "messages.errors.required",
          },
          ...registerOptions,
        }}
        render={({ field: { onChange, onBlur, value, ref: fieldRef } }) => (
          <InputWrapper ref={containerRef} className="inputWrapper">
            {/* campo nascosto per collegare ref e value a RHF */}
            <InvisibleInput
              id={`${name}-hidden`}
              type="hidden"
              value={value ?? ""}
              ref={fieldRef}
              onBlur={onBlur}
            />

            <LabelContainer
              className={`label-container ${hideIcon ? "full-width" : ""}`}
              onClick={() => setFocused((f) => !f)}
            >
              {value
                ? options.find((opt) => opt.value === value)?.render ?? (
                    <p>
                      {
                        options.find((opt) => opt.value === value)
                          ?.label
                      }
                    </p>
                  )
                : ""}
            </LabelContainer>

            {!hideIcon && (
              <IconContainer className="icon-container">
                <Icon
                  size="26px"
                  time=".5s"
                  onMouseUp={() => setFocused((f) => !f)}
                  className={`selectIcon ${classes}`}
                  name="caretDownCircleOutline"
                />
              </IconContainer>
            )}

            <OptionsContainer
              maxHeight={
                options.length > rowsPerList
                  ? rowsPerList * 3.5
                  : options.length * 3.5
              }
              className={`options-container ${classes} ${
                up || forceOptionsUp ? "up" : ""
              } ${hideIcon ? "full" : ""}`}
              ref={optionsRef}
            >
              {options.map((option, i) => (
                <OptionItem
                  key={i}
                  className={`option ${
                    option.value === value ? "selected" : ""
                  }`}
                  onMouseUp={() => {
                    setFocused(false);
                    if (option.value === value) {
                      onChange(null);
                      setCompiled(false);
                    } else {
                      onChange(option.value);
                      setCompiled(true);
                    }
                  }}
                >
                  {option.render ?? option.label}
                  {option.value === value && (
                    <Icon
                      name="closeCircleOutline"
                      color={color}
                    />
                  )}
                </OptionItem>
              ))}
            </OptionsContainer>

            <FocusBox className={`focusBox ${classes}`} />
          </InputWrapper>
        )}
      />

      {errors[name]?.message && (
        <ErrorSpan className="error-span">
          {t(errors[name]?.message as I18NKey)}
        </ErrorSpan>
      )}
    </Wrapper>
  );
};
