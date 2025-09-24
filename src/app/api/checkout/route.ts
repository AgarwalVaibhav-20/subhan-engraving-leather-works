import { NextRequest, NextResponse } from "next/server";
import { CheckoutModel } from "@/model/Checkout";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();
    console.log("Incoming Order Data:", data);

    const newOrder = await CheckoutModel.create(data);
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error: any) {
    console.error("Checkout POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
