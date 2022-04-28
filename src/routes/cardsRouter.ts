import { Router } from "express";
import * as cardsController from "../controllers/cardsController.js";
import { validateAPIToken } from "../middlewares/validateAPIToken.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemas from "../schemas/index.js";

const cardsRouter = Router();

cardsRouter.get("/:id/balance", cardsController.getCardBalance);

cardsRouter.post(
  "/physical",
  validateAPIToken,
  validateSchema(schemas.cardRequestSchema),
  cardsController.createCard
);

cardsRouter.post(
  "/digital",
  validateSchema(schemas.digitalCardSchema),
  cardsController.createDigitalCard
);

cardsRouter.patch(
  "/:id/activate",
  validateSchema(schemas.activateCardSchema),
  cardsController.activateCard
);

cardsRouter.patch(
  "/:id/block",
  validateSchema(schemas.blockCardSchema),
  cardsController.blockCard
);

cardsRouter.delete(
  "/:id",
  cardsController.deleteDigitalCard
)

export default cardsRouter;
