import { NextFunction, Request, Response } from "express";

export default function validateSchema(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const message = validation.error.details.map(d => d.message).join(", ");
      return res.status(422).send(message);
    }

    next();
  }
}