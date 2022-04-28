import joi from "joi";

const activateCardSchema = joi.object({
    password: joi.string().pattern(/^[0-9]{4}$/).required(),
    securityCode: joi.string().length(3).required()
});

export default activateCardSchema;