"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsMMI = IsMMI;
const class_validator_1 = require("class-validator");
const romanRegex = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/i;
function IsMMI(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isMMI',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    return (!value || !isNaN(value) || romanRegex.test(value.toUpperCase()));
                },
                defaultMessage() {
                    return `${propertyName} must be a number (1–12) or a valid Roman numeral (I–XII)`;
                },
            },
        });
    };
}
//# sourceMappingURL=validatorMMI.js.map