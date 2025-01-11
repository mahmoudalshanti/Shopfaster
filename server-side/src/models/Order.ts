import { Schema, Types, model } from "mongoose";

interface OrderData extends Document {
  user: Schema.Types.ObjectId;
  products: {
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  stripeSessionId: string;
  status: "pending" | "shipped" | "delivered" | "canceled" | "processing";
  track: string;
}

const orderSchema = new Schema<OrderData>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "shipped", "delivered", "canceled", "processing"],
      default: "processing",
    },

    track: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = model<OrderData>("Order", orderSchema);

export default Order;
