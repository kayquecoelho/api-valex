import joi from "joi";

const cardRequestSchema = joi.object({
  employeeId: joi.number().integer().positive().required(),
  cardType: joi.string().required()
});

export default cardRequestSchema;