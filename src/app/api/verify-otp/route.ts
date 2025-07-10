import { NextResponse } from 'next/server';
import { UserModel } from '@/model/User';
import dbConnect from '@/lib/dbConnect';
export async function POST(req: Request) {
  try {
    const { email, otp  } = await req.json();
    console.log(email+"=" + otp)
    
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await dbConnect();
    const user = await UserModel.findOne({ email });
    console.log(user)
    console.log(user.isVerified)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.verifyCode !== otp || new Date(user.verifyCodeExpiry) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyCode= null;
    user.verifyCodeExpiry = null;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
