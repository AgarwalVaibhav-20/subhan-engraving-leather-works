// /helper/verifyOtp.ts
import { UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";

export async function verifyOtp(email: string, code: string): Promise<ApiResponse> {
  try {
    await dbConnect();

    const user = await UserModel.findOne({ email });
    console.log(user)

    if (!user) {
      return { success: false, message: "User not found." };
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeValid) {
      return { success: false, message: "Incorrect verification code." };
    }

    if (!isCodeNotExpired) {
      return {
        success: false,
        message: "Verification code expired. Please sign up again to receive a new code.",
      };
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    await user.save();

    return {
      success: true,
      message: "Account verified successfully.",
    };
  } catch (error) {
    console.error("verifyOtp helper error:", error);
    return {
      success: false,
      message: "Internal server error during verification.",
    };
  }
}
