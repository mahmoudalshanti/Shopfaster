import { Box, Stack, useMediaQuery, useTheme } from "@mui/system";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Confetti from "react-confetti";
import useCheckoutSuccess from "../hooks/useCheckoutSuccess";
import { tokens } from "../theme";

function PurchaseSuccess() {
  const { checkoutSuccess, isLoading } = useCheckoutSuccess();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [track, setTrack] = useState<string | undefined>("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const nav = useNavigate();

  useEffect(() => {
    const sessionIdFromUrl = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      const handleCheckoutSuccess = async () => {
        const data = await checkoutSuccess(sessionId);
        setTrack(data);
      };
      handleCheckoutSuccess();
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <Stack mt={12} direction={"row"} justifyContent={"center"}>
        <Loading size="large" />
      </Stack>
    );
  }

  console.log(track);
  return (
    <Stack
      overflow="hidden"
      m="0 auto"
      p="10px"
      borderRadius={5}
      mt={10}
      width={isMobile ? "90%" : isMedium ? "70%" : "50%"}
      bgcolor={mode === "dark" ? "#00000085" : "#141b2de3"}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />
      <Box>
        <CheckCircleOutlineIcon
          sx={{ fontSize: "5rem", color: colors.green[500] }}
        />
      </Box>
      <Typography color="#ccc" textAlign="center">
        Thank you for your order, we're processing it now.
      </Typography>
      <Typography
        sx={{ color: colors.green[500] }}
        fontWeight="bold"
        textAlign="center"
      >
        Check your email for order updates.
      </Typography>

      <Box
        width={isMobile ? "90%" : isMedium ? "70%" : "50%"}
        bgcolor={mode === "dark" ? "#00000085" : "#141b2de3"}
        p={1}
        borderRadius={2}
        mt={1}
      >
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography color="#ccc">Order number</Typography>
          <Typography sx={{ color: colors.green[500] }} fontWeight="bold">
            {track}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography color="#ccc">Delivery</Typography>
          <Typography sx={{ color: colors.green[500] }} fontWeight="bold">
            3-5 business days
          </Typography>
        </Stack>
      </Box>
      <Box width={isMobile ? "90%" : isMedium ? "70%" : "50%"}>
        <Typography
          color="#1f2a40"
          sx={{ mb: 1, mt: 2 }}
          fontWeight="800"
          textAlign="center"
          bgcolor={colors.green[500]}
          p={0.5}
          borderRadius={1}
        >
          Thank you for trusting us
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<ArrowForwardIcon sx={{ color: colors.green[500] }} />}
          fullWidth
          onClick={() => {
            nav("/");
          }}
        >
          Continue shopping
        </Button>
      </Box>
    </Stack>
  );
}

export default PurchaseSuccess;
