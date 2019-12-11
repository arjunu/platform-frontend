import * as React from "react";
import { connect } from "react-redux";

import { AppDispatch } from "../../store";

interface IOnLeaveActionDispatchProps {
  enterAction: Function;
}

interface IOnLeaveActionOptions<P = {}> {
  actionCreator: (dispatch: AppDispatch, props: P) => void;
  pure?: boolean;
}

/**
 * This should be merged with OnEnterAction HOC
 */
export const onLeaveAction = <P extends object = {}>(options: IOnLeaveActionOptions<P>) => (
  WrappedComponent: React.ComponentType,
) =>
  connect<{}, IOnLeaveActionDispatchProps, P>(
    undefined,
    (dispatch, props) => ({
      enterAction: () => options.actionCreator(dispatch, props),
    }),
    undefined,
    {
      pure: options.pure,
    },
  )(
    class OnLeaveAction extends React.Component<IOnLeaveActionDispatchProps> {
      componentWillUnmount(): void {
        this.props.enterAction();
      }

      render(): React.ReactNode {
        const { enterAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
