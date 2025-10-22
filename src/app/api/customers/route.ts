import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

// GET all customers
export async function GET() {
  await dbConnect();
  try {
    const customers = await UserModel.find();
    console.log(customers , "customers")
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST - create new customer
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const newCustomer = await UserModel.create(data);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
