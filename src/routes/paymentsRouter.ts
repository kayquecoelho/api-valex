import { Router } from "express";
import { insertPayment } from "../controllers/paymentsController.js";
import validateSchema from "../middlewares/validateSchema.js";
import schemas from "../schemas/index.js";

const paymentsRouter = Router();

paymentsRouter.post(
  "/payments",
  validateSchema(schemas.paymentSchema),
  insertPayment
);

export default paymentsRouter;
