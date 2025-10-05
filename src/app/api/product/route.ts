import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ProductModel } from "@/model/Product";

// GET ALL PRODUCTS
export async function GET() {
  await dbConnect();
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// CREATE NEW PRODUCT
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newProduct = await ProductModel.create(body);
    return NextResponse.json({ message: "Product created successfully", product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
