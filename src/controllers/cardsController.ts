import { Request, Response } from "express";
import * as cardsService from "../services/cardsServices.js";

export async function createCard(req: Request, res: Response) {
  await cardsService.createCard(req.body);
  res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
  await cardsService.activateCard(req.body);

  res.sendStatus(200);
}