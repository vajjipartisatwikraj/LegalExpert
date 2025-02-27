import express from 'express';
import { register, login, protect, restrictTo } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);

export default router;