import type { ValidateError, ValidateFieldsError } from "async-validator";

export interface FormValidateFailure {
    errors: ValidateError[] | null;
    fields: ValidateFieldsError;
}
