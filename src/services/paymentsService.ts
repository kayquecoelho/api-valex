import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as cardService from "../services/cardsServices.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as errors from "../errors/errors.js";

export async function insertPayment(data: any) {
  const { cardId, amountPaid, password, businessId } = data;

  const card = await ensureCardIsValid(cardId);

  if (!bcrypt.compareSync(password, card.password)) {
    throw errors.unauthorized("Password");
  }

  await ensureBusinessIsValid(businessId, card.type);

  await checkCardBalance(amountPaid, cardId);

  await paymentRepository.insert({ cardId, amount: amountPaid, businessId });
}

async function checkCardBalance(amountPaid: number, cardId: number) {
  const { balance } = await cardService.getCardBalance(cardId);

  if (balance < amountPaid)
    throw errors.unauthorized("Insufficient funds");
}

async function ensureCardIsValid(cardId: number){
  const card = await findCard(cardId);

  const cardIsExpired = dayjs(card.expirationDate).isAfter(dayjs());

  if (cardIsExpired) throw errors.unauthorized("Card is expired so");

  if(card.isBlocked) throw errors.unauthorized("Card is blocked so");

  return card;
}

async function findCard(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) throw errors.notFound("Card");
  return card;
}

async function ensureBusinessIsValid(businessId: number, cardType: string) {
  const business = await businessRepository.findById(businessId);

  if (!business) throw errors.notFound("Business");

  if (cardType !== business.type) throw errors.unauthorized("Business type to the card");
}