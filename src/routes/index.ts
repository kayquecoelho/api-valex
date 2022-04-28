import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import paymentsRouter from "./paymentsRouter.js";
import rechargesRouter from "./rechargesRouter.js";

const router = Router();

router.use("/cards", cardsRouter);
router.use("/recharges", rechargesRouter);
router.use("/payments", paymentsRouter);

export default router;