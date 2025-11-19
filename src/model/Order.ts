import mongoose, { Schema, Document, Types } from "mongoose";

export interface OrderItem {
  id: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true},
  },
  { _id: false }
);

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

const OrderAddressSchema = new Schema<OrderAddress>(
  {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipcode: { type: String, required: false },
    country: { type: String, required: false },
  },
  { _id: false }
);

export interface Order extends Document {
  user: Types.ObjectId;
  customerName: string;
  email: string;
  items: OrderItem[];
  address: OrderAddress;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentMethod?: "Cash" | "card" | "upi" | "bank";
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: OrderAddressSchema, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "card", "upi", "bank"],
      default: "Cash",
    },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// Index for faster analytics queries
OrderSchema.index({ createdAt: 1 });
OrderSchema.index({ status: 1 });

export const OrderModel =
  mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);


// // models/Order.ts
// import mongoose, { Schema, Document, Types } from "mongoose";

// export interface OrderItem {
//   id: Types.ObjectId;
//   name: string;
//   price: number;
//   quantity: number;
// }

// const OrderItemSchema = new Schema<OrderItem>(
//   {
//     id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true, min: 1 },
//   },
//   { _id: false }
// );

// export interface OrderAddress {
//   street: string;
//   city: string;
//   state: string;
//   zipcode: string;
//   country: string;
// }

// const OrderAddressSchema = new Schema<OrderAddress>(
//   {
//     street: { type: String, required: false },
//     city: { type: String, required: false },
//     state: { type: String, required: false },
//     zipcode: { type: String, required: false },
//     country: { type: String, required: false },
//   },
//   { _id: false }
// );

// export interface Order extends Document {
//   user: Types.ObjectId;
//   customerName: string;
//   email:string;
//   items: OrderItem[];
//   address: OrderAddress;
//   totalAmount: number;
//   status: "pending" | "processing" | "completed" | "cancelled";
//   paymentStatus: "unpaid" | "paid" | "refunded";
//   createdAt: Date;
//   updatedAt: Date;
// }

// const OrderSchema = new Schema<Order>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     items: { type: [OrderItemSchema], required: true },
//     customerName: { type: String, required: true },
//     email:{type:String , required:true},
//     address: { type: OrderAddressSchema, required: true }, // snapshot saved here
//     totalAmount: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "processing", "completed", "cancelled"],
//       default: "pending",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["unpaid", "paid", "refunded"],
//       default: "unpaid",
//     },
//   },
//   { timestamps: true }
// );

// export const OrderModel =
//   mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);
