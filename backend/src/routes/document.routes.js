import express from 'express';
import { createDocument, updateDocument, getUserDocuments, generatePDF, improveDocument } from '../controllers/document.controller.js';
import { protect } from '../controllers/auth.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Document routes
router.post('/', createDocument);
router.route('/:documentId')
  .put(updateDocument)
  .patch(updateDocument);
router.get('/', getUserDocuments);
router.get('/:documentId/pdf', generatePDF);
router.post('/:documentId/improve', improveDocument);

export default router;