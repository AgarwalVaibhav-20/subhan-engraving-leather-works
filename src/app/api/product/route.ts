import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ProductModel } from "@/model/Product";

export const GET = async () => {
  await dbConnect();
  try {
    const product = await ProductModel.find();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
