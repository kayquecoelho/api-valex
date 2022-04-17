import joi from "joi";

const regex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

const onlinePaymentSchema = joi.object({
  holderName: joi.string().required(), 
  number: joi.string().pattern(regex).required(),
  securityCode: joi.string().length(3).required(),
  expirationDate: joi.date().required(), 
  businessId: joi.number().integer().positive().required(),
  amountPaid: joi.number().integer().positive().min(1).required()
});

export default onlinePaymentSchema;