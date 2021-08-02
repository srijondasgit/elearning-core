const Joi = require('@hapi/joi');


//Validation register
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        role: Joi.string()
            .exist(["User","CharityAdmin","SuperAdmin"])
            .required()
    });   
    return schema.validate(data);
};

const shCodeValidation = data => {
    const schema = Joi.object({
        shortCode: Joi.string()
            .min(8)
            .max(8)
            .required()
    });   
    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.shCodeValidation = shCodeValidation;