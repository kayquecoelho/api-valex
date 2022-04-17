import { Request, Response } from "express";
import * as cardsService from "../services/cardsServices.js";

export async function createCard(req: Request, res: Response) {
  await cardsService.createCard(req.body);

  res.sendStatus(201);
}

export async function createDigitalCard(req: Request, res: Response) {
  await cardsService.createDigitalCard(req.body);

  res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
  const cardId = Number(req.params.id);

  if (isNaN(cardId) || cardId <= 0) return res.sendStatus(422);
  
  await cardsService.activateCard({...req.body, cardId});

  res.sendStatus(200);
}

export async function getCardBalance(req: Request, res: Response) {
  const { id } = req.params;
  const idNum = Number(id);

  if(isNaN(idNum)) return res.sendStatus(422);

  const result = await cardsService.getCardBalance(idNum);

  res.send(result);
}

export async function blockCard(req: Request, res: Response) {
  const cardId = Number(req.params.id);

  if (isNaN(cardId) || cardId <= 0) return res.sendStatus(422);
  
  await cardsService.blockCard({...req.body, cardId});

  res.sendStatus(200);
}

export async function deleteDigitalCard(req: Request, res: Response) {
  const cardId = Number(req.params.id);
  const { password } = req.body;

  if (isNaN(cardId) || cardId <= 0 || !password) return res.sendStatus(422);

  await cardsService.deleteDigitalCard(cardId, password);

  res.sendStatus(200);
}