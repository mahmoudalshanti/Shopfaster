import { Grid, IconButton, Typography } from "@mui/material";
import { Box, Stack, useTheme } from "@mui/system";
import { useEffect } from "react";
import suits from "../../../public/suits.jpg";
import { DeleteOutline } from "@mui/icons-material";
import OrderSummary from "./OrderSummary";
import Recommendations from "./Recommendations";
import { useCart } from "../../contexts/CartProvider";
import { ProductProperty } from "../../interfaces/Product";
import useUpdateQu from "../../hooks/useUpdateQu";
import useGetAllInCart from "../../hooks/useGetAllInCart";
import useDeleteCart from "../../hooks/useDeleteCart";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useUser } from "../../contexts/UserProvider";
import { SkeletonCart } from "../../components/Skeletons";
import { motion } from "framer-motion";

function MyCart(): JSX.Element {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(theme.palette.mode);

  const { isLoading, getAllInCart } = useGetAllInCart();
  const { cart, dispatch } = useCart();
  const { updateQu } = useUpdateQu();
  const { deleteCart } = useDeleteCart();

  const nav = useNavigate();

  const handelIncQu = (product: ProductProperty) => {
    updateQu(product.quantity + 1, product._id);
    dispatch({ type: "INC_QU", payload: product, paylaod2: [] });
  };

  const handelDecQu = (product: ProductProperty) => {
    if (product.quantity - 1 === 0) return deleteFromCart(product);

    updateQu(product.quantity - 1, product._id);
    dispatch({ type: "DEC_QU", payload: product, paylaod2: [] });
  };

  const deleteFromCart = (product: ProductProperty) => {
    deleteCart(product._id);
    dispatch({ type: "DELETE_PRODUCT_CART", payload: product, paylaod2: [] });
  };

  const { user } = useUser();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        await getAllInCart();
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    if (user.name) fetchCart();
  }, []);

  if (isLoading && cart.length === 0) {
    return <SkeletonCart />;
  }

  if (!cart || cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack
          alignItems="center"
          height={cart.length === 0 ? "45vh" : ""}
          justifyContent="center"
          mt={7}
        >
          <Typography
            variant="h5"
            color="textSecondary"
            display={"flex"}
            alignItems={"center"}
          >
            Your cart is empty.{" "}
            <Typography
              ml={"0.3rem"}
              color={colors.green[500]}
              variant="h6"
              sx={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                nav("/");
              }}
            >
              {" "}
              Start shopping now!
            </Typography>
          </Typography>
        </Stack>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Grid container width={"80%"} margin={"0 auto"} mt={1} padding={2}>
          <Grid item sm={12} md={6} lg={8} padding={2}>
            <Stack>
              {cart.map((product) => {
                return (
                  <Stack
                    key={product._id}
                    mb={2}
                    direction="row"
                    className={
                      mode === "dark"
                        ? "Paper-overlay-Dark"
                        : "Paper-overlay-Light"
                    }
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    sx={{
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      width={{ xs: "100%", sm: "80%", lg: "60%", xl: "50%" }}
                      alignItems="center"
                      gap={2}
                      sx={{
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        flexBasis={{ xs: "100%", sm: "30%" }}
                        height={{ xs: "auto", sm: "150px" }}
                        mr={{ xs: 0, sm: 2 }}
                        mb={{ xs: 2, sm: 0 }}
                      >
                        <img
                          src={product.image || suits}
                          alt="Product"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>

                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        flex="1"
                        py={2}
                      >
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body1" color="gray">
                          {product.category}
                        </Typography>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => deleteFromCart(product)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    </Stack>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        textAlign: "center",
                      }}
                    >
                      <IconButton
                        color="secondary"
                        aria-label="decrease quantity"
                        onClick={() => handelDecQu(product)}
                      >
                        -
                      </IconButton>
                      <Typography variant="body1">
                        {product.quantity}
                      </Typography>
                      <IconButton
                        color="secondary"
                        aria-label="increase quantity"
                        onClick={() => handelIncQu(product)}
                      >
                        +
                      </IconButton>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        textAlign: "right",
                      }}
                    >
                      {product.price}$
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
          <Grid item sm={12} md={6} lg={4} padding={2}>
            <OrderSummary />
          </Grid>
        </Grid>
        <Stack mt={4} width={"80%"} margin={"0 auto"}>
          <Typography
            color="secondary"
            fontSize={"1.5rem"}
            fontWeight={"bold"}
            mb={2}
          >
            People also bought
          </Typography>
          <Grid container spacing={2}>
            <Recommendations />
          </Grid>
        </Stack>
      </motion.div>
    </>
  );
}

export default MyCart;
