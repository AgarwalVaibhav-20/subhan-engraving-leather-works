import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  try {
    const getData = await UserModel.find();
    return NextResponse.json(getData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 } // ✅ handle the error with a 500 status code
    );
  }
};
