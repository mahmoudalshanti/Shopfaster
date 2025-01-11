import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetProductsByCategorey from "../../hooks/useGetProductsByCategorey";
import { ProductProperty } from "../../interfaces/Product";
import suits from "/public/suits.jpg";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { motion } from "framer-motion";
import useAddToCart from "../../hooks/useAddToCart";
import { useUser } from "../../contexts/UserProvider";
import toast from "react-hot-toast";
import { SkeletonCategorty } from "../../components/Skeletons";
import Footer from "../global/Footer";
import { toTitleCase } from "../../functions/Capitalize";

const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { getProductsByCategorey } = useGetProductsByCategorey();
  const [products, setProducts] = useState<ProductProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mode = theme.palette.mode;
  const nav = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        if (category) {
          const fetchedProducts = await getProductsByCategorey(category);
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.name) fetchProducts();
  }, []);

  const { addToCart } = useAddToCart();
  const { user } = useUser();

  const handelAddToCart = async (product: ProductProperty) => {
    if (!user.name) return toast.error("Must signup for add to cart");
    await addToCart(product);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack
          width={isMobile ? "90%" : "75%"}
          margin="0 auto"
          mt={7}
          height={products.length === 0 ? "100vh" : ""}
        >
          {isLoading ? (
            <SkeletonCategorty />
          ) : (
            <Grid container spacing={2}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Grid item key={product._id} xs={6} sm={6} md={4} lg={3}>
                    <Card
                      sx={{
                        width: "100%",
                        margin: "auto",
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      className={
                        mode === "dark"
                          ? "Paper-overlay-Dark"
                          : "Paper-overlay-Light"
                      }
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={product.image || suits}
                        sx={{ padding: 0.5, borderRadius: 2 }}
                        alt={product.name || "Product Image"}
                        onClick={() => {
                          nav(`/product/${product._id}`);
                        }}
                      />
                      <CardContent
                        onClick={() => {
                          nav(`/product/${product._id}`);
                        }}
                      >
                        <Typography gutterBottom variant="h5" component="div">
                          {toTitleCase(product.name)}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          onClick={() => {
                            nav(`/product/${product._id}`);
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="secondary"
                          variant="contained"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handelAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="center"
                  width="100%"
                >
                  No products found for this category.
                </Typography>
              )}
            </Grid>
          )}
        </Stack>
        <Footer />
      </motion.div>
    </>
  );
};

export default Category;
