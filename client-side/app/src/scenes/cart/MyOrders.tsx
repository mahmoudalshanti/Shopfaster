import {
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from "react";

import useGetOrdersUser from "../../hooks/useGetOrdersUser";
import { OrderProperty } from "../../hooks/useGetAllOrders";
import { SkeletonMyOrders } from "../../components/Skeletons";
import { motion } from "framer-motion";
import { useUser } from "../../contexts/UserProvider";
import { Underline } from "lucide-react";
import { useNavigate } from "react-router-dom";
function MyOrders() {
  const { isLoading, getOrders } = useGetOrdersUser();
  const [orders, setOrders] = useState<OrderProperty[] | undefined>([]);
  const nav = useNavigate();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { user } = useUser();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    if (user.name) fetchCart();
  }, []);

  if (isLoading && orders?.length === 0) {
    return <SkeletonMyOrders />;
  }

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack
          height={!orders?.length ? "45vh" : ""}
          alignItems="center"
          justifyContent="center"
          mt={7}
        >
          <Typography
            variant="h5"
            color="textSecondary"
            display={"flex"}
            alignItems={"center"}
          >
            No orders yet..
          </Typography>
          <Typography
            color="secondary"
            display={"flex"}
            alignItems={"center"}
            variant="h5"
            sx={{ textDecoration: "underLine", cursor: "pointer" }}
            onClick={() => {
              nav("/");
            }}
          >
            Explore our categories
          </Typography>
        </Stack>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Stack height={!orders ? "60vh" : ""}>
        <Grid container width={"80%"} margin={"0 auto"} mt={1} padding={2}>
          {orders?.map((order) => (
            <Grid item xs={12} mb={4} key={order.track}>
              <Typography variant="h6" mb={2}>
                Order ID: {order.track}
              </Typography>
              <TableContainer
                component={Paper}
                className={
                  mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
                }
              >
                <TableContainer>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <Box width={"50px"} height={"50px"}>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.price}$</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableContainer>
              </TableContainer>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                padding={2}
              >
                <Typography variant="body1">Status: {order.status}</Typography>
                <Typography variant="body1">
                  Total Amount: {order.totalAmount}$
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </motion.div>
  );
}

export default MyOrders;
