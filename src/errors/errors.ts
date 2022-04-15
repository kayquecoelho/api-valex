export function unprocessableEntity(entity: string) {
  return { type: "error_unprocessable_entity", message: `${entity} is not valid! `};
}

export function unauthorized(entity: string) {
  return { type: "error_unauthorized", message: `${entity} is not valid`};
}

export function notFound(entity: string) {
  return { type: "error_not_found", message: `${entity} was not found! Check your data.`};
}

export function conflict(entity: string) {
  return { type: "error_conflict", message: `${entity} already exists!`};
}
export function notAllowed() {
  return { type: "error_not_allowed", message: `Card is expired!`};
}