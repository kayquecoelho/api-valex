import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as errors from "../errors/errors.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function createCard(data: any) {
  const { cardType, employeeId } = data;

  validateCardType(cardType);
  const employee = await ensureEmployeeExists(employeeId);
  await ensureEmployeeHasNoCards(cardType, employeeId);

  const cardData = generateCardData(employee);
  await cardRepository.insert({ ...cardData, type: cardType, employeeId});
}

export async function activateCard(data:any) {
  const { cardId, password, securityCode} = data;
  const card = await ensureCardIsValid(cardId);

  verifySecurityCode(securityCode, card);

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newCard = {...card, isBlocked: false, password: hashedPassword};

  await cardRepository.update(cardId, newCard);
}

export async function getCardBalance(cardId: number) {
  await findCard(cardId);

  const balance = await calculateBalance(cardId);

  return balance;
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

async function ensureCardIsValid(cardId: number){
  const card = await findCard(cardId);

  const cardIsExpired = dayjs(card.expirationDate).isAfter(dayjs());

  if (cardIsExpired) throw errors.notAllowed();

  if(!card.isBlocked) throw errors.unauthorized("Card is active so");

  return card;
}

async function findCard(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) throw errors.notFound("Card");
  return card;
}

function verifySecurityCode(securityCode: string, card: cardRepository.Card) {
  const securityCodeIsValid = bcrypt.compareSync(securityCode, card.securityCode);
  if (!securityCodeIsValid) throw errors.unauthorized("Security Code");
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

async function ensureEmployeeHasNoCards(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const card = await cardRepository.findByTypeAndEmployeeId(type,employeeId);
  
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
  const securityCode = bcrypt.hashSync(cvv, 10);
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

function formatName(name: string) {
  const nameArr = name.split(" ").filter(n => n.length > 2 );

  if (nameArr.length < 3) return nameArr.join(" ").toUpperCase();

  const formattedName = nameArr.map((n, i) => {
    if (i !== 0 && i !== nameArr.length - 1) return n[0];
    return n;
  }).join(" ");
  
  return formattedName.toUpperCase();
}
