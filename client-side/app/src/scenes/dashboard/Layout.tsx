import React, { ReactNode, useEffect, useState } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, Stack, useMediaQuery } from "@mui/system";
import { tokens } from "../../theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import BarChartIcon from "@mui/icons-material/BarChart";
import CreateProduct from "./CreateProduct";
import Products from "./Products";
import Analytics from "./Analytics";
import { motion } from "framer-motion";
import Orders from "./Orders";
import Footer from "../global/Footer";

function Layout(): JSX.Element {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mode = theme.palette.mode;
  const [alignment, setAlignment] = useState<string | null>("create-product");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    if (!alignment) setAlignment("create-product");
  }, [alignment]);

  const buttons: {
    value: string;
    label: string;
    icon: ReactNode;
  }[] = [
    {
      value: "create-product",
      icon: <AddCircleOutlineIcon />,
      label: "Create Product",
    },
    {
      value: "products",
      icon: <ProductionQuantityLimitsIcon />,
      label: "Products",
    },
    {
      value: "analytics",
      icon: <BarChartIcon />,
      label: "Analytics",
    },
    {
      value: "orders",
      icon: <BarChartIcon />,
      label: "Orders",
    },
  ];

  return (
    <>
      <Stack mt={7} spacing={4} alignItems="center">
        <Typography
          textAlign="center"
          color={mode === "dark" ? colors.green[500] : colors.green[300]}
          fontWeight="bold"
          fontSize="2.5rem"
        >
          Admin Dashboard
        </Typography>
        <Box width={{ xs: "90%", sm: "75%", md: "60%" }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleAlignment}
            >
              {buttons.map((button) => (
                <ToggleButton
                  sx={{ width: "10%" }}
                  key={button.value}
                  value={button.value}
                  color="secondary"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {button.icon}
                    {!isMobile && <span>{button.label}</span>}
                  </Stack>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </motion.div>
        </Box>

        {alignment === "create-product" && <CreateProduct />}
        {alignment === "products" && <Products />}
        {alignment === "analytics" && <Analytics />}
        {alignment === "orders" && <Orders />}
      </Stack>
      <Footer />
    </>
  );
}

export default Layout;
