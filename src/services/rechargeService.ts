import * as errors from "../errors/errors.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import dayjs from "dayjs";

export async function insertRecharge(cardId: number, amount: number) {
  await ensureCardIsValid(cardId);

  await rechargeRepository.insert({ cardId, amount });
}

async function ensureCardIsValid(cardId: number){
  const card = await findCard(cardId);

  const cardIsExpired = dayjs(card.expirationDate).isAfter(dayjs());

  if (cardIsExpired) throw errors.unauthorized("Card is expired so");

  if (card.isVirtual) throw errors.unauthorized("Card is virtual so")

  return card;
}

async function findCard(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) throw errors.notFound("Card");
  return card;
}