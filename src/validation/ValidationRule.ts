"use strict";

import { PropertyValidator } from "../validators/PropertyValidator";
import { RuleApplicationOutcome } from "./RuleApplicationOutcome";
import { ValidationFailure } from "./ValidationFailure";
import { Severity } from "./Severity";
import { ValidationCondition } from "./ValidationCondition";

const SUCCESSFUL_OUTCOME = new RuleApplicationOutcome();

export class ValidationRule<T, TProperty> {

    private errorCode: string;
    private errorMessage: string;
    private severity: Severity;
    private condition: ValidationCondition<T>;
    private callback: (failure: ValidationFailure) => void;

    constructor(private lambdaExpression: (input: T) => TProperty, private validator: PropertyValidator<TProperty>) { }

    setErrorCode(errorCode: string) {
        this.errorCode = errorCode;
    }

    setErrorMessage(errorMessage: string) {
        this.errorMessage = errorMessage;
    }

    setSeverity(severity: Severity) {
        this.severity = severity;
    }

    setCondition(condition: ValidationCondition<T>) {
        this.condition = condition;
    }

    onFailure(callback: (failure: ValidationFailure) => void) {
        this.callback = callback;
    }

    apply(input: T): RuleApplicationOutcome {

        if (this.condition && !this.condition.shouldDoValidation(input)) {
            return SUCCESSFUL_OUTCOME;
        }

        let propertyValue = this.lambdaExpression(input);

        if (this.validator.isValid(propertyValue)) {
            return SUCCESSFUL_OUTCOME;
        }

        let failure = new ValidationFailure(input, null, propertyValue, this.errorCode, this.errorMessage, this.severity);

        if (this.callback) {
            this.callback(failure);
        }

        return new RuleApplicationOutcome(failure);
    }
}