import * as cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import { differenceWith } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Creatable as ReactSelectCreatable, Option } from "react-select";

import { CommonHtmlProps } from "../../../types";
import { FormFieldError } from "../../shared/forms";
import { FormFieldLabel } from "../../shared/forms/fields/FormFieldLabel";
import { VirtualizedSelect } from "../../shared/forms/fields/VirtualizedSelect";
import { ETagSize, Tag } from "../../shared/Tag";

import * as checkIcon from "../../../assets/img/inline_icons/close_no_border.svg";
import * as styles from "./EtoTagWidget.module.scss";

type ICombinedProps = IProps & CommonHtmlProps;

interface IProps {
  name: string;
  selectedTagsLimit: number;
  options: { value: string; label: string }[];
}

interface IInternalProps {
  values: string[];
  onChange: (newTag: string) => void;
  handleSelectedTagClick: (tag: string) => void;
  disabled: boolean;
  testId?: string;
}

//This is a temporary solution
//@see https://github.com/JedWatson/react-select/issues/2181
class Creatable extends React.Component {
  render(): React.ReactNode {
    return <ReactSelectCreatable {...this.props} />;
  }
}

export const generateTagOptions = (tags: string[]): { value: string; label: string }[] =>
  tags.map((word: string) => ({
    value: word,
    label: word,
  }));

const TagsFormEditor: React.FunctionComponent<ICombinedProps & IInternalProps> = ({
  name,
  className,
  disabled,
  options,
  values,
  handleSelectedTagClick,
  onChange,
}) => (
  <div className={cn(styles.tagWidget, className)} data-test-id={`form.name.${name}`}>
    <VirtualizedSelect
      disabled={disabled}
      options={differenceWith<Option, string>((o, v) => o.value === v, options, values)}
      clearable={false}
      matchPos="start"
      matchProp="value"
      simpleValue
      selectComponent={Creatable}
      onChange={newTag => onChange(newTag as any)}
      placeholder={"Add tag e.g Technology"}
      noResultsText="No matching word"
      className={cn("mb-3", styles.tagsForm)}
    />
    {values.length > 0 && (
      <div>
        {values.map(tag => (
          <Tag
            onClick={() => handleSelectedTagClick(tag)}
            text={tag}
            className={cn(styles.tag, "ml-1")}
            svgIcon={checkIcon}
            size={ETagSize.SMALL}
            key={tag}
            placeSvgInEnd
          />
        ))}
      </div>
    )}
    <FormFieldError name={name} />
  </div>
);

const EtoTagWidget: React.FunctionComponent<IProps & CommonHtmlProps> = props => (
  <FormikConsumer>
    {({ values, setFieldValue }) => {
      const selectedTags: string[] = values[props.name] || [];

      return (
        <Field
          name={props.name}
          render={({ field }: FieldProps) => (
            <>
              <FormFieldLabel name={props.name}>
                <FormattedMessage id="eto.form.company-information.company-categories" />
              </FormFieldLabel>
              <p>
                <FormattedMessage
                  id="eto.form.company-information.company-categories.explanation"
                  values={{ limit: props.selectedTagsLimit }}
                />
              </p>
              <TagsFormEditor
                {...props}
                {...field}
                onChange={newTag => {
                  const isAlreadyOnTheList = selectedTags.some(tag => tag === newTag);
                  if (!isAlreadyOnTheList) setFieldValue(props.name, [...selectedTags, newTag]);
                }}
                handleSelectedTagClick={(clickedTag: string) => {
                  const listWithRemovedTag = selectedTags.filter(tag => tag !== clickedTag);
                  return setFieldValue(props.name, listWithRemovedTag);
                }}
                disabled={selectedTags.length === props.selectedTagsLimit}
                values={selectedTags}
              />
            </>
          )}
        />
      );
    }}
  </FormikConsumer>
);

export { EtoTagWidget };
