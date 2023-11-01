import express from "express";
const router = express.Router();

import { signup, login, verifyUser, requestPasswordReset, resetPassword } from "../controller/userController.js";


router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verifyUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;