import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ProductModel } from "@/model/Product";

// UPDATE PRODUCT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await req.json();

    const product = await ProductModel.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Only update allowed fields
    const allowedUpdates = [
      "name",
      "description",
      "aboutTheItems",
      "price",
      "discountPrice",
      "images",
      "category",
      "brand",
      "inStock",
      "isFeatured",
    ];

    for (const key of Object.keys(body)) {
      if (allowedUpdates.includes(key)) {
        (product as any)[key] = body[key];
      }
    }

    await product.save();
    return NextResponse.json(
      { message: "Product updated successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const deleted = await ProductModel.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Product deleted successfully", product: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.log(error , "deleting error")
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
