import { Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useState } from "react";

import Footer from "../global/Footer";
import MyCart from "./MyCart";
import MyOrders from "./MyOrders";
import { motion } from "framer-motion";

function Cart() {
  const [active, setActive] = useState<string>("cart");
  return (
    <>
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Stack direction={"row"} padding={2}>
            <Typography
              mr={5}
              fontSize={"1.4rem"}
              sx={{ cursor: "pointer" }}
              color={active === "cart" ? "secondary" : ""}
              onClick={() => setActive("cart")}
            >
              My cart
            </Typography>
            <Typography
              fontSize={"1.4rem"}
              sx={{ cursor: "pointer" }}
              color={active === "orders" ? "secondary" : ""}
              onClick={() => setActive("orders")}
            >
              My orders
            </Typography>
          </Stack>
        </motion.div>
      </Container>

      {active === "cart" && <MyCart />}
      {active === "orders" && <MyOrders />}

      <Footer />
    </>
  );
}

export default Cart;
