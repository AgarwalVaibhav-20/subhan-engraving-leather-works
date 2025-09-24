import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { ProductModel } from "@/model/Product";
import dbConnect from "@/lib/dbConnect";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const inStock = parseInt(formData.get("inStock") as string);
    const discountPrice = parseInt(formData.get('discountPrice') as string)
    const aboutTheItems = formData.getAll("aboutTheItem") as string[]
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand || 
      !aboutTheItems ||
      !discountPrice ||
      isNaN(inStock)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];

    for (const file of files.slice(0, 4)) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are allowed" },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image too large (max 5MB)" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "subhan_engraving_leather_works" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        Readable.from(buffer).pipe(uploadStream);
      });

      imageUrls.push(uploaded.secure_url);
    }

    const newProduct = new ProductModel({
      name,
      description,
      price,
      category,
      brand,
      inStock,
      aboutTheItems,
      discountPrice, 
      images: imageUrls,
    });

    const saved = await newProduct.save();

    return NextResponse.json(
      { success: true, product: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Upload failed" },
      { status: 500 }
    );
  }
}
