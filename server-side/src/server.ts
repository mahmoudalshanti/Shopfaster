import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import cartRouter from "./routes/cart";
import paymentRouter from "./routes/payment";
import analyticsRouter from "./routes/analytics";
import couponRouter from "./routes/coupon";
import orderRouter from "./routes/order";
import corsOptions from "./config/corsOptions";
import cors from "cors";
import path from "path";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/coupon", couponRouter);
app.use("/payment", paymentRouter);
app.use("/analytics", analyticsRouter);
app.use("/order", orderRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client-side/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client-side", "dist", "index.html"));
  });
}

mongoose.connection.once("open", () => {
  console.log("Access to DB Success");
  app.listen(PORT, () => console.log(`Server Runining on PORT ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
