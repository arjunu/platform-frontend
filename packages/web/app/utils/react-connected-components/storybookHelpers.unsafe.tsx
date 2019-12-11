import * as MockDate from "mockdate";
import * as React from "react";

import { Modal } from "../../components/modals/Modal";

export const withModalBody = (className?: string) => (story: any) => (
  <Modal isOpen={true} onClose={() => {}} className={className}>
    {story()}
  </Modal>
);

class MockDateComp extends React.Component<{ story: any; testDate: Date }> {
  constructor(props: any) {
    super(props);
    MockDate.set(this.props.testDate);
  }

  render(): React.ReactNode {
    return this.props.story();
  }

  componentWillUnmount(): void {
    MockDate.reset();
  }
}

export const withMockedDate = (testDate: Date) => (story: any) => (
  <MockDateComp testDate={testDate} story={story} />
);
