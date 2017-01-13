"use strict";

import {
    Validatable,
    ValidationResult
} from "./shared";

import {
    ValidationRule,
    CollectionValidationRule,
    RuleApplicationOutcome
} from "./validation";

import {
    CommonValidatorBuilder,
    CommonValidatorBuilderImpl,
    DateValidatorBuilder,
    DateValidatorBuilderImpl,
    NumberValidatorBuilder,
    NumberValidatorBuilderImpl,
    StringValidatorBuilder,
    StringValidatorBuilderImpl,
    TypeValidatorBuilder,
    TypeValidatorBuilderImpl,
    ValidationOptionsBuilder
} from "./builder";

/**
 * Abstract base class for all custom validators.
 *
 * @export
 * @abstract
 * @class AbstractValidator
 * @template T
 */
export abstract class AbstractValidator<T> implements Validatable<T> {

    private rules: ValidationRule<T, any>[] = [];

    protected ruleFor<TProperty>(lambdaExpression: (input: T) => TProperty): CommonValidatorBuilder<T, TProperty> {
        let rule: ValidationRule<T, TProperty> = new ValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new CommonValidatorBuilderImpl(rule);
    }

    protected ruleForAny(lambdaExpression: (input: T) => any): TypeValidatorBuilder<T> {
        let rule: ValidationRule<T, any> = new ValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new TypeValidatorBuilderImpl(rule);
    }

    protected ruleForNumber(lambdaExpression: (input: T) => number): NumberValidatorBuilder<T> {
        let rule: ValidationRule<T, number> = new ValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new NumberValidatorBuilderImpl(rule);
    }

    protected ruleForDate(lambdaExpression: (input: T) => Date): DateValidatorBuilder<T> {
        let rule: ValidationRule<T, Date> = new ValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new DateValidatorBuilderImpl(rule);
    }

    protected ruleForString(lambdaExpression: (input: T) => string): StringValidatorBuilder<T> {
        let rule: ValidationRule<T, string> = new ValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new StringValidatorBuilderImpl(rule);
    }

    protected ruleForEach<TProperty>(lambdaExpression: (input: T) => Iterable<TProperty>): CommonValidatorBuilder<T, TProperty> {
        let rule: ValidationRule<T, Iterable<TProperty>> = new CollectionValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new CommonValidatorBuilderImpl(rule);
    }

    protected ruleForEachAny(lambdaExpression: (input: T) => Iterable<any>): TypeValidatorBuilder<T> {
        let rule: ValidationRule<T, Iterable<any>> = new CollectionValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new TypeValidatorBuilderImpl(rule);
    }

    protected ruleForEachNumber(lambdaExpression: (input: T) => Iterable<number>): NumberValidatorBuilder<T> {
        let rule: ValidationRule<T, Iterable<number>> = new CollectionValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new NumberValidatorBuilderImpl(rule);
    }

    protected ruleForEachDate(lambdaExpression: (input: T) => Iterable<Date>): DateValidatorBuilder<T> {
        let rule: ValidationRule<T, Iterable<Date>> = new CollectionValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new DateValidatorBuilderImpl(rule);
    }

    protected ruleForEachString(lambdaExpression: (input: T) => Iterable<string>): StringValidatorBuilder<T> {
        let rule: ValidationRule<T, Iterable<string>> = new CollectionValidationRule(lambdaExpression);
        this.rules.push(rule);

        return new StringValidatorBuilderImpl(rule);
    }

    validate(input: T): ValidationResult {
        let result = new ValidationResult();

        this.rules.forEach((rule: any) => {
            let outcome = rule.apply(input);

            if (outcome.isFailure()) {
                result.addFailures(outcome.getValidationFailures());
            }
        });

        return result;
    }

    validateAsync(input: T): Promise<ValidationResult> {
        return new Promise<ValidationResult>((resolve) => {
            let promises = this.createPromiseForEachRule(input, this.rules);

            Promise.all(promises).then((outcomes: RuleApplicationOutcome[]) => {
                resolve(this.buildValidationResultFrom(outcomes));
            });
        });
    }

    private createPromiseForEachRule(input: T, rules: ValidationRule<T, any>[]): Array<Promise<RuleApplicationOutcome>> {
        let promises = new Array<Promise<RuleApplicationOutcome>>();

        rules.forEach((rule: ValidationRule<T, any>) => {
            promises.push(this.applyRuleAsync(rule, input));
        });

        return promises;
    }

    private applyRuleAsync(rule: ValidationRule<T, any>, input: T): Promise<RuleApplicationOutcome> {
        return new Promise((resolve) => {
            resolve(rule.apply(input));
        });
    }

    private buildValidationResultFrom(outcomes: RuleApplicationOutcome[]): ValidationResult {
        let result = new ValidationResult();
        outcomes.forEach((outcome: RuleApplicationOutcome) => {
            if (outcome.isFailure()) {
                result.addFailures(outcome.getValidationFailures());
            }
        });
        return result;
    }
}