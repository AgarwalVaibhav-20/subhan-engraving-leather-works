import mongoose, { Schema, Document, Types } from 'mongoose';
// Message Interface and Schema
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// User Interface and Schema
export interface User extends Document {
  fullname: string;
  email: string;
  password: string;
  role:string;
  isVerified:boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  message: Types.DocumentArray<Message>;
}

const UserSchema: Schema<User> = new Schema({
  fullname: {
    type: String,
    required: [true, 'Full Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match:[/.+\@.+\..+/, "Please use valid email address"],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
   role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: false, // ✅ optional now
    default: null,
  },
  verifyCodeExpiry: {
    type: Date,
    required: false, // ✅ optional now
    default: null,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  message: [MessageSchema],
});

// Export Models
export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const MessageModel = mongoose.models.Message || mongoose.model<Message>('Message', MessageSchema);
