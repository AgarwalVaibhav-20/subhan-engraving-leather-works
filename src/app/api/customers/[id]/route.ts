import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

// GET a single user by ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const user = await UserModel.findById(params.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT - update user by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const data = await req.json();
    const updatedUser = await UserModel.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE - remove user by ID
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deletedUser = await UserModel.findByIdAndDelete(params.id);
    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
