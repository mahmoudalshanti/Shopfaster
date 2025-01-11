import { Request, Response } from "express";
import { ProductData } from "../models/Product";
import Coupon, { CouponData } from "../models/Coupon";
import { stripe } from "../lib/stripe";
import Order from "../models/Order";

interface ProductPaymnet extends ProductData {
  quantity: number;
  id: string;
}

interface Payment {
  createCheckoutSession: (
    request: Request<{}, {}, { products: ProductPaymnet; couponCode: number }>,
    response: Response
  ) => Promise<Response>;
  checkoutSuccess: (request: Request, response: Response) => Promise<Response>;
}

// create checkout session for stripe
export const createCheckoutSession: Payment["createCheckoutSession"] = async (
  request: Request<{}, {}, { products: ProductPaymnet; couponCode: number }>,
  response: Response
): Promise<Response> => {
  try {
    const { products, couponCode } = request.body; // coming data the products and discount code
    console.log(products, couponCode, "SSS");

    // check if user send products is array and not empty
    if (!Array.isArray(products) || products.length === 0)
      return response
        .status(400)
        .json({ message: "Invalid type or no products" });

    let totalAmount: number = 0;

    // declare lineItems array to store the products for stripe line items {price_data :{currency , product_data :{name , images} , unit_amount}, quantity}
    const lineItems = products.map((product: ProductPaymnet) => {
      const amount = Math.round(product.price * 100); // stripe accept cents so want price * 100
      totalAmount += amount * product.quantity || 1; // total amount of all products

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name, // show product name in stripe checkout page
            images: [product.image], // show product image in stripe checkout page
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: request.user?._id,
      });
      if (coupon) {
        totalAmount -= Math.round(
          totalAmount * (coupon.discountPercentage / 100)
        );
        // here not deactivate coupon because we need to check if user paid or not
      }
    }
    console.log(totalAmount);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon // add coupon  in discount stripe to show in stripe checkout page and dashboard features
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],

      metadata: {
        // we use metadata in order
        userId: request.user?._id?.toString() ?? "",
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });
    if (totalAmount >= 20000) {
      await createNewCoupon(request.user?._id);
    }
    return response
      .status(200) //////////// // convert from cents to dollars,
      .json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    return response.status(500).json({ message });
  }
};

export const checkoutSuccess = async (request: Request, response: Response) => {
  try {
    const { sessionId } = request.body;

    // Validate sessionId
    if (!sessionId) {
      return response.status(400).json({ message: "Session ID is required." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the order already exists based on stripeSessionId
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return response.status(200).json({
        success: true,
        message: "Order already exists.",
        orderId: existingOrder._id,
        track: existingOrder.track,
      });
    }

    // Proceed if the session payment is successful
    if (session.payment_status === "paid") {
      // Deactivate coupon if applicable
      if (session.metadata?.couponCode && session.metadata?.userId) {
        try {
          await Coupon.findOneAndUpdate(
            {
              code: session.metadata.couponCode,
              userId: session.metadata.userId,
            },
            { isActive: false }
          );
        } catch (err) {
          console.error("Failed to deactivate coupon:", err);
          return response
            .status(500)
            .json({ message: "Failed to deactivate coupon." });
        }
      }
    }

    // Parse products metadata
    let products = [];
    try {
      products = JSON.parse(session.metadata?.products ?? "[]");
    } catch (err) {
      console.error("Failed to parse products metadata:", err);
      return response
        .status(400)
        .json({ message: "Invalid product metadata." });
    }

    // Create new order
    const newOrder = new Order({
      user: session.metadata?.userId,
      products: products.map((product: ProductPaymnet) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: (session.amount_total ?? 0) / 100,
      stripeSessionId: sessionId,
      track: generateOrderNumber(),
      status: "pending",
    });
    console.log(newOrder, "NEW ORDER");
    await newOrder.save();

    return response.status(200).json({
      success: true,
      message:
        "Payment successful, order created, and coupon deactivated if used.",
      orderId: newOrder._id,
      track: newOrder.track,
    });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    console.error(message);
    return response.status(500).json({ message });
  }
};

async function createStripeCoupon(discountPercentage: number): Promise<string> {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id as string;
}

async function createNewCoupon(userId: any): Promise<CouponData> {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });
  console.log(newCoupon);
  await newCoupon.save();
  console.log("SSSSs");
  return newCoupon as CouponData;
}
// Utility function to generate a unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${randomNum}`;
}
