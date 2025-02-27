import axios from 'axios';
import PDFDocument from 'pdfkit';
import Document from '../models/document.model.js';

// Create new document
export const createDocument = async (req, res) => {
  try {
    const { title, type, description, legalDomain, chatId } = req.body;

    // Verify Mistral API key
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('Mistral API key is not configured');
    }

    // Generate document content using MistralAI API
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: `You are a legal document expert. Generate a professional ${type} based on the following description.`
          },
          {
            role: 'user',
            content: description
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral AI API');
    }

    const generatedContent = response.data.choices[0].message.content;

    const document = await Document.create({
      user: req.user._id,
      title,
      type,
      content: generatedContent,
      description,
      legalDomain,
      chat: chatId
    });

    res.status(201).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content, status } = req.body;

    const document = await Document.findById(documentId);
    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.content = content || document.content;
    document.status = status || document.status;
    document.version += 1;
    await document.save();

    res.status(200).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get user's documents
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .populate('chat', 'title')
      .sort('-updatedAt');

    res.status(200).json({
      status: 'success',
      data: { documents }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Generate PDF
export const generatePDF = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Create PDF with better formatting options
    const pdf = new PDFDocument({
      margins: {
        top: 72,    // 1 inch top margin
        bottom: 72, // 1 inch bottom margin
        left: 72,   // 1 inch left margin
        right: 72   // 1 inch right margin
      },
      size: 'letter', // Use standard letter size
      bufferPages: true // Enable buffering of pages for page numbers
    });

    // Set up response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${document.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

    // Pipe the PDF directly to the response
    pdf.pipe(res);

    // Format document content
    const formattedContent = document.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML spaces
      .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
      .trim();

    // Set default font and size
    pdf.font('Times-Roman');
    pdf.fontSize(12);

    // Add header with proper spacing
    pdf.font('Times-Bold')
      .fontSize(12)
      .text(new Date().toLocaleDateString(), { align: 'right' })
      .moveDown(2);

    // Add sender's information
    pdf.font('Times-Roman')
      .text('[Your Name]')
      .text('[Your Address]')
      .text('[City, State, Zip Code]')
      .text('[Email Address]')
      .text('[Phone Number]')
      .moveDown(2);

    // Add recipient's information
    pdf.text('[Recipient\'s Name]')
      .text('[Recipient\'s Address]')
      .text('[City, State, Zip Code]')
      .moveDown(2);

    // Add subject line
    pdf.font('Times-Bold')
      .text(`Subject: ${document.title}`)
      .moveDown(2);

    // Add salutation
    pdf.font('Times-Roman')
      .text('Dear [Recipient\'s Name],')
      .moveDown(1);

    // Add main content with proper formatting
    pdf.font('Times-Roman')
      .text(formattedContent, {
        align: 'left',
        lineGap: 7,      // Increase line spacing
        paragraphGap: 14, // Add space between paragraphs
        indent: 36       // Half-inch paragraph indentation
      })
      .moveDown(2);

    // Add closing
    pdf.text('Sincerely,')
      .moveDown(3)
      .text('[Your Name]')
      .text('[Your Signature]')
      .moveDown(1);

    // Add CC if applicable
    pdf.font('Times-Italic')
      .text('cc: [Any relevant parties]');

    // Add page numbers
    const pageCount = pdf.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      pdf.switchToPage(i);
      pdf.fontSize(10)
        .text(
          `Page ${i + 1} of ${pageCount}`,
          pdf.page.margins.left,
          pdf.page.height - 50,
          { align: 'center' }
        );
    }

    pdf.end();
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Improve document using AI
export const improveDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { instructions } = req.body;

    const document = await Document.findById(documentId);
    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Get AI suggestions using MistralAI API
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document expert. Improve the following document based on the provided instructions.'
          },
          {
            role: 'user',
            content: `Document: ${document.content}\n\nInstructions: ${instructions}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral AI API');
    }

    const improvedContent = response.data.choices[0].message.content;

    document.content = improvedContent;
    document.version += 1;
    await document.save();

    res.status(200).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};