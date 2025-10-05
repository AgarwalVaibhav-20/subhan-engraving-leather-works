import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order";

// ✅ UPDATE ORDER (PUT)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await OrderModel.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update only allowed fields
    const allowedUpdates = [
      "status",
      "paymentStatus",
      "address",
      "totalAmount",
      "items",
    ];

    for (const key of Object.keys(body)) {
      if (allowedUpdates.includes(key)) {
        (order as any)[key] = body[key];
      }
    }

    await order.save();

    return NextResponse.json(
      { message: "Order updated successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

// ✅ DELETE ORDER
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully", order: deletedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}
