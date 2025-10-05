// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order";
import { UserModel } from "@/model/User";
import mongoose from "mongoose";

// CREATE ORDER
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, items, address, totalAmount, saveInfo } = body;

    // Validation
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data: userId and items are required" },
        { status: 400 }
      );
    }

    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipcode
    ) {
      return NextResponse.json(
        {
          error: "Complete address is required (street, city, state, zipcode)",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save address to user profile if saveInfo = true
    if (saveInfo) {
      const addressExists = user.addresses?.some(
        (addr: any) =>
          addr.street === address.street &&
          addr.city === address.city &&
          addr.zipcode === address.zipcode
      );

      if (!addressExists) {
        user.addresses = user.addresses || [];
        user.addresses.push({
          street: address.street,
          apartment: address.apartment || "",
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          country: address.country || "IN",
        });
        await user.save();
      }
    }

    // Create order
    const newOrder = await OrderModel.create({
      user: user._id,
      customerName: user.fullname,
      email: user.email,
      items: items.map((item: any) => ({
        id: new mongoose.Types.ObjectId(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      address: {
        street: address.street,
        apartment: address.apartment || "",
        city: address.city,
        state: address.state,
        zipcode: address.zipcode,
        country: address.country || "IN",
      },
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: newOrder,
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error:
          "Server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let orders;

    if (userId) {
      console.log("Fetching orders for userId:", userId);
      orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
    } else {
      console.log("No userId provided, fetching ALL orders (admin)");
      orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    }

    console.log("Found orders:", orders.length);

    return NextResponse.json({ orders, count: orders.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        error: "Server error: " + (error instanceof Error ? error.message : "Unknown error"),
        orders: [],
      },
      { status: 500 }
    );
  }
}

// ✅ UPDATE ORDER (PUT)
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();

//   try {
//     const { id } = params;
//     const body = await req.json();

//     if (!id) {
//       return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
//     }

//     const order = await OrderModel.findById(id);
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     // Update only allowed fields
//     const allowedUpdates = [
//       "status",
//       "paymentStatus",
//       "address",
//       "totalAmount",
//       "items",
//     ];

//     for (const key of Object.keys(body)) {
//       if (allowedUpdates.includes(key)) {
//         (order as any)[key] = body[key];
//       }
//     }

//     await order.save();

//     return NextResponse.json(
//       { message: "Order updated successfully", order },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating order:", error);
//     return NextResponse.json(
//       { error: "Server error: " + (error instanceof Error ? error.message : "Unknown error") },
//       { status: 500 }
//     );
//   }
// }

// // ✅ DELETE ORDER (DELETE)
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();

//   try {
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
//     }

//     const deletedOrder = await OrderModel.findByIdAndDelete(id);

//     if (!deletedOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Order deleted successfully", order: deletedOrder },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting order:", error);
//     return NextResponse.json(
//       { error: "Server error: " + (error instanceof Error ? error.message : "Unknown error") },
//       { status: 500 }
//     );
//   }
// }