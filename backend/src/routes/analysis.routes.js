import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import {
  createAnalysis,
  getAnalysisById,
  getUserAnalyses
} from '../controllers/analysis.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .post(createAnalysis)
  .get(getUserAnalyses);

router.get('/:id', getAnalysisById);

export default router;