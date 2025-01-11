import { Request, Response } from "express";
import Product, { ProductData } from "../models/Product";
import User from "../models/User";

interface Cart {
  getCartProducts: (requset: Request, response: Response) => Promise<Response>;
  addToCart: (requset: Request, response: Response) => Promise<Response>;
  removeAllFromCart: (
    requset: Request<{ productId: string }, {}, {}>,
    response: Response
  ) => Promise<Response>;
  updateQuantity: (
    requset: Request<{ id: string }, {}, { quantity: number }>,
    response: Response
  ) => Promise<Response>;
}

export const getCartProducts: Cart["getCartProducts"] = async (
  requset: Request,
  response: Response
): Promise<Response> => {
  try {
    const user = requset.user;

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    const cartItems = await Promise.all(
      user?.cartItems?.map(async (product) => {
        const productFound: ProductData | null = await Product.findById(
          product.product
        );
        return {
          name: productFound?.name,
          description: productFound?.description,
          price: productFound?.price,
          image: productFound?.image,
          category: productFound?.category,
          isFeatured: productFound?.isFeatured,
          quantity: product.quantity,
          _id: product.product,
        };
      }) || []
    );
    const filteredCartItems = cartItems.filter((item) => item !== null);

    return response.status(200).json({ cartItems: filteredCartItems });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const addToCart = async (
  requset: Request,
  response: Response
): Promise<Response> => {
  try {
    const { productId } = requset.body;
    const user = requset.user;

    const existingItem = user?.cartItems.find((item) => {
      console.log(item);
      return item.product === productId;
    });

    console.log(existingItem);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user?.cartItems.push({ product: productId, quantity: 1 });
    }

    await user?.save();
    return response.status(200).json({ cartItems: user?.cartItems });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};
export const removeAllFromCart: Cart["removeAllFromCart"] = async (
  request: Request<{ productId: string }, {}, {}>,
  response: Response
): Promise<Response> => {
  try {
    const { productId } = request.params;
    const user = request.user;

    if (!user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    if (productId === "null") {
      await User.findByIdAndUpdate(user._id, { cartItems: [] }, { new: true });
    } else {
      await User.findByIdAndUpdate(
        user._id,
        {
          $pull: { cartItems: { product: productId } },
        },
        { new: true }
      );
    }

    const updatedUser = await User.findById(user._id).select("cartItems");

    return response.status(200).json({ cartItems: updatedUser?.cartItems });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    console.error(message);
    return response.status(500).json({ message });
  }
};

export const updateQuantity: Cart["updateQuantity"] = async (
  requset: Request<{ id: string }, {}, { quantity: number }>,
  response: Response
): Promise<Response> => {
  try {
    const { id: productId } = requset.params;
    const { quantity } = requset.body;
    const user = requset.user;
    const existingItem = user?.cartItems.find(
      (item) => String(item.product) === productId
    );

    if (existingItem) {
      if (quantity === 0) {
        if (user)
          user.cartItems = user.cartItems.filter(
            (item) => String(item.product) !== productId
          );
        await user?.save();
        return response.status(200).json({ cartItems: user?.cartItems });
      }

      existingItem.quantity = quantity;
      await user?.save();
      return response.status(200).json({ cartItems: user?.cartItems });
    } else {
      return response.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};
