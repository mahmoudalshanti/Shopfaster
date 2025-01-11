import { Schema, model } from "mongoose";

export interface ProductData extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
}
const productSchema = new Schema<ProductData>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = model<ProductData>("Product", productSchema);

export default Product;
