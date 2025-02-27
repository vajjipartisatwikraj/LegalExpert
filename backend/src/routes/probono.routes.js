import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import {
  getProBonoLawyers,
  getProBonoLawyerById,
  createProBonoLawyer,
  updateProBonoLawyer,
  deleteProBonoLawyer,
  rateLawyer
} from '../controllers/probono.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getProBonoLawyers)
  .post(createProBonoLawyer);

router
  .route('/:id')
  .get(getProBonoLawyerById)
  .put(updateProBonoLawyer)
  .delete(deleteProBonoLawyer);

router.post('/:id/rate', rateLawyer);

export default router;