const joi = require('joi')
const loginSchema = joi.object({
    email:joi.string().required().messages({
        "string.empty" : "Email is required",
    }),
    password: joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
})

module.exports = {
    loginSchema,
}