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

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data: userId and items are required" },
        { status: 400 }
      );
    }

    if (
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.zipcode
    ) {
      return NextResponse.json(
        { error: "Complete address is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (saveInfo) {
      const exists = user.addresses?.some(
        (a: any) =>
          a.street === address.street &&
          a.city === address.city &&
          a.zipcode === address.zipcode
      );
      if (!exists) {
        user.addresses = user.addresses || [];
        user.addresses.push({ ...address, country: address.country || "IN" });
        await user.save();
      }
    }

    // Create order
    const calculatedTotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await OrderModel.create({
      user: user._id,
      customerName: user.fullname,
      email: user.email,
      items: items.map((item: any) => ({
        id: new mongoose.Types.ObjectId(item.productId || item.id),
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
      totalAmount: totalAmount || calculatedTotal,
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
    const userId = searchParams.get("userId"); // optional → for user dashboards

    const query: any = {};
    if (userId) query.user = userId;

    // Fetch all orders (lean for performance) and populate if needed
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    // Initialize metrics
    const totalOrders = orders.length;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let totalRevenue = 0;
    let todayOrders = 0;
    let todayRevenue = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Aggregate metrics
    for (const order of orders) {
      const orderDate = new Date(order.createdAt);

      // Count by status
      if (order.status === "pending") pendingOrders++;
      else if (order.status === "completed") {
        completedOrders++;
        totalRevenue += order.totalAmount || 0;
      } else if (order.status === "cancelled") cancelledOrders++;

      // Count today's
      if (orderDate >= today) {
        todayOrders++;
        if (order.status === "completed")
          todayRevenue += order.totalAmount || 0;
      }
    }

    // 📊 Prepare response with stats AND orders
    return NextResponse.json(
      {
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
          todayOrders,
          todayRevenue,
        },
        orders, // Include the full order data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
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

// export async function GET(req: NextRequest) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     let orders;

//     if (userId) {
//       console.log("Fetching orders for userId:", userId);
//       orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
//     } else {
//       console.log("No userId provided, fetching ALL orders (admin)");
//       orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
//     }

//     console.log("Found orders:", orders.length);

//     return NextResponse.json({ orders, count: orders.length }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json(
//       {
//         error: "Server error: " + (error instanceof Error ? error.message : "Unknown error"),
//         orders: [],
//       },
//       { status: 500 }
//     );
//   }
// }

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
