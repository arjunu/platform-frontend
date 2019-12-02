import { expect } from "chai";
import { forEach, values } from "lodash";

import { actions } from "./actions";

// provide as many dummy arguments as action creator expects, but no less than one
//( actionCreator.length returns 0 if it takes an object as an argument so we still need to provide one dummy argument )
const provideDummyArguments = (actionCreator: Function) =>
  Array(actionCreator.length > 1 ? actionCreator.length : 1).fill({});

const ALLOWED_DUPLICATES: { [type: string]: boolean } = {
  "@@router/CALL_HISTORY_METHOD": true,
};

describe("modules", () => {
  describe("actions", () => {
    it("should have unique types", () => {
      const typeMap: { [key: string]: boolean } = {};

      forEach(actions, actionDict =>
        forEach(actionDict, (actionCreator: any, creatorName: string) => {
          const action = actionCreator(...provideDummyArguments(actionCreator));

          const type: string = action.type;

          // we have aliases for displaying generic modals
          if (type === actions.genericModal.showGenericModal.getType()) {
            return;
          }

          !ALLOWED_DUPLICATES[type] &&
            expect(
              typeMap[action.type],
              `Duplicate action type ${action.type} created by creator ${creatorName}`,
            ).to.be.undefined;

          typeMap[type] = true;
        }),
      );
    });

    it("should not have undefined types", () => {
      forEach(actions, actionDict =>
        forEach(actionDict, (actionCreator: any, creatorName: string) => {
          const action = actionCreator(...provideDummyArguments(actionCreator));
          const type: string = action.type;
          expect(type, `Action type of creator ${creatorName} is undefined`).to.not.be.undefined;
        }),
      );
    });

    it("should not have values apart from payload and type", () => {
      forEach(actions, actionDict =>
        forEach(actionDict, (actionCreator: any, creatorName: string) => {
          const action = actionCreator(...provideDummyArguments(actionCreator));
          const testAction = {
            ...action,
            type: "something",
            payload: {},
          };
          expect(
            values(testAction).length,
            `Action type of creator ${creatorName} has to many properties`,
          ).to.not.be.greaterThan(2);
        }),
      );
    });
  });
});
