import mongoose, { Schema, Document, models } from "mongoose";

export interface IProduct {
  name: string;
  qty: number;
  price: number;
}

export interface ITransaction extends Document {
  customerName: string;
  email: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  items: number;
  paymentMethod: "Cash" | "Online";
  address: string;
  products: IProduct[];
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const TransactionSchema = new Schema<ITransaction>(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    items: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    //   required: true,
    },
    address: { type: String, required: true },
    products: { type: [ProductSchema], default: [] },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
