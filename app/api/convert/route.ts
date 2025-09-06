import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { 
        status: 400,
        headers 
      });
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { 
        status: 400,
        headers 
      });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to CMYK TIFF using Sharp
    const convertedBuffer = await sharp(buffer)
      .tiff({
        compression: 'lzw',
        quality: 100,
        predictor: 'horizontal'
      })
      .toColorspace('cmyk')
      .toBuffer();

    // Return the converted image
    return new NextResponse(convertedBuffer, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'image/tiff',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.[^/.]+$/, '')}_CMYK.tiff"`,
        'Content-Length': convertedBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Image conversion failed. Please try again.' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}