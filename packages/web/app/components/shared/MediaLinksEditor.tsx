import * as cn from "classnames";
import { connect, FieldArray } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TFormikConnect } from "../../types";
import { Button } from "./buttons";
import { EButtonLayout } from "./buttons/Button";
import { FormField } from "./forms";

import * as closeIcon from "../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../assets/img/inline_icons/round_plus.svg";
import * as styles from "./MediaLinksEditor.module.scss";

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKey: string;
  onAddClick: () => void;
  onRemoveClick: () => void;
  name: string;
  url?: string;
  placeholder: string;
  blankField: object;
}

const SingleMediaLinkField: React.FunctionComponent<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const {
    isFirstElement,
    onAddClick,
    onRemoveClick,
    isLastElement,
    placeholder,
    blankField,
  } = props;

  return (
    <div className={styles.fieldRow}>
      <div className={styles.fieldCell}>
        {isLastElement && (
          <Button
            layout={EButtonLayout.GHOST}
            className="mt-2"
            svgIcon={plusIcon}
            iconProps={{ alt: <FormattedMessage id="common.add" /> }}
            onClick={onAddClick}
          />
        )}
      </div>

      <div className={cn(styles.fieldCell, "w-100")}>
        {blankField &&
          Object.keys(blankField).map(fieldName => {
            const isFieldWithCharactersLimit = fieldName === "title";

            return isFieldWithCharactersLimit ? (
              <FormField
                key={`${props.name}.${fieldName}`}
                name={`${props.name}.${fieldName}`}
                placeholder={fieldName || placeholder}
                charactersLimit={100}
              />
            ) : (
              <FormField
                key={`${props.name}.${fieldName}`}
                name={`${props.name}.${fieldName}`}
                placeholder={fieldName || placeholder}
              />
            );
          })}
      </div>

      <div className={styles.fieldCell}>
        {!isFirstElement && (
          <Button
            layout={EButtonLayout.GHOST}
            className="mt-2"
            svgIcon={closeIcon}
            onClick={onRemoveClick}
            iconProps={{ alt: <FormattedMessage id="common.remove" /> }}
          />
        )}
      </div>
    </div>
  );
};

interface IProps {
  name: string;
  placeholder: string;
  blankField: object;
}

class MediaLinksEditorLayout extends React.Component<IProps & TFormikConnect> {
  componentDidMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue, values } = formik;

    if (!values[name]) setFieldValue(`${name}.0`, this.props.blankField);
  }

  render(): React.ReactNode {
    const { name, blankField, placeholder, formik } = this.props;
    const { setFieldValue, values } = formik;

    const mediaLinks: object[] = values[name] || [blankField];
    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <div className={styles.fieldTable}>
            {mediaLinks
              .map((_: object, index: number) => {
                const isLastElement = !(index < mediaLinks.length - 1);
                const isFirstElement = index === 0;
                return (
                  <SingleMediaLinkField
                    blankField={blankField}
                    name={`${name}.${index}`}
                    formFieldKey={"url"}
                    onRemoveClick={() => {
                      arrayHelpers.remove(index);
                    }}
                    onAddClick={() => {
                      setFieldValue(`${name}.${index + 1}`, blankField);
                    }}
                    placeholder={placeholder}
                    isFirstElement={isFirstElement}
                    isLastElement={isLastElement}
                    key={`${name}.${index}`}
                  />
                );
              })
              .reverse()}
          </div>
        )}
      />
    );
  }
}

export const MediaLinksEditor = connect<IProps, unknown>(MediaLinksEditorLayout);
