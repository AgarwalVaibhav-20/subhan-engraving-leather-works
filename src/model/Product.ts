import mongoose, { Schema, Document, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  inStock: number;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name!"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description!"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price!"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one image!"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category!"],
    },
    brand: {
      type: String,
      required: [true, "Please provide a brand!"],
    },
    inStock: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models.Product || model<IProduct>("Product", productSchema);
