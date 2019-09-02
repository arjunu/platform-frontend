import * as React from "react";
import { compose, setDisplayName, withProps } from "recompose";

import { TDataTestId } from "../../types";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
//@ts-ignore
import * as OnfidoSDK from "onfido-sdk-ui";

interface IState {
    requestState?: any
    individualData?: any
    uploadRequest?: any
    checkRequest?: any
}
  
interface IStateProps {
}

const jwtKey = "NF_JWT";

// configuration object for the onfido upload
// will most likely be changed once we better know
// how this stuff works
const onfidoSteps = [
    {
        type: "welcome",
        options: {
            title: "Verify your Neufund Account",
            descriptions: [
                "Please make sure you have a device with a working camera"]
        }
    }, {
        type: "document",
        options: {
          documentTypes: {
              passport: true,
              driving_licence: false,
              national_identity_card: true
          }
      }
    }, {
  //       type: "poa",
  //       options: {
  //             documentTypes: {
  //                 bank_building_society_statement: true,
  //                 utility_bill: true,
  //                 council_tax: false, // GBR only
  //                 benefit_letters: false, // GBR only
  //                 government_letter: true // non-GBR only
  //             }
  //       }
  //   }, {
        type: "face",
        options: {
          requestedVariant: 'image',
          uploadFallback: true
        }
    }, {
        type: "complete",
        options: {
            message: "Thank you for submitting your request",
            submessage: "You will receive a message as soon as your request has been reviewed."
        }
    }
];

class OnfidoComponent extends React.Component<IStateProps, IState> {

    headers: any = {};

    constructor(props: IStateProps) {
      super(props);
      this.state = {};
    }

    componentDidMount() : void {
        // load state
        let jwt = localStorage.getItem(jwtKey);
        jwt = jwt.replace("\"", "");
        this.headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`,
        }
        this.getRequestState();
        this.getIndividualData();
        this.getOnfidoCheckRequest();
    }

    getRequestState() : void {
        const _this = this;
        fetch('/api/kyc/individual/request', {
            headers: this.headers, 
            method: "get"
        }).then(function(result){
            return result.json();
        }).then(function(data){
            _this.setState({
                ..._this.state,
                requestState: data
            });
        });
    }

    getIndividualData = () => {
        const _this = this;
        fetch('/api/kyc/individual/data', {
            headers: this.headers, 
            method: "get"
        }).then(function(result){
            return result.json();
        }).then(function(data){
            if (!data.status) {
                _this.setState({
                    ..._this.state,
                    individualData: data
                });
            }
        });
    }
  
    putIndividualData = () => {
        const _this = this;
        fetch('/api/kyc/individual/data', {
            headers: this.headers, 
            method: "put",
            body: JSON.stringify({first_name: "Dave", last_name: 'Scharf'})
        }).then(function(){
            _this.getIndividualData();
        });
    }

    getOnfidoCheckRequest = () => {
        const _this = this;
        fetch('/api/kyc/individual/request/onfido/check-request', {
            headers: this.headers, 
            method: "get"
        }).then(function(result){
            return result.json();
        }).then(function(data){
            if (data.status != 404) {
                _this.setState({
                    ..._this.state,
                    checkRequest: data
                });
            }
        });
    }

    startOnfidoUploadRequest = () => {
        const _this = this;
        const referrer = window.location.href;
        fetch('/api/kyc/individual/request/onfido/upload-request', {
            headers: this.headers, 
            method: "put",
            body: JSON.stringify({referrer})
        }).then(function(result){
            return result.json();
        }).then(function(data){
            if (!data.status) {
                _this.setState({
                    ..._this.state,
                    uploadRequest: data
                });
                _this.initOnfidoSDK();
            }
        });
    }

    initOnfidoSDK = () => {
        // taken from here: https://github.com/onfido/onfido-sdk-ui
        const _this = this;
        const webtoken = this.state.uploadRequest.webtoken;
        const onfido = OnfidoSDK.init({
        token: webtoken,
        containerId: 'onfido-container',
        useModal: true, 
        steps: onfidoSteps,
        isModalOpen: true, 
        onModalRequestClose: function() {
            // Update options with the state of the modal
            onfido.setOptions({isModalOpen: false})
        },
        onComplete: function() {
            console.log("Document upload complete: ")
            _this.startOnfidoCheck()
            }
        });
    }

    startOnfidoCheck = () => {  
        const _this = this;
        fetch('/api/kyc/individual/request/onfido/check-request', {
            headers: this.headers, 
            method: "put",
        }).then(function(result){
            return result.json();
        }).then(function(){
            _this.getRequestState();
        });
    }

    render(): React.ReactNode {
      console.log(this.state);
      if (!this.state.requestState) {
          return <div>Loading...</div>
      }

      // if there is no individual data store, we can create some dummy data
      if (this.state.requestState.status == "draft" && !this.state.individualData) {
        return <button onClick={this.putIndividualData}>Submit demo individual data</button>
      }

      // if there is data and we are in draft, we can start the onfido flow
      // or if we are in onfido outsourced state, we can also do this
      if ( (this.state.requestState.status == "draft" && this.state.individualData) ||
        (this.state.requestState.status == "outsourced" && this.state.requestState.instant_id_provider == "onfido")
      ) {
        return (
            <div>
                <button onClick={this.startOnfidoUploadRequest}>Start onfido upload request</button>
                <div id="onfido-container" />
            </div>
        )
      }


      if (this.state.requestState.status == "accepted") {
        return <div>Request accepted, all good!</div>;
      }


      return (
          <>
            <div>Unprocessable state for onfido test</div>
            <div>Status: {this.state.requestState.status}</div>
          </>
      )
    }
  }

export const Onfido = compose<{}, {}>(
  setDisplayName("Onifo"),
  withContainer(withProps<TDataTestId, {}>({ "data-test-id": "onfido-application" })(Layout)),
)(OnfidoComponent);

