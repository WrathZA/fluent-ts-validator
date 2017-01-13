/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />

"use strict";

import * as validatorJS from "validator";
import { IsLowercaseValidator } from "./IsLowercaseValidator";


describe("IsLowercaseValidator", () => {
    let validator: IsLowercaseValidator;

    beforeEach(() => {
        validator = new IsLowercaseValidator();
    });

    describe("isValid()", () => {
        it("should delegate to validatorJS instance - success case", () => {
            spyOn(validatorJS, "isLowercase").and.returnValue(true);

            let result = validator.isValid("abc");

            expect(result).toBeTruthy();
            expect(validatorJS.isLowercase).toHaveBeenCalledWith("abc");
        });

        it("should delegate to validatorJS instance - failure case", () => {
            spyOn(validatorJS, "isLowercase").and.returnValue(false);

            let result = validator.isValid("ABC");

            expect(result).toBeFalsy();
            expect(validatorJS.isLowercase).toHaveBeenCalledWith("ABC");
        });
    });
});