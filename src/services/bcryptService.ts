import bcrypt from "bcrypt";

import * as errors from "../errors/errors.js";

export function validateAccess(key: string, encryptedKey: string) {
  if (!bcrypt.compareSync(key, encryptedKey))
    throw errors.unauthorized("Key");
}

export function encrypt(key: string) {
  const hashedKey = bcrypt.hashSync(key, 10);
  return hashedKey;
}