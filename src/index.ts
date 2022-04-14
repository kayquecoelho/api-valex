import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("listening on" + port)
});