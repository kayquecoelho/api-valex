import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function insertRecharge(req: Request, res: Response) {
  const { cardId, rechargeAmount } = req.body;

  await rechargeService.insertRecharge(cardId, rechargeAmount);

  res.sendStatus(200);
}