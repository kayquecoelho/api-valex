import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  res.sendStatus(500);
}
