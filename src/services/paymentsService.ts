import dayjs from "dayjs";

import * as cardService from "../services/cardsServices.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as errors from "../errors/errors.js";
import * as bcryptService from "./bcryptService.js";

export async function insertPayment(data: any) {
  const { cardId, amountPaid, password, businessId } = data;

  const card = await findCardById(cardId);

  ensureCardIsActiveAndNotExpired(card);

  bcryptService.validateAccess(password, card.password);

  await ensureBusinessIsValid(businessId, card.type);

  await checkCardBalance(amountPaid, cardId);

  await paymentRepository.insert({ cardId, amount: amountPaid, businessId });
}

export async function insertOnlinePayment(data: any) {
  const { securityCode, businessId, amountPaid } = data;

  const card = await findCardByDetails(data);

  ensureCardIsActiveAndNotExpired(card);

  bcryptService.validateAccess(securityCode, card.securityCode);

  await ensureBusinessIsValid(businessId, card.type);

  await checkCardBalance(amountPaid, card.id);

  await paymentRepository.insert({ cardId: card.id, amount: amountPaid, businessId });  
}

async function checkCardBalance(amountPaid: number, cardId: number) {
  const { balance } = await cardService.getCardBalance(cardId);

  if (balance < amountPaid)
    throw errors.unauthorized("Insufficient funds");
}

function ensureCardIsActiveAndNotExpired(card: cardRepository.Card) {
  const cardIsExpired = dayjs(card.expirationDate).isAfter(dayjs());

  if (cardIsExpired)
    throw errors.unauthorized("Card is expired so");

  if (card.isBlocked)
    throw errors.unauthorized("Card is blocked so");
}

async function findCardById(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) throw errors.notFound("Card");
  return card;
}

async function ensureBusinessIsValid(businessId: number, cardType: string) {
  const business = await businessRepository.findById(businessId);

  if (!business) throw errors.notFound("Business");

  if (cardType !== business.type) throw errors.unauthorized("Business type to the card");
}

async function findCardByDetails(cardData: any) {
  const { number, holderName, expirationDate } = cardData;

  const card = await cardRepository.findByCardDetails(number, holderName, expirationDate);

  if (!card) throw errors.notFound("Card");

  return card;
}