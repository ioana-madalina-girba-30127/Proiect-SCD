import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user-routes.js";
import positionRoutes from "./routes/position.routes.js";
import cors from "cors";

import { config } from "dotenv";

mongoose
  .connect(
    "mongodb+srv://leibiuc:leibiuc12345@cluster0.9i4n5ci.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database (0_0)");
  })
  .catch((err) => {
    console.log("Connection failed"), console.log(err);
  });
config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/position", positionRoutes);

app.listen(8080, () => {
  console.log("Running on", 8080, process.env.ACCESS_TOKEN_SECRET);
});
