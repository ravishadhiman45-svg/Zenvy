const joi = require('joi')
const registerSchema = joi.object({
    fullname: joi.string().required().messages({
        "string.empty":"Full name is required",
    }),
    email:joi.string().required().messages({
        "string.empty":"Email is required",
    }),
    password:joi.string().min(6).required().messages({
        "string.empty":"Password is required",
        "string.min":"Password must be of 6 characters",
    }),
})

module.exports = {
    registerSchema
};