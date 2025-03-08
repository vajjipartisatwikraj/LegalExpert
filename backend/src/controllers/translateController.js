const translate = require('@vitalets/google-translate-api');

exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        status: 'error',
        message: 'Text and target language are required'
      });
    }

    const result = await translate(text, { to: targetLanguage });

    res.json({
      status: 'success',
      data: {
        translatedText: result.text
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Translation failed'
    });
  }
};