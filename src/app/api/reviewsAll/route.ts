import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const users = await UserModel.find().select("fullname profileImage reviews");

    const allReviews = users.flatMap((user) =>
      user.reviews.map((review) => ({
        name: user.fullname,
        avatar: user.profileImage || "https://github.com/shadcn.png",
        comment: review.content,
        rating: review.rating,
        date: review.reviewedAt.toISOString().split("T")[0],
        reviewCount: user.reviews.length,
      }))
    );

    return NextResponse.json(allReviews);
  } catch (error) {
    console.error("[REVIEW_ALL]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
