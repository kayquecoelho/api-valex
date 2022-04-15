import * as errors from "../errors/errors.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";

export async function createCard(data: any) {
  const { cardType, employeeId } = data;

  validateCardType(cardType);
  const employee = await ensureEmployeeExists(employeeId);
  await ensureEmployeeHasNoCards(cardType, employeeId);

  const cardData = generateCardData(employee);
  await cardRepository.insert({ ...cardData, type: cardType, employeeId});
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
