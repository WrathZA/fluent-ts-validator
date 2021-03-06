import {PropertyValidator} from "../PropertyValidator";
import {CurrencyOptions} from "../../shared";
import * as validatorJS from "validator";

export class IsCurrencyValidator implements PropertyValidator<string> {

    constructor(private options?: CurrencyOptions) {
    }

    isValid(input: string | undefined): boolean {
        if (input) {
            return validatorJS.isCurrency(input, this.options);
        }
        return false;
    }
}
