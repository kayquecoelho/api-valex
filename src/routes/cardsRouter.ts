import { Router } from "express";
import { createCard } from "../controllers/cardsController.js";
import { validateAPIToken } from "../middlewares/validateAPIToken.js";
import validateSchema from "../middlewares/validateSchema.js";
import cardRequestSchema from "../schemas/cardRequestSchema.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateAPIToken, validateSchema(cardRequestSchema), createCard);

export default cardsRouter;