import { Button, TextField, Typography } from "@mui/material";
import { Box, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartProvider";
import useGetCoupon from "../../hooks/useGetCoupon";
import useValidateCoupon, {
  CouponProperty,
} from "../../hooks/useValidateCoupon";
import useCheckout from "../../hooks/useCheckout";
import Loading from "../../components/Loading";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
function OrderSummary() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<CouponProperty | null>(null);
  const [isActiveCoupon, setIsActiveCoupon] = useState<boolean>(false);
  const { calculateTotals } = useCart();
  const { getCoupon } = useGetCoupon();
  const { isLoading: isLoadingValidate, validateCoupon } = useValidateCoupon();
  const { cart } = useCart();
  const nav = useNavigate();
  const { isLoading: isLoadingCheckout, checkout } = useCheckout();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const fetchedCoupon = await getCoupon();
        setCoupon(fetchedCoupon);
      } catch (err) {
        console.error("Error fetching coupon:", err);
      }
    };

    fetchCoupon();
  }, []);

  const handleValidateCode = async () => {
    try {
      const isValid = await validateCoupon(code);
      setIsActiveCoupon(Boolean(isValid?.code));
    } catch (err) {
      console.error("Error validating coupon:", err);
    }
  };
  const { total, subTotal } = calculateTotals(
    isActiveCoupon && coupon?.discountPercentage ? coupon.discountPercentage : 0
  );

  const savings = subTotal - total;

  const handelPayment = async () => {
    await checkout(cart, coupon);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Stack spacing={3}>
        <Box
          className={
            mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
          }
          padding={2}
        >
          <Typography variant="h6" color="secondary" marginBottom={2}>
            Order Summary
          </Typography>

          <Stack spacing={1} marginBottom={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Original Price</Typography>
              <Typography>{subTotal.toFixed(2)}$</Typography>
            </Stack>

            {savings > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography>Savings</Typography>
                <Typography>{savings.toFixed(2)}$</Typography>
              </Stack>
            )}

            {coupon?.code && isActiveCoupon && (
              <>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Coupon {coupon.code}</Typography>
                  <Typography>-{coupon.discountPercentage}%</Typography>
                </Stack>
              </>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Typography>Total</Typography>
              <Typography>{total.toFixed(2)}$</Typography>
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="secondary"
            disabled={isLoadingCheckout}
            fullWidth
            onClick={() => handelPayment()}
          >
            {isLoadingCheckout ? (
              <Loading size="small" />
            ) : (
              "Proceed to Checkout"
            )}
          </Button>

          <Typography
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            color="secondary"
            textAlign="center"
            marginTop={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={() => {
              nav("/");
            }}
          >
            Continue Shopping
            <ArrowForward sx={{ fontSize: ".9rem", ml: 0.5 }} />
          </Typography>
        </Box>

        <Box
          className={
            mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
          }
          padding={2}
        >
          <Typography marginBottom={2} fontSize="0.9rem">
            Do you have a coupon code or gift card?
          </Typography>

          <TextField
            fullWidth
            type="text"
            size="small"
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your coupon code"
            margin="normal"
          />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleValidateCode}
            disabled={isLoadingValidate || !code}
          >
            {isLoadingValidate ? <Loading size="small" /> : "Apply Code"}
          </Button>

          {coupon?.discountPercentage && (
            <Typography marginTop={1} fontSize="0.9rem" color="#777">
              Your available coupon is: {coupon.code} -{" "}
              {coupon.discountPercentage}% off
            </Typography>
          )}
        </Box>
      </Stack>
    </motion.div>
  );
}

export default OrderSummary;
