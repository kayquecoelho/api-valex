import { Router } from "express";
import { insertRecharge } from "../controllers/rechargesController.js";
import { validateAPIToken } from "../middlewares/validateAPIToken.js";
import validateSchema from "../middlewares/validateSchema.js";
import rechargesSchema from "../schemas/rechargesSchema.js";

const rechargesRouter = Router();

rechargesRouter.post(
  "/recharges",
  validateAPIToken,
  validateSchema(rechargesSchema),
  insertRecharge
);

export default rechargesRouter;
