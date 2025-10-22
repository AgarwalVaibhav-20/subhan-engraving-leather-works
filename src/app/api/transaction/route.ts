import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Transaction from "@/model/Transaction";

export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newTransaction = await Transaction.create(body);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
