import express from 'express';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize Google Cloud Translation
const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) : undefined
});

router.post('/translate', authMiddleware, async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        status: 'error',
        message: 'Text and target language are required'
      });
    }

    const [translation] = await translate.translate(text, targetLanguage);

    return res.json({
      status: 'success',
      data: {
        translatedText: translation
      }
    });
  } catch (error) {
    console.error('Translation Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Translation service error'
    });
  }
});

export default router;