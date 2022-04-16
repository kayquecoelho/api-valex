import joi from "joi";

const rechargesSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  rechargeAmount: joi.number().integer().positive().min(1).required()
});

export default rechargesSchema;