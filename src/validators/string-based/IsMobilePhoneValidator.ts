"use strict";

import { PropertyValidator } from "../PropertyValidator";
import { MobilePhoneLocale } from "../../shared/";
import * as validatorJS from "validator";

export class IsMobilePhoneValidator implements PropertyValidator<string> {

    constructor(private locale: MobilePhoneLocale) { }

    isValid(input: string): boolean {
        return validatorJS.isMobilePhone(input, this.locale);
    }
}