import { Request, Response } from "express";
import * as paymentsService from "../services/paymentsService.js";

export async function insertPayment(req: Request, res: Response) {
  const data = req.body;

  await paymentsService.insertPayment(data);
  
  res.sendStatus(201);
}

export async function insertOnlinePayment(req: Request, res: Response) {
  await paymentsService.insertOnlinePayment(req.body);
  
  res.sendStatus(201);
}