declare module "onfido-sdk-ui" {
  type TOnfidoOptions = {
    token: string;
    useModal: boolean;
    steps: object[];
    shouldCloseOnOverlayClick: boolean;
    isModalOpen: boolean;
    onModalRequestClose: () => void;
    onComplete: () => void;
  };

  type TOnfido = {
    tearDown: () => void;
    setOptions: (options: Partial<TOnfidoOptions>) => void;
  };

  export function init<T>(o: TOnfidoOptions): TOnfido;
}
