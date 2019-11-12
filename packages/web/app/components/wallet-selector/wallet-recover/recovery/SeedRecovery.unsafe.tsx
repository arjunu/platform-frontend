import { range } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TElementRef } from "../../../../types";
import { englishMnemonics } from "../../../../utils/englishMnemonics";
import { Button } from "../../../shared/buttons";
import { VirtualizedSelect } from "../../../shared/forms/fields/VirtualizedSelect";
import { HeaderProgressStepper } from "../../../shared/HeaderProgressStepper";

export const SEED_LENGTH = 24;
const WORDS_PER_VIEW = 4;

const wordsOptions = englishMnemonics.map((word: string) => ({ value: word, label: word }));

interface ISeedRecoveryProps {
  startingStep: number;
  extraSteps: number;
  sendWords: (words: string) => void;
}

interface ISeedRecoveryState {
  words: string[];
  page: number;
}

export class WalletLightSeedRecoveryComponent extends React.Component<
  ISeedRecoveryProps,
  ISeedRecoveryState
> {
  verificationSelectRefs: TElementRef<VirtualizedSelect>[] = [];
  nextButtonRef = React.createRef<HTMLButtonElement>();

  state = {
    words: Array(SEED_LENGTH).fill(null),
    page: 0,
  };

  updateValueFactory = (wordNumber: number, index: number) => (newValue: any): void => {
    const words = this.state.words;
    words[wordNumber] = newValue;
    this.setState(
      state => ({
        words: state.words.map((word, number) => (number === wordNumber ? newValue : word)),
      }),
      () => this.focusNext(index),
    );
  };

  generateSelect = (wordNumber: number, index: number): React.ReactNode => (
    <div data-test-id={`seed-recovery-word-${wordNumber}`}>
      <VirtualizedSelect
        options={wordsOptions}
        simpleValue
        clearable={true}
        matchPos="start"
        matchProp="value"
        ref={(ref: VirtualizedSelect | null) => (this.verificationSelectRefs[index] = ref)}
        value={this.state.words[wordNumber]}
        onChange={this.updateValueFactory(wordNumber, index)}
        placeholder={(wordNumber + 1).toString(10) + ". Word"}
        noResultsText="No matching word"
      />
    </div>
  );

  getCurrentWordsSlice = () => {
    const startIndex = this.state.page * WORDS_PER_VIEW;
    const endIndex = startIndex + WORDS_PER_VIEW;

    return this.state.words.slice(startIndex, endIndex);
  };

  focusNext = (current: number) => {
    if (current + 1 < WORDS_PER_VIEW) {
      this.focusSelect(current + 1);
    } else if (this.nextButtonRef.current) {
      this.nextButtonRef.current.focus();
    }
  };

  focusSelect = (index: number) => {
    const selectRef = this.verificationSelectRefs[index];

    if (selectRef) {
      // Typings are not up to date. Below is the link to method in case of any error.
      // https://github.com/bvaughn/react-virtualized-select/blob/b24fb1d59777d0d50cdb77b41a72cca1b58e0c00/source/VirtualizedSelect/VirtualizedSelect.js#L44
      (selectRef as any).focus();
    }
  };

  handleNextView = () => {
    this.setState(
      s => ({
        page: s.page + 1,
      }),
      () => {
        const startIndex = this.state.page * WORDS_PER_VIEW;
        const endIndex = startIndex + WORDS_PER_VIEW;

        const firstEmpty = this.state.words
          .slice(startIndex, endIndex)
          .findIndex(word => word === null);

        if (firstEmpty !== -1) {
          this.focusSelect(firstEmpty);
        }
      },
    );
  };

  handlePreviousView = () => {
    if (this.state.page > 0) {
      this.setState(s => ({
        page: s.page - 1,
      }));
    }
  };

  handleSendWords = () => {
    this.props.sendWords(this.state.words.join(" "));
  };

  render(): React.ReactNode {
    const startIndex = this.state.page * WORDS_PER_VIEW;
    const endIndex = startIndex + WORDS_PER_VIEW;

    const canAdvance = this.state.words.slice(startIndex, endIndex).every(word => word !== null);

    const canSubmit = this.state.words.every(word => word !== null);

    return (
      <>
        <Col className="mt-4 pb-4">
          <HeaderProgressStepper
            headerText={<FormattedMessage id="wallet-selector.recover.seed.header" />}
            descText={<FormattedMessage id="wallet-selector.recover.seed.recover-description" />}
            currentStep={this.props.startingStep + this.state.page + 1}
            steps={this.props.extraSteps + SEED_LENGTH / WORDS_PER_VIEW}
          />
        </Col>
        <Row className="my-2">
          <Col className="text-center">
            {this.state.words.filter(word => word !== null).join(" , ")}
          </Col>
        </Row>
        <Row>
          {range(startIndex, endIndex).map((num, i) => (
            <Col xs={{ size: 6, offset: 3 }} sm={{ size: 3, offset: 0 }} key={num} className="my-3">
              {this.generateSelect(num, i)}
            </Col>
          ))}
        </Row>
        <Row className="d-flex justify-content-between my-3">
          <Button
            data-test-id="btn-previous"
            disabled={startIndex === 0}
            onClick={this.handlePreviousView}
          >
            <FormattedMessage id="wallet-selector.recovery.seed.previous-words" />
          </Button>
          {this.state.page + 1 < SEED_LENGTH / WORDS_PER_VIEW && (
            <Button
              data-test-id="btn-next"
              disabled={!canAdvance}
              onClick={this.handleNextView}
              ref={this.nextButtonRef}
            >
              <FormattedMessage
                id="wallet-selector.recovery.seed.next-words"
                values={{ words: `${endIndex} / ${SEED_LENGTH}` }}
              />
            </Button>
          )}
        </Row>
        <Row className="text-center my-3">
          <Col>
            <Button data-test-id="btn-send" disabled={!canSubmit} onClick={this.handleSendWords}>
              <FormattedMessage id="wallet-selector.recovery.seed.send-words-button" />
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}
