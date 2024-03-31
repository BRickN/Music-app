import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure } from "vee-validate";
import { required, min, max, alpha_spaces as alphaSpaces, email, min_value as minVal, max_value as maxVal, confirmed, not_one_of as notOneOf } from '@vee-validate/rules'

export default {
    install(app) {
        app.component("VeeForm", VeeForm);
        app.component("VeeField", VeeField);
        app.component("ErrorMessage", ErrorMessage);

        defineRule('required', required);
        defineRule('tos', required);
        defineRule('min', min);
        defineRule('max', max);
        defineRule('alpha_spaces', alphaSpaces);
        defineRule('email', email);
        defineRule('min_value', minVal);
        defineRule('max_value', maxVal);
        defineRule('passwords_mismatch', confirmed);
        defineRule('not_one_of', notOneOf);
        defineRule('not_one_of_country', notOneOf);

        configure({
            generateMessage: (ctx) => {
                const messages = {
                    required: `The field ${ctx.field} is required.`,
                    tos: `You must accept the terms of service`,
                    min: `The field ${ctx.field} is too short.`,
                    max: `The field ${ctx.field} is too long.`,
                    alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
                    email: `The field ${ctx.field} must be a valid email.`,
                    min_value: `The field ${ctx.field} is too low.`,
                    max_value: `The field ${ctx.field} is too high.`,
                    passwords_mismatch: `Passwords must match`,
                    not_one_of: `You are not allowed to use this value for the field ${ctx.field}.`,
                    not_one_of_country: `Due to restrictions we do not accept users from this location.`,
                }

                return messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${ctx.field} is invalid.`
            },
            validateOnBlur: true,
            validateOnChange: true,
            validateOnInput: false,
            validateOnModelUpdate: true
        });
    }
}
