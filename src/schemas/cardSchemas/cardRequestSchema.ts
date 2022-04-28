import joi from "joi";

const cardRequestSchema = joi.object({
  employeeId: joi.number().integer().positive().required(),
  cardType: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export default cardRequestSchema;
