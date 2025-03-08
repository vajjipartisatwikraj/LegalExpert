import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

// Initialize Google Translate with your credentials
const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
});

export const translateText = async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide both text and target language'
    });
  }

  try {
    const [translation] = await translate.translate(text, targetLanguage);

    res.status(200).json({
      status: 'success',
      data: {
        translatedText: translation,
        sourceLanguage: 'en',
        targetLanguage
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Translation service error. Please ensure Google Cloud credentials are properly configured.',
      error: error.message
    });
  }
};