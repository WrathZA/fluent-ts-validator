import {PropertyValidator} from "../PropertyValidator";
import {CommonCollection} from "../../shared/CommonCollection";
import {hasLength, hasSize} from "./CollectionGuard";

export class HasNumberOfElementsValidator implements PropertyValidator<CommonCollection> {

    constructor(private numberOfElements: number) {
    }

    isValid(input: CommonCollection): boolean {
        if (hasLength(input)) {
            return input.length === this.numberOfElements;
        } else if (hasSize(input)) {
            return input.size === this.numberOfElements;
        } else {
            return false;
        }
    }
}
