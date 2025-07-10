import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        if(!credentials.email || !credentials.password){
          throw  new Error("Invalid credentials")
        }
        try {
          await dbConnect();
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first before login.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }

          return {
            _id: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
            role: user.role || "user",
          };
        } catch (error: any) {
          throw new Error(error.message || "Authorization failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.fullname = user.fullname;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.role = user.role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.fullname = token.fullname;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error:'/login'
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
