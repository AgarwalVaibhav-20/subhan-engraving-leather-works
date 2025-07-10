// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import formidable, { File } from 'formidable';
import { mkdir, stat } from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), '/tmp');

export const config = {
  api: {
    bodyParser: false,
  },
};

async function ensureUploadDir() {
  try {
    await stat(uploadDir);
  } catch (e) {
    await mkdir(uploadDir, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  await ensureUploadDir();

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  const { files, fields } = await new Promise<{ files: formidable.Files; fields: formidable.Fields }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const uploadedImages: string[] = [];
  const fileArray = Array.isArray(files.images) ? files.images : [files.images];

  for (const file of fileArray) {
    const uploaded = await cloudinary.uploader.upload((file as File).filepath, {
      folder: 'products',
    });
    uploadedImages.push(uploaded.secure_url);
  }

  const product = JSON.parse(fields.product);

  return NextResponse.json({
    message: 'Product uploaded!',
    images: uploadedImages,
    product,
  });
}
