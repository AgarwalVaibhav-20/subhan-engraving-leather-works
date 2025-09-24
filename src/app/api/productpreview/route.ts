import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ProductModel } from "@/model/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  await dbConnect();
  try {
    const product = await ProductModel.findOne({ productId: params.productId });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
