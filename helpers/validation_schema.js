import Joi from "joi";

const authSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': `Name should be a type of 'text'`,
        'string.empty': `Name cannot be an empty field`,
        'any.required': `Name is a required field`
    }),
    email: Joi.string().email().lowercase().pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).required().messages({
        'string.base': `Email should be a type of 'text'`,
        'string.email': `Email must be a valid email`,
        'string.empty': `Email cannot be an empty field`,
        'any.required': `Email is a required field`
    }),
    phone: Joi.string().length(10).pattern(/^\d{10}$/).required().messages({
        'string.base': `Phone should be a type of 'text'`,
        'string.length': `Phone number must be exactly 10 digits`,
        'string.pattern.base': `Phone number must be a valid 10-digit number`,
        'any.required': `Phone is a required field`
    }),
    password: Joi.string().min(8).max(15).pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])')).required().messages({
        'string.base': `Password should be a type of 'text'`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': `Password should have a minimum length of {#limit}`,
        'string.max': `Password should have a maximum length of {#limit}`,
        'string.pattern.base': `Password must contain at least one capital letter and one special character`,
        'any.required': `Password is a required field`
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).required().messages({
        'string.base': `Email should be a type of 'text'`,
        'string.email': `Email must be a valid email`,
        'string.empty': `Email cannot be an empty field`,
        'any.required': `Email is a required field`
    }),
    password: Joi.string().min(8).max(15).pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])')).required().messages({
        'string.base': `Password should be a type of 'text'`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': `Password should have a minimum length of {#limit}`,
        'string.max': `Password should have a maximum length of {#limit}`,
        'string.pattern.base': `Password must contain at least one capital letter and one special character`,
        'any.required': `Password is a required field`
    })
});

export default {
    authSchema, loginSchema
}