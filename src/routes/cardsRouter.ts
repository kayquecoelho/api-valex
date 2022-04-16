import { Router } from "express";
import * as cardsController from "../controllers/cardsController.js";
import { validateAPIToken } from "../middlewares/validateAPIToken.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemas from "../schemas/index.js";

const cardsRouter = Router();

cardsRouter.get("/cards/:id/balance", cardsController.getCardBalance);

cardsRouter.post(
  "/cards",
  validateAPIToken,
  validateSchema(schemas.cardRequestSchema),
  cardsController.createCard
);

cardsRouter.patch(
  "/cards/:id/activate",
  validateSchema(schemas.activateCardSchema),
  cardsController.activateCard
);

cardsRouter.patch(
  "/cards/:id/block",
  validateSchema(schemas.blockCardSchema),
  cardsController.blockCard
);

export default cardsRouter;
