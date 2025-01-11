import { Request, Response } from "express";
import Product, { ProductData } from "../models/Product";
import { redis } from "../lib/redis";
import cloudinary from "../lib/cloudinary";

interface Products {
  getAllProducts: (request: Request, response: Response) => Promise<Response>;
  getProduct: (
    request: Request<{ id: string }>,
    response: Response
  ) => Promise<Response>;
  getFeaturedProducts: (
    request: Request,
    response: Response
  ) => Promise<Response>;
  createProduct: (
    request: Request<{}, {}, ProductData>,
    response: Response
  ) => Promise<Response>;
  deleteProduct: (request: Request, response: Response) => Promise<Response>;
  getRecommendedProducts: (
    request: Request,
    response: Response
  ) => Promise<Response>;
  getProductsByCategory: (
    request: Request<{ category: string }>,
    response: Response
  ) => Promise<Response>;
  toggleFeaturedProduct: (
    request: Request,
    response: Response
  ) => Promise<Response>;
}

export const getAllProducts: Products["getAllProducts"] = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const products = await Product.find({}).lean().exec();
    return response.status(200).json({ products });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const getProduct: Products["getProduct"] = async (
  request: Request<{ id: string }>,
  response: Response
): Promise<Response> => {
  try {
    const { id } = request.params;

    const product = await Product.findById(id).lean().exec();
    return response.status(200).json({ product });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const getFeaturedProducts: Products["getFeaturedProducts"] = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    let featuredProducts: ProductData[] | string | null | {} = await redis.get(
      "featured_products"
    );
    if (featuredProducts) {
      return response
        .status(200)
        .json({ products: JSON.parse(featuredProducts as string) });
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean().exec();

    if (!featuredProducts)
      return response
        .status(404)
        .json({ message: "No featured products found" });

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    return response.status(200).json({ products: featuredProducts });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const createProduct: Products["createProduct"] = async (
  request: Request<{}, {}, ProductData>,
  response: Response
): Promise<Response> => {
  try {
    const { name, description, price, image, category }: ProductData =
      request.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    return response.status(201).json({ product });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const deleteProduct: Products["deleteProduct"] = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const product: ProductData | null = await Product.findById(
      request.params.id
    );

    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId: string =
        product.image.split("/").pop()?.split(".")[0] || "";

      await cloudinary.uploader.destroy(`products/${publicId}`);
    }
    await Product.deleteOne({ _id: request.params.id });
    return response.json({ message: "Product deleted successfully" });
  } catch (error) {
    const message: string =
      error instanceof Error ? error.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const getRecommendedProducts: Products["getRecommendedProducts"] =
  async (requset: Request, response: Response): Promise<Response> => {
    try {
      const products: ProductData[] = await Product.aggregate([
        {
          $sample: { size: 4 },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            price: 1,
          },
        },
      ]);

      return response.status(200).json({ products });
    } catch (err) {
      const message: string =
        err instanceof Error ? err.message : "Something went wrong";
      return response.status(500).json({ message });
    }
  };

export const getProductsByCategory: Products["getProductsByCategory"] = async (
  request: Request<{ category: string }>,
  response: Response
): Promise<Response> => {
  const { category } = request.params;
  try {
    const products = await Product.find({ category });
    return response.json({ products });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const toggleFeaturedProduct: Products["toggleFeaturedProduct"] = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const product = await Product.findById(request.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      const featuredProducts = await Product.find({ isFeatured: true }).lean();
      await redis.set("featured_products", JSON.stringify(featuredProducts));
      return response.json({ product: updatedProduct });
    } else {
      return response.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    const message: string =
      error instanceof Error ? error.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};
