import { QualityRequestValidator } from './quality-request-validator.js';
export class ValidationGuard {
    validator;
    constructor(validator = new QualityRequestValidator()) {
        this.validator = validator;
    }
    validate(input) {
        return this.validator.validate(input);
    }
}
//# sourceMappingURL=validation-guard.js.map