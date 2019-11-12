import * as cn from "classnames";
import { range } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TElementRef } from "../../../types";
import { englishMnemonics } from "../../../utils/englishMnemonics";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons";
import { VirtualizedSelect } from "../../shared/forms/fields/VirtualizedSelect";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./BackupSeedVerify.module.scss";

const WORDS_TO_VERIFY = 4;

const wordsOptions = englishMnemonics.map((word: string) => ({ value: word, label: word }));

interface IBackupSeedVerifyProps {
  onNext: () => void;
  onBack: () => void;
  words: string[];
}

interface IVerificationWord {
  number: number;
  word: string;
  isValid: boolean | undefined;
}

export interface IBackupSeedVerifyState {
  verificationWords: IVerificationWord[];
}

// here it's good enough
const getRandomNumbers = (numbers: number, upTo: number): number[] => {
  const arr = [];
  while (arr.length < numbers) {
    const randomNumber = Math.floor(Math.random() * upTo);
    if (arr.indexOf(randomNumber) > -1) continue;
    arr[arr.length] = randomNumber;
  }
  return arr.sort((a, b) => a - b);
};

class BackupSeedVerify extends React.Component<IBackupSeedVerifyProps, IBackupSeedVerifyState> {
  verificationSelectRefs: TElementRef<VirtualizedSelect>[] = [];

  constructor(props: IBackupSeedVerifyProps) {
    super(props);

    const wordsToCheck = getRandomNumbers(WORDS_TO_VERIFY, props.words.length);

    this.state = {
      verificationWords: wordsToCheck.map(number => ({
        number,
        word: "",
        isValid: undefined,
      })),
    };
  }

  updateValueFactory = (wordOnPageNumber: number) => (newValue: any): void => {
    const { number } = this.state.verificationWords[wordOnPageNumber];

    const verificationWord: IVerificationWord = {
      number,
      word: newValue,
      isValid: newValue === this.props.words[number],
    };

    this.setState(
      state => ({
        verificationWords: state.verificationWords.map((word, index) =>
          wordOnPageNumber === index ? verificationWord : word,
        ),
      }),
      () => this.focusNext(wordOnPageNumber),
    );
  };

  focusNext = (current: number) => {
    if (current + 1 < WORDS_TO_VERIFY) {
      // Typings are not up to date. Below is the link to method in case of any error.
      // https://github.com/bvaughn/react-virtualized-select/blob/b24fb1d59777d0d50cdb77b41a72cca1b58e0c00/source/VirtualizedSelect/VirtualizedSelect.js#L44
      const nextSelectRef = this.verificationSelectRefs[current + 1] as any;

      if (nextSelectRef) {
        nextSelectRef.focus();
      }
    }
  };

  getValidationStyle = (wordOnPageNumber: number): string => {
    const validationWord = this.state.verificationWords[wordOnPageNumber];
    if (validationWord.isValid === undefined) {
      return "";
    } else {
      return validationWord.isValid ? styles.valid : styles.invalid;
    }
  };

  isInvalid = (): boolean => this.state.verificationWords.some(word => word.isValid === false);

  isValid = (): boolean => this.state.verificationWords.every(word => !!word.isValid);

  generateSelect = (wordOnPageNumber: number): React.ReactNode => (
    <div data-test-id={`backup-seed-verify-word-${wordOnPageNumber}`}>
      <VirtualizedSelect
        options={wordsOptions}
        simpleValue
        clearable={true}
        matchPos="start"
        matchProp="value"
        ref={(ref: TElementRef<VirtualizedSelect>) =>
          (this.verificationSelectRefs[wordOnPageNumber] = ref)
        }
        value={this.state.verificationWords[wordOnPageNumber].word}
        onChange={this.updateValueFactory(wordOnPageNumber)}
        placeholder={<FormattedMessage id="settings.backup-seed-verify.enter-word" />}
        noResultsText={<FormattedMessage id="settings.backup-seed-verify.no-matching-words" />}
        className={this.getValidationStyle(wordOnPageNumber)}
      />
    </div>
  );

  render(): React.ReactNode {
    return (
      <>
        <div className={styles.verificationBlock}>
          {range(0, WORDS_TO_VERIFY).map((num, wordPageNumber) => {
            const wordNumber = this.state.verificationWords[wordPageNumber].number;
            return (
              <div key={num} className={styles.word}>
                <div data-test-id="seed-verify-label">{`word ${wordNumber + 1}`}</div>
                {this.generateSelect(num)}
              </div>
            );
          })}
        </div>
        {this.isValid() && (
          <div className={cn(styles.placeholderHeight, styles.row, styles.center)}>
            <Button data-test-id="seed-verify-button-next" onClick={this.props.onNext}>
              <FormattedMessage id="form.button.continue" />
            </Button>
          </div>
        )}
        {this.isInvalid() && (
          <WarningAlert
            data-test-id="seed-verify-invalid-msg"
            className={cn(styles.placeholderHeight)}
          >
            <FormattedMessage id="settings.backup-seed-verify.recheck-words-message" />
          </WarningAlert>
        )}
        <div className={cn(styles.row)}>
          <Button
            layout={EButtonLayout.SECONDARY}
            iconPosition={EIconPosition.ICON_BEFORE}
            svgIcon={arrowLeft}
            onClick={this.props.onBack}
          >
            <FormattedMessage id="form.button.back" />
          </Button>
        </div>
      </>
    );
  }
}

export { BackupSeedVerify };
