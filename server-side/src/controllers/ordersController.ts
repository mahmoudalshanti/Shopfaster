import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

interface Orders {
  getAllOrders: (request: Request, response: Response) => Promise<Response>;
  getAllOrdersByUser: (
    request: Request,
    response: Response
  ) => Promise<Response>;
  updateOrder: (
    request: Request<
      {},
      {},
      {
        id: string;
        status: "pending" | "shipped" | "delivered" | "canceled" | "processing";
      }
    >,
    response: Response
  ) => Promise<Response>;
}

export const getAllOrders: Orders["getAllOrders"] = async (
  request: Request,
  response: Response
) => {
  try {
    const orders = await Order.find({}).lean().exec();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.user).lean().exec();

        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await Product.findById(product.product)
              .lean()
              .exec();
            return {
              image: productDetails?.image,
              name: productDetails?.name,
              quantity: product.quantity,
              price: product.price,
            };
          })
        );

        return {
          user: {
            email: user?.email,
            name: user?.name,
          },
          _id: order._id,
          track: order.track,
          status: order.status,
          totalAmount: order.totalAmount,
          products,
        };
      })
    );

    return response.status(200).json({ orders: enrichedOrders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

// Fetch orders by user
export const getAllOrdersByUser: Orders["getAllOrdersByUser"] = async (
  request: Request,
  response: Response
) => {
  try {
    const user = request.user;

    if (!user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: user._id }).lean().exec();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await Product.findById(product.product)
              .lean()
              .exec();
            return {
              image: productDetails?.image,
              name: productDetails?.name,
              quantity: product.quantity,
              price: product.price,
            };
          })
        );

        return {
          _id: order._id,
          track: order.track,
          status: order.status,
          totalAmount: order.totalAmount,
          products,
        };
      })
    );
    console.log(enrichedOrders);
    return response.status(200).json({ orders: enrichedOrders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const updateOrder: Orders["updateOrder"] = async (
  request: Request<
    {},
    {},
    {
      id: string;
      status: "pending" | "shipped" | "delivered" | "canceled" | "processing";
    }
  >,
  response: Response
) => {
  try {
    const { id, status } = request.body;

    const validStatuses = [
      "pending",
      "shipped",
      "delivered",
      "canceled",
      "processing",
    ];
    if (!validStatuses.includes(status)) {
      return response.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(id).exec();

    if (!order) {
      return response.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return response.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};
