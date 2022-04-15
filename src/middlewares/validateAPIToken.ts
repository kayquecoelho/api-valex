import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService.js";

export async function validateAPIToken(req: Request, res: Response, next: NextFunction) {
  const apiToken = req.headers['x-api-key'];
  
  if (typeof apiToken !== "string") return res.sendStatus(401);

  await authService.validateApiToken(apiToken);

  next();
}