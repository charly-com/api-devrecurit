import express from "express";
const router = express.Router();

import { signup, login, verifyUser, requestPasswordReset, resetPassword,refreshToken } from "../controller/userController.js";


router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verifyUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

export default router;