// pages/api/analyze.js
import formidable from 'formidable';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.document) ? files.document[0] : files.document;
    const fileName = Array.isArray(fields.fileName) ? fields.fileName[0] : fields.fileName;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let documentContent = '';
    let documentType = 'unknown';

    // Handle different file types
    if (file.mimetype === 'application/pdf') {
      // Extract text from PDF
      try {
        const dataBuffer = await fs.readFile(file.filepath);
        const pdfData = await pdfParse(dataBuffer);
        documentContent = pdfData.text;
        documentType = 'pdf';
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        documentContent = `PDF file: ${fileName}. Unable to extract text content.`;
      }
    } else if (file.mimetype.startsWith('image/')) {
      // For images, we'll send the base64 data
      const dataBuffer = await fs.readFile(file.filepath);
      documentContent = dataBuffer.toString('base64');
      documentType = 'image';
    } else {
      // For text files
      documentContent = await fs.readFile(file.filepath, 'utf-8');
      documentType = 'text';
    }

    // Prepare the prompt
    const prompt = `You are analyzing an Italian property document. Please analyze this document and provide:

1. Document Type: Identify what type of property document this is (e.g., Cadastral Record, Energy Certificate, Title Deed, Building Permit, etc.)
2. Extracted Data: Extract all key information from the document
3. Issues: Identify any compliance issues, expired dates, or concerns
4. Recommendations: Provide actionable recommendations

Document Name: ${fileName}
${documentType === 'pdf' ? `\nExtracted Text Content:\n${documentContent}` : ''}

Respond in JSON format like this:
{
  "documentType": "Type of document",
  "extractedData": {
    "key1": "value1",
    "key2": "value2"
  },
  "issues": ["issue1", "issue2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [{
          role: 'user',
          content: documentType === 'image' ? [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: file.mimetype,
                data: documentContent
              }
            }
          ] : prompt
        }],
        max_tokens: 2000
      })
    });

    if (!anthropicResponse.ok) {
      const error = await anthropicResponse.json();
      console.error('Anthropic API error:', error);
      return res.status(500).json({ 
        error: 'Failed to analyze document', 
        details: error.error?.message || 'Unknown error' 
      });
    }

    const data = await anthropicResponse.json();
    const content = data.content[0].text;

    // Try to parse as JSON, fallback to raw content
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      analysis = {
        documentType: 'Analysis Complete',
        extractedData: {
          analysis: content
        },
        issues: [],
        recommendations: ['Please review the analysis above']
      };
    }

    // Clean up temporary file
    await fs.unlink(file.filepath);

    return res.status(200).json({
      success: true,
      analysis: analysis,
      fileName: fileName,
      fileType: file.mimetype
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}
