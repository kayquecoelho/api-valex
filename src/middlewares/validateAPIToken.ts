import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService.js";

export async function validateAPIToken(req: Request, res: Response, next: NextFunction) {
  const apiToken = req.headers['x-api-key'] as string;
  
  if (typeof apiToken !== "string" || !apiToken) return res.sendStatus(401);

  await authService.validateApiToken(apiToken);

  next();
}