import { Stack, useTheme } from "@mui/system";
import Logo from "../../components/Logo";
import { Typography } from "@mui/material";

function Footer() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Stack
      mt={12}
      p={5}
      sx={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        bgcolor: mode === "dark" ? "#070f14" : "#051018",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
        <Typography color="#eee" fontSize={"1rem"}>
          All rights reserved
        </Typography>
        <Logo />
        <Typography color="#eee" ml={1} fontSize={"1rem"}>
          2025
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Footer;
