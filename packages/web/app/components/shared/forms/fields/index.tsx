import { FormInput } from "./FormInput";
// TODO: Find a better name for internal
import { FormMaskedNumberInput as FormMaskedNumberInputInternal } from "./FormMaskedNumberInput";
import { withFormField } from "./utils.unsafe";

export const FormMaskedNumberInput = withFormField()(FormMaskedNumberInputInternal);

export const FormField = withFormField()(FormInput);
