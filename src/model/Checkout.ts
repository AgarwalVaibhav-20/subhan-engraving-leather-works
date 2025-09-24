
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICheckout extends Document {
  userId: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullname: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  createdAt?: Date;
}

const CheckoutSchema: Schema = new Schema<ICheckout>(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref:"Product",required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullname: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const CheckoutModel =
  models.Checkout || model<ICheckout>("Checkout", CheckoutSchema);
