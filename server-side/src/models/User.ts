import { Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserData extends Document {
  name: string;
  password: string;
  email: string;
  cartItems: {
    quantity: number;
    product: string;
  }[];

  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserData>(
  {
    name: { type: String, required: [true, "Name is Required"] },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true, // unique email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    cartItems: [
      {
        quantity: { type: Number, default: 1 },
        product: {
          type: String,
        },
      },
    ],

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    if (err instanceof Error) next(err);
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<UserData>("User", userSchema);

export default User;
