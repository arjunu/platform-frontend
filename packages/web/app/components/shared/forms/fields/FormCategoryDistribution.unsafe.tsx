import { ArrayHelpers, connect, FieldArray, getIn } from "formik";
import * as React from "react";

import { CommonHtmlProps, TFormikConnect, TTranslatedString } from "../../../../types";
import { ButtonIcon, ButtonIconPlaceholder } from "../../buttons";
import { FormInput } from "./FormInput";
import { NumberTransformingField } from "./NumberTransformingField";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import * as styles from "./FormCategoryDistribution.module.scss";

interface IProps {
  disabled?: boolean;
  name: string;
  label?: TTranslatedString;
  prefix?: string;
  suffix?: string;
  selectedCategory?: { name: string; percentage: number };
  transformRatio?: number;
}

interface IInternalProps {
  addField: (e: React.MouseEvent<HTMLButtonElement>) => void;
  removeField: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLastElement: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  isFirstElement: boolean;
  formFieldKeys: string[];
}

interface IExternalProps {
  suggestions: string[];
  paragraphName?: string;
  fieldNames: string[];
  valuePlaceholder?: string;
}

class KeyValueCompoundFieldBase extends React.Component<IProps & IInternalProps & TFormikConnect> {
  name = this.props.name;

  setAllFieldsTouched = () =>
    this.props.formFieldKeys.map(key => {
      this.props.formik.setFieldTouched(`${this.name}.${key}`, true);
    });

  render = () => {
    const {
      disabled,
      isFirstElement,
      removeField,
      isLastElement,
      keyPlaceholder,
      valuePlaceholder,
      addField,
      formFieldKeys,
      suffix,
      prefix,
      transformRatio,
      name,
    } = this.props;
    return (
      <div className={styles.fieldWrapper}>
        {isLastElement && !disabled ? (
          <ButtonIcon svgIcon={plusIcon} onClick={addField} />
        ) : (
          <ButtonIconPlaceholder />
        )}
        <div className={styles.field}>
          <FormInput
            disabled={disabled}
            name={`${name}.${formFieldKeys[0]}`}
            placeholder={keyPlaceholder}
            onBlur={this.setAllFieldsTouched}
          />
          {transformRatio ? (
            <NumberTransformingField
              disabled={disabled}
              min="0"
              prefix={prefix}
              name={`${name}.${formFieldKeys[1]}`}
              ratio={transformRatio}
              customOnBlur={this.setAllFieldsTouched}
              placeholder={valuePlaceholder}
            />
          ) : (
            <FormInput
              disabled={disabled}
              min="0"
              prefix={prefix}
              suffix={suffix}
              name={`${name}.${formFieldKeys[1]}`}
              onBlur={this.setAllFieldsTouched}
              placeholder={valuePlaceholder}
            />
          )}
        </div>

        {!isFirstElement && !disabled ? (
          <ButtonIcon svgIcon={closeIcon} onClick={removeField} />
        ) : (
          <ButtonIconPlaceholder />
        )}
      </div>
    );
  };
}

class ArrayOfKeyValueFieldsBase extends React.Component<
  IProps & IExternalProps & CommonHtmlProps & TFormikConnect
> {
  private blankField = this.props.fieldNames.reduce((acc: any, key: string) => {
    acc[key] = undefined;
    return acc;
  }, {});
  private suggestions = [...this.props.suggestions];
  private setFieldValue = this.props.formik.setFieldValue;

  constructor(props: IProps & IExternalProps & CommonHtmlProps & TFormikConnect) {
    super(props);

    if (!getIn(props.formik.values, props.name)) {
      this.suggestions.forEach((_, index) =>
        this.setFieldValue(`${props.name}.${index}`, this.blankField),
      );
    }
  }

  addField = (arrayHelpers: ArrayHelpers) => arrayHelpers.push(this.blankField);

  removeField = (
    e: React.MouseEvent<HTMLButtonElement>,
    arrayHelpers: ArrayHelpers,
    index: number,
  ) => {
    e.preventDefault();
    if (!Array.isArray(this.props.formik.errors[this.props.name])) {
      // formik expects errors[this.props.name] to be an array of errors
      // and crashes if it's an single error, which might be the case
      // if we validate the length of key-value-array
      this.props.formik.errors[this.props.name] = undefined;
    }
    arrayHelpers.remove(index);
  };

  render(): React.ReactNode {
    const { prefix, transformRatio, disabled, formik, name, valuePlaceholder, suffix } = this.props;

    const categoryDistribution = getIn(formik.values, name) || [];
    const formFieldKeys = this.props.fieldNames;
    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <div className={styles.fieldArray}>
            {categoryDistribution.map(
              (_: { description: string; percent: number }, index: number) => {
                const isLastElement = index === categoryDistribution.length - 1;
                const isFirstElement = index === 0;

                return (
                  <KeyValueCompoundField
                    disabled={disabled}
                    key={index} //TODO fix this
                    formFieldKeys={formFieldKeys}
                    prefix={prefix}
                    suffix={suffix}
                    name={`${name}.${index}`}
                    removeField={(e: React.MouseEvent<HTMLButtonElement>) =>
                      this.removeField(e, arrayHelpers, index)
                    }
                    valuePlaceholder={valuePlaceholder}
                    keyPlaceholder={this.suggestions[index] || "Other"}
                    addField={() => this.addField(arrayHelpers)}
                    isFirstElement={isFirstElement}
                    isLastElement={isLastElement}
                    transformRatio={transformRatio}
                  />
                );
              },
            )}
          </div>
        )}
      />
    );
  }
}

const KeyValueCompoundField = connect<IProps & IInternalProps>(KeyValueCompoundFieldBase);

export const ArrayOfKeyValueFields = connect<IProps & IExternalProps & CommonHtmlProps, any>(
  ArrayOfKeyValueFieldsBase,
);
