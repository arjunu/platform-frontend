import { InputLayout } from "../layouts/InputLayout";
import { MaskedNumberInputLayout } from "../layouts/MaskedNumberInputLayout";
import { withBareFormField } from "./utils";

export const MaskedNumberInput = withBareFormField(MaskedNumberInputLayout);

export const Input = withBareFormField(InputLayout);
