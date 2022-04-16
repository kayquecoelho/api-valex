import joi from "joi";

const paymentSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  businessId: joi.number().integer().positive().required(),
  password: joi.string().required(),
  amountPaid: joi.number().integer().positive().min(1).required()
});

export default paymentSchema;