//These are custom definitions added

declare namespace ReactIntlPhrase {
  type MessageValue = string | number | boolean | Date | null | undefined;

  namespace FormattedMessage {
    interface MessageDescriptor {
      id: string;
      description?: string;
      defaultMessage?: string;
    }

    interface Props extends MessageDescriptor {
      values?: { [key: string]: MessageValue | JSX.Element };
      tagName?: string;
      children?: (...formattedMessage: string[]) => React.ReactNode;
    }
  }
  class FormattedMessage extends React.Component<FormattedMessage.Props> {}

  class FormattedHTMLMessage extends React.Component<
    FormattedMessage.Props & { tagName: string }
  > {}

  interface configObject {
    projectId: string;
    phraseEnabled: boolean;
    prefix: string;
    suffix: string;
  }

  function initializePhraseAppEditor(config: configObject): void;
}

declare module "react-intl-phraseapp" {
  export = ReactIntlPhrase;
}
