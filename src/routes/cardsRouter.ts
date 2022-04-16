import { Router } from "express";
import { activateCard, createCard, getCardBalance } from "../controllers/cardsController.js";
import { validateAPIToken } from "../middlewares/validateAPIToken.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemas from "../schemas/index.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateAPIToken, validateSchema(schemas.cardRequestSchema), createCard);
cardsRouter.post("/cards/activate", validateSchema(schemas.activateCardSchema), activateCard);
cardsRouter.post("/cards/:id/balance", getCardBalance);

export default cardsRouter;