import { Stack, useMediaQuery, useTheme } from "@mui/system";
import { useParams } from "react-router-dom";
import { tokens } from "../theme";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductProperty } from "../interfaces/Product";
import { axiosGlobal } from "../lib/axios";
import useAddToCart from "../hooks/useAddToCart";
import { useCart } from "../contexts/CartProvider";
import { SkeletonProductDetails } from "./Skeletons";
import { toTitleCase } from "../functions/Capitalize";
import Footer from "../scenes/global/Footer";

function ProductDetails() {
  const { id } = useParams();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(theme.palette.mode);
  const [product, setProduct] = useState<ProductProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axiosGlobal.get(`product/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, []);

  const { addToCart } = useAddToCart();
  const { dispatch } = useCart();

  const handleAddToCart = async (product: ProductProperty) => {
    await addToCart(product);
    dispatch({ type: "ADD_TO_CART", payload: product, paylaod2: [] });
  };

  if (isLoading) {
    return <SkeletonProductDetails />;
  }

  if (!product) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3 }}>
        Product not found
      </Typography>
    );
  }

  return (
    <>
      <Stack
        width={isMobile ? "90%" : isMedium ? "80%" : "75%"}
        m={"0 auto"}
        mt={7}
      >
        <Grid container height={"75vh"}>
          <Grid item xs={12} sm={7} md={6} lg={6} p={2} height={"100%"}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor:
                  mode === "dark" ? colors.grey[500] : colors.grey[600],
                borderRadius: "8px",
                boxShadow: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={6} lg={6} p={2}>
            <Typography variant="h6" color="textSecondary">
              {toTitleCase(product.category)}
            </Typography>
            <Typography variant="h4"> {toTitleCase(product.name)}</Typography>
            <Typography
              mt={1}
              fontSize={"1.2rem"}
              mb={2}
              sx={{ letterSpacing: "2px" }}
            >
              {product.price.toFixed(2)}$
            </Typography>
            <Typography mt={3}>{toTitleCase(product.description)}</Typography>
            <Button
              variant="contained"
              color="info"
              sx={{ mt: 3 }}
              fullWidth
              onClick={() => handleAddToCart(product)}
            >
              Add to cart
            </Button>
          </Grid>
        </Grid>
      </Stack>
      <Footer />
    </>
  );
}

export default ProductDetails;
