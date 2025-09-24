import mongoose, { Schema, Document, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProduct extends Document {
  productID: string;
  name: string;
  description: string;
  aboutTheItems?: string[];
  price: number;
  discountPrice: number; // Changed from discountPercent
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
    productID: {
      type: String,
      default: () => `PROD-${uuidv4()}`,
    },
    name: {
      type: String,
      required: [true, "Please provide a product name!"],
      trim: true,
    },
    description: {
      type: String, // Changed from Schema.Types.Mixed
      required: [true, "Please provide a description!"],
      trim: true,
    },
    aboutTheItems: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price!"],
      min: [0, "Price cannot be negative!"],
    },
    discountPrice: {
      // Changed from discountPercent
      type: Number,
      min: [0, "Discount price cannot be negative!"],
      default: 0,
      validate: {
        validator: function (this: IProduct, value: number) {
          return value <= this.price;
        },
        message: "Discount price cannot exceed the original price!",
      },
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one image!"],
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: "At least one image is required!",
      },
    },
    category: {
      type: String,
      enum: {
        values: ["Rubber", "Metal", "Wood" , "Toys"],
        message: "{VALUE} is not a valid category!",
      },
      required: [true, "Please provide a category!"],
    },
    brand: {
      type: String,
      required: [true, "Please provide a brand!"],
      trim: true,
    },
    inStock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative!"],
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