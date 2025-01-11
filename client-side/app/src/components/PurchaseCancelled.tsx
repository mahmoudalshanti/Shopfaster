import { Box, Stack, useMediaQuery, useTheme } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { CancelOutlined } from "@mui/icons-material";

function PurchaseCancelled() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const nav = useNavigate();

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
      <Box>
        <CancelOutlined sx={{ fontSize: "5rem" }} color="error" />
      </Box>
      <Typography color="#ccc" textAlign="center">
        your purchase cancelled.
      </Typography>

      <Box width={isMobile ? "90%" : isMedium ? "70%" : "50%"} mt={2}>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<ArrowForwardIcon sx={{ color: colors.green[500] }} />}
          fullWidth
          onClick={() => {
            nav("/");
          }}
        >
          Back to home
        </Button>
      </Box>
    </Stack>
  );
}

export default PurchaseCancelled;
