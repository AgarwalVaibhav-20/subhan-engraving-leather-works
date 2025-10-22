import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Transaction from "@/model/Transaction";
type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const transaction = await Transaction.findById(params.id);
    if (!transaction)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Transaction.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const deleted = await Transaction.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
