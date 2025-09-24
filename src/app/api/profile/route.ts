import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // adjust path if needed

// ✅ GET: Fetch user by session OR query param
export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const email = req.nextUrl.searchParams.get("email");

    let userEmail = email;

    // If no query param, fallback to session
    if (!userEmail) {
      const session = await getServerSession(authOptions);
      userEmail = session?.user?.email || null;
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET User error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// ✅ PATCH: Update user profile
export const PATCH = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body: {
      fullname?: string;
      email?: string;
      phonenumber?: string;
      address?: string;
      city?: string;
      state?: string;
      profileImage?: string;
    } = await req.json();

    let { email } = body;

    // If email not in body, fallback to session
    if (!email) {
      const session = await getServerSession(authOptions);
      email = session?.user?.email || null;
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { ...body },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
