import express from "express";
import {
  createPosition,
  getAllPositions,
} from "../service/position-service.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create", createPosition);
router.get("/all", isAuthenticated, getAllPositions);

export default router;
