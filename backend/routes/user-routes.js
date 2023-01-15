import express from "express";

import {
  createUser,
  loginUser,
  updateUserPassword,
} from "../service/user-service.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.patch("/change-pass/:uid", updateUserPassword);

export default router;
