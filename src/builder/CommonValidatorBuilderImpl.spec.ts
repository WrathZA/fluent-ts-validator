/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />

"use strict";

import {
    AbstractValidator
} from "../";

import {
    CommonValidatorBuilder,
    CommonValidatorBuilderImpl
} from "./";

import {
    ValidationRule
} from "../validation";

import {
    IsDefinedValidator,
    IsNullValidator,
    IsNotNullValidator,
    IsEmptyValidator,
    IsNotEmptyValidator,
    IsEqualValidator,
    IsNotEqualValidator,
    IsInValidator,
    IsNotInValidator
} from "../validators/common";

class TestClass {
    property: string;

    constructor(property: string) {
        this.property = property;
    }
}

describe("CommonValidatorBuilderImpl", () => {

    let validationRule: ValidationRule<TestClass, string>;
    let validatorBuilder: CommonValidatorBuilder<TestClass, string>;

    beforeEach(() => {
        validationRule = new ValidationRule((input: TestClass) => { return input.property; });
        spyOn(validationRule, "addValidator").and.callThrough();
        validatorBuilder = new CommonValidatorBuilderImpl(validationRule);
    });

    describe("isDefined()", () => {
        it("should set IsDefinedValidator to validation rule", () => {
            validatorBuilder.isDefined();

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsDefinedValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isDefined();

            expect(result).not.toBeNull();
        });
    });

    describe("isNull()", () => {
        it("should set IsNullValidator to validation rule", () => {
            validatorBuilder.isNull();

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsNullValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isNull();

            expect(result).not.toBeNull();
        });
    });

    describe("isNotNull()", () => {
        it("should set IsNotNullValidator to validation rule", () => {
            validatorBuilder.isNotNull();

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsNotNullValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isNotNull();

            expect(result).not.toBeNull();
        });
    });

    describe("isEmpty()", () => {
        it("should set IsEmptyValidator to validation rule", () => {
            validatorBuilder.isEmpty();

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsEmptyValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isEmpty();

            expect(result).not.toBeNull();
        });
    });

    describe("isNotEmpty()", () => {
        it("should set IsNotEmptyValidator to validation rule", () => {
            validatorBuilder.isNotEmpty();

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsNotEmptyValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isNotEmpty();

            expect(result).not.toBeNull();
        });
    });

    describe("isEqualTo()", () => {
        it("should set IsEqualValidator to validation rule", () => {
            validatorBuilder.isEqualTo("foo");

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsEqualValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isEqualTo("foo");

            expect(result).not.toBeNull();
        });
    });

    describe("isNotEqualTo()", () => {
        it("should set IsNotEqualValidator to validation rule", () => {
            validatorBuilder.isNotEqualTo("foo");

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsNotEqualValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isNotEqualTo("foo");

            expect(result).not.toBeNull();
        });
    });

    describe("isIn()", () => {
        it("should set IsValidator to validation rule", () => {
            validatorBuilder.isIn(["allowed value"]);

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsInValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isIn(["allowed value"]);

            expect(result).not.toBeNull();
        });
    });

    describe("isNotIn()", () => {
        it("should set IsValidator to validation rule", () => {
            validatorBuilder.isNotIn(["element value"]);

            expect(validationRule.addValidator).toHaveBeenCalledWith(jasmine.any(IsNotInValidator));
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.isNotIn(["element value"]);

            expect(result).not.toBeNull();
        });
    });

    describe("must()", () => {
        it("should set custom validation logic to validation rule", () => {
            let validationExpression = (input: string) => { return input === "foobar"; };

            validatorBuilder.must(validationExpression);

            expect(validationRule.addValidator).toHaveBeenCalled();
        });

        it("should actually apply custom validation logic and succeed", () => {
            validatorBuilder.must((input: string) => {
                return input === "foobar";
            });

            let outcome = validationRule.apply(new TestClass("foobar"));

            expect(outcome.isSuccess()).toBeTruthy();
        });

        it("should actually apply custom validation logic and fail", () => {
            validatorBuilder.must((input: string) => {
                return input === "barfoo";
            });

            let outcome = validationRule.apply(new TestClass("foobar"));

            expect(outcome.isSuccess()).toBeFalsy();
        });

        it("should return new instance of a ValidationOptionsBuilder", () => {
            let result = validatorBuilder.must((input: string) => { return input === "foobar"; });

            expect(result).not.toBeNull();
        });
    });
});

/**
 * ========================================================================
 * vvv Tests concerning addValidator function of CommonValidatorBuilder vvv
 * ========================================================================
 */

class OuterTestClass {
    property: InnerTestClass;

    constructor(property: InnerTestClass) {
        this.property = property;
    }
}

class InnerTestClass {
    property: string;
    constructor(property: string) {
        this.property = property;
    }
}

class InnerValidator extends AbstractValidator<InnerTestClass> {
    constructor() {
        super();
        this.ruleFor((input: InnerTestClass) => { return input.property; }).isNotEmpty();
    }
}

describe("CommonValidatorBuilderImpl addValidator()", () => {
    let inner: InnerTestClass;
    let innerValidator: InnerValidator;
    let validationRule: ValidationRule<OuterTestClass, InnerTestClass>;
    let validatorBuilder: CommonValidatorBuilderImpl<OuterTestClass, InnerTestClass>;

    beforeEach(() => {
        inner = new InnerTestClass("foo");
        innerValidator = new InnerValidator();
        validationRule = new ValidationRule((input: OuterTestClass) => { return input.property; });
        validatorBuilder = new CommonValidatorBuilderImpl(validationRule);
        spyOn(innerValidator, "validate").and.callThrough();
    });

    it("should return new instance of a ValidationOptionsBuilder", () => {
        let result = validatorBuilder.addValidator(innerValidator);

        expect(result).not.toBeNull();
    });

    it("should use validatable to apply validation rules - success case", () => {
        validatorBuilder.addValidator(innerValidator);

        let result = validationRule.apply(new OuterTestClass(new InnerTestClass("foo")));

        expect(result.isSuccess()).toBeTruthy();
    });

    it("should use validatable to apply validation rules - failure case", () => {
        validatorBuilder.addValidator(innerValidator);

        let result = validationRule.apply(new OuterTestClass(new InnerTestClass("")));

        expect(result.isFailure()).toBeTruthy();
    });

    it("should delegate to given validator during validation", () => {
        validatorBuilder.addValidator(innerValidator);
        let objectUnderTest = new InnerTestClass("foo");

        validationRule.apply(new OuterTestClass(objectUnderTest));

        expect(innerValidator.validate).toHaveBeenCalledWith(objectUnderTest);
    });
});