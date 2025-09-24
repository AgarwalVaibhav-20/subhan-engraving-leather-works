import mongoose, { Schema, Document, Types } from 'mongoose';
import { v4 as uuidv4 } from "uuid";
// Message Schema
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Comment Schema
export interface Comment extends Document {
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Review Schema
export interface Review extends Document {
  content: string;
  rating: number;
  reviewedAt: Date;
  comments: Types.DocumentArray<Comment>;
}

const ReviewSchema = new Schema<Review>({
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewedAt: { type: Date, default: Date.now },
  comments: [CommentSchema],
});

// User Schema
export interface User extends Document {
  fullname: string;
  email: string;
  password: string;
  customerID:string;
  address?:string;
  city?:string;
  state:string;
  zipcode?:string;
  profileImage?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isloggedIn:boolean;
  verifyCode?: string | null;
  verifyCodeExpiry?: Date | null;
  isAcceptingMessage: boolean;
  reviews: Types.DocumentArray<Review>;
  message: Types.DocumentArray<Message>;
}

const UserSchema: Schema<User> = new Schema({
   customerID: {
      type: String,
      default: () => `CUST-${uuidv4()}`,
    },
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: { type: String, required: true },
  address:{
    type:String
  },
  city:{type:String},
  state:{type:String},
  zipcode:{type:String},
  profileImage: { type: String, default: '/Aiavatar.jpeg' },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: { type: Boolean, default: false },
  isloggedIn:{ type: Boolean, default: false },
  verifyCode: { type: String, default: null },
  verifyCodeExpiry: { type: Date, default: null },
  isAcceptingMessage: { type: Boolean, default: true },
  reviews: [ReviewSchema],
  message: [MessageSchema],
});

// Models
export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const MessageModel = mongoose.models.Message || mongoose.model<Message>('Message', MessageSchema);
