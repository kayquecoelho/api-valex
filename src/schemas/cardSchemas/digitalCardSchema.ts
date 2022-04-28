import joi from "joi";

const digitalCardSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  password: joi.string().required()
});

export default digitalCardSchema;