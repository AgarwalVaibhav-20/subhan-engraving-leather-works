import { NextResponse } from 'next/server';
import { UserModel } from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { mailer, mailOptions } from '@/lib/mailer';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Generate a new verification code and expiry date
    const newVerifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newVerifyCodeExpiry = new Date();
    newVerifyCodeExpiry.setHours(newVerifyCodeExpiry.getHours() + 1); // 1 hour expiry

    // Update user's verification code and expiry
    user.verifyCode = newVerifyCode;
    user.verifyCodeExpiry = newVerifyCodeExpiry;
    await user.save();

    // Send the verification email
    try {
      await mailer.sendMail({
        ...mailOptions,
        to: email,
        subject: 'Your Verification Code',
        html: `<p>Your new verification code is: <strong>${newVerifyCode}</strong></p>`,
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'New verification code sent to your email.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error resending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Error resending OTP.' },
      { status: 500 }
    );
  }
}