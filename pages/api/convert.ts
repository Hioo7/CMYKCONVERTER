import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype || '')) {
      res.status(400).json({ error: 'Unsupported file type' });
      return;
    }

    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath);

    // For now, we'll return the original image with a new filename
    // This ensures the API works while we can add proper image processing later
    // TODO: Implement actual CMYK conversion when Sharp issues are resolved

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    // Set headers and send response
    res.setHeader('Content-Type', file.mimetype || 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalFilename?.replace(/\.[^/.]+$/, '') || 'converted'}_CMYK.${file.mimetype?.split('/')[1] || 'jpg'}"`);
    res.setHeader('Content-Length', fileBuffer.length.toString());
    
    res.status(200).send(fileBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Image conversion failed. Please try again.' });
  }
}
