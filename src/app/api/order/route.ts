// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; 
import { OrderModel } from "@/model/Order";
import { UserModel } from "@/model/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { 
      userId, 
      items, 
      address,
      customerInfo,
      totalAmount,
      paymentMethod,
      promoCode,
      discount,
      shipping,
      tax,
      subtotal,
      saveInfo
    } = body;

    // Validation
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data: userId and items are required" },
        { status: 400 }
      );
    }

    // Step 4: Enable address validation
    if (!address || !address.street || !address.city || !address.state || !address.zipcode) {
      return NextResponse.json(
        { error: "Complete address is required (street, city, state, zipcode)" },
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
      customerInfo: {
        email: customerInfo?.email || user.email,
        firstName: customerInfo?.firstName || "",
        lastName: customerInfo?.lastName || "",
        phone: customerInfo?.phone || user.phone || "",
        contactTime: customerInfo?.contactTime || "",
        specialInstructions: customerInfo?.specialInstructions || "",
      },
      totalAmount: totalAmount || subtotal,
      subtotal: subtotal || totalAmount,
      discount: discount || 0,
      shipping: shipping || 0,
      tax: tax || 0,
      promoCode: promoCode || null,
      paymentMethod: paymentMethod || "cod",
      status: "pending",
      paymentStatus: "unpaid",
    });

    await newOrder.populate("user", "fullname email phone");

    return NextResponse.json(
      { 
        message: "Order created successfully", 
        order: newOrder,
        orderId: newOrder._id // Crucial for the frontend confirmation
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

// GET /api/orders?userId=xxx  -> fetch orders for a customer
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const orders = await OrderModel.find({ user: userId })
      .populate("user", "fullname email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders, count: orders.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
