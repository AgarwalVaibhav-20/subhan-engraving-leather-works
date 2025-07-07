import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { fullname, email, password } = await request.json();

         const role = email === "subhanleatherworks@gmail.com" ? "admin" : "user";
        //this is for checking user exisitng by verifiction.
        const exisitingUserByEmail = await UserModel.findOne({
            email
        });

        //OTP Generate
        const verifyCode = Math.floor(Math.random() * 900000).toString();

        if (exisitingUserByEmail) {
            if (exisitingUserByEmail.isVerified) {
                return Response.json({
                    sucess: false,
                    message: "user Already exist with this email"
                }, { status: 400 })
            }
            else {
                const hasedPassword = await bcrypt.hash(password, 10);
                exisitingUserByEmail.password = hasedPassword;
                exisitingUserByEmail.verifyCode = verifyCode;
                exisitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                exisitingUserByEmail.role = role;
                await exisitingUserByEmail.save()
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);

            const expiryData = new Date();
            expiryData.setHours(expiryData.getHours() + 1)
            console.log(expiryData.setHours(expiryData.getHours() + 1), "signup routes");


            //Creating new user
            const newUser = await new UserModel({
                fullname,
                email,
                password: hasedPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry: expiryData,
                isAcceptingMessage: true,
                message: [],
                role,
            })
            await newUser.save();
        }
        //send verificattion email
        const emailResponse = await sendVerificationEmail(email, fullname, verifyCode);

        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User Registered Succesfully , Please verify your Email."
        })
    } catch (error) {
        console.error("Error Regsitring User", error);
        return Response.json({ success: false, message: "error registering user" }, { status: 500 })
    }
}