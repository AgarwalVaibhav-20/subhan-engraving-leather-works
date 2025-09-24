// app/api/review/route.ts

import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { comment, rating, _id } = await req.json();

    if (!comment || !rating || !_id) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await UserModel.findById(_id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newReview = {
      content: comment,
      rating,
      reviewedAt: new Date(),
      comments: [],
    };

    user.reviews.unshift(newReview);
    await user.save();

    const latest = user.reviews[0];

    return NextResponse.json({
      name: user.fullname,
      avatar: user.profileImage || "https://github.com/shadcn.png",
      reviewCount: user.reviews.length,
      comment: latest.content,
      rating: latest.rating,
      date: latest.reviewedAt.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("[REVIEW_POST]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
