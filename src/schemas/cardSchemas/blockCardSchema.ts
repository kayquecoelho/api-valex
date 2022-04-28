import joi from "joi";

const blockCardSchema = joi.object({
  password: joi.string().required(),
});

export default blockCardSchema;