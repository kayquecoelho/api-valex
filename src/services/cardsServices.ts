import { faker } from '@faker-js/faker';
import dayjs from "dayjs";

import * as errors from "../errors/errors.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as bcryptService from "./bcryptService.js";

export async function createCard(data: any) {
  const { cardType, employeeId } = data;

  validateCardType(cardType);

  const employee = await ensureEmployeeExists(employeeId);

  await ensureEmployeeHasNoCards(cardType, employeeId);

  const cardData = generateCardData(employee);

  await cardRepository.insert({ ...cardData, type: cardType, employeeId});
}

export async function createDigitalCard(data: any) {
  const { cardId, password } = data;

  const card = await findCardById(cardId);

  await ensureHasNoDigitalCard(card);

  bcryptService.validateAccess(password, card.password);

  const digitalCardData = generateDigitalCard(card);

  await cardRepository.insert(digitalCardData);
}

export async function activateCard(data:any) {
  const { cardId, password, securityCode } = data;

  const card = await ensureCardIsValid(cardId, false);

  bcryptService.validateAccess(securityCode, card.securityCode);

  const hashedPassword = bcryptService.encrypt(password);

  await cardRepository.update(cardId, { isBlocked: false, password: hashedPassword });
}

export async function blockCard(data: any) {
  const { cardId, password } = data;

  const card = await ensureCardIsValid(cardId, true);

  bcryptService.validateAccess(password, card.password);

  await cardRepository.update(cardId, { isBlocked: true });
}

export async function getCardBalance(cardId: number) {
  await findCardById(cardId);

  const balance = await calculateBalance(cardId);

  return balance;
}

export async function deleteDigitalCard(cardId: number, password: string) {
  const card = await findCardById(cardId);

  if (!card.isVirtual) throw errors.unauthorized("Card is not virtual so");

  bcryptService.validateAccess(password, card.password);

  cardRepository.remove(card.id);
}

async function ensureHasNoDigitalCard(card: cardRepository.Card) {
  const digitalCard = await cardRepository.findDigitalById(card.id);

  if (digitalCard)
    throw errors.conflict("Digital card");
}

async function calculateBalance(cardId: number) {
  function calculateTotal(array: any[]) {
    return array.reduce((total, transaction) => total + transaction.amount, 0);
  }

  const payments = await paymentRepository.findByCardId(cardId);
  const paymentsAmount = calculateTotal(payments);

  const recharges = await rechargeRepository.findByCardId(cardId);
  const rechargesAmount = calculateTotal(recharges);

  return {
    balance: rechargesAmount - paymentsAmount,
    transactions: payments,
    recharges
  }
}

async function ensureCardIsValid(cardId: number, blockVerification: boolean){
  const card = await findCardById(cardId);

  const cardIsExpired = dayjs(card.expirationDate).isAfter(dayjs());

  if (cardIsExpired) throw errors.notAllowed();

  if (blockVerification) {
    if(card.isBlocked) throw errors.unauthorized("Card is blocked so");
  } else {
    if(!card.isBlocked) throw errors.unauthorized("Card is active so");
  }

  return card;
}

async function findCardById(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) throw errors.notFound("Card");

  return card;
}

async function ensureEmployeeHasNoCards(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
  
  if (card) throw errors.conflict(`Type of card to employee`);
}

async function ensureEmployeeExists(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);
  
  if (employee) return employee;

  throw errors.notFound("Employee");
}

function generateCardData(employee: employeeRepository.Employee) {
  const cvv = faker.finance.creditCardCVV();
  console.log(cvv);
  const creditCardNumber = faker.finance.creditCardNumber('mastercard');
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const securityCode = bcryptService.encrypt(cvv);
  const cardholderName = formatName(employee.fullName);

  return {
    number: creditCardNumber, 
    securityCode, 
    cardholderName,
    isVirtual: false,
    isBlocked: true,
    expirationDate
  }
}

function generateDigitalCard(card: cardRepository.Card) {
  const cvv = faker.finance.creditCardCVV();
  const securityCode = bcryptService.encrypt(cvv);

  const digitalCard = {
    number: faker.finance.creditCardNumber('mastercard'),
    password: card.password,
    securityCode,
    expirationDate: dayjs().add(5, "years").format("MM/YY"),
    isBlocked: false,
    isVirtual: true,
    originalCardId: card.id,
    type: card.type,
    cardholderName: card.cardholderName,
    employeeId: card.employeeId
  };
  
  return digitalCard;
}

function formatName(name: string) {
  const nameArr = name.split(" ").filter(n => n.length > 2 );

  if (nameArr.length < 3) return nameArr.join(" ").toUpperCase();

  const formattedName = nameArr.map((n, i) => {
    if (i !== 0 && i !== nameArr.length - 1) return n[0];
    return n;
  }).join(" ");
  
  return formattedName.toUpperCase();
}

function validateCardType(type: string) {
  const validTypes = [
    "groceries",
    "restaurant",
    "transport",
    "education",
    "health",
  ];

  if (!validTypes.includes(type))
    throw errors.unprocessableEntity(`CardType '${type}'`);
}
