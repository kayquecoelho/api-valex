import { unauthorized } from "../errors/errors.js";
import * as companyRepository from "../repositories/companyRepository.js";

export async function validateApiToken(token: string) {
  const company = await companyRepository.findByApiKey(token);

  if (company) return company;

  throw unauthorized("APIKey");
}