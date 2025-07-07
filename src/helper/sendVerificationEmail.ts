"use server";

import { render } from "@react-email/render";
import { VerificationEmail } from "../../emails/VerificationEmail";
import { mailer, mailOptions } from "@/lib/mailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  fullname: string,
  otp: string
): Promise<ApiResponse> {
  try {
    // ✅ Await this to get actual HTML string
    const emailHtml = await render(VerificationEmail({ fullname, otp }));

    await mailer.sendMail({
      to: email,
      from: mailOptions.from,
      subject: "Verify Your Email",
      html: emailHtml, // ✅ Now it's a string, not a Promise
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
