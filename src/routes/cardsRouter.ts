import { Router } from "express";
import * as cardsController from "../controllers/cardsController.js";
import { validateAPIToken } from "../middlewares/validateAPIToken.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemas from "../schemas/index.js";

const cardsRouter = Router();

cardsRouter.get("/cards/:id/balance", cardsController.getCardBalance);

cardsRouter.post(
  "/cards/physical",
  validateAPIToken,
  validateSchema(schemas.cardRequestSchema),
  cardsController.createCard
);

cardsRouter.post(
  "/cards/digital",
  validateSchema(schemas.digitalCardSchema),
  cardsController.createDigitalCard
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

cardsRouter.delete(
  "/cards/digital/:id",
  cardsController.deleteDigitalCard
)

export default cardsRouter;
