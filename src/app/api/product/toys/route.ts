import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ProductModel } from "@/model/Product";

export const GET = async () => {
  try {
    await dbConnect();

    const products = await ProductModel.find({ category: "Toys" }).lean();

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
