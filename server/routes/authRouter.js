import express, { Router } from 'express';
import { login, logout, register, verifyOTP } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post("/register", register);
router.post("/verify-opt", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

export default router;
