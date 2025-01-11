import { Stack, useMediaQuery, useTheme } from "@mui/system";
import AnalyticsTab from "../../components/AnalyticsTab";
import { motion } from "framer-motion";

function Analytics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack width={isMobile ? "90%" : "60%"}>
      <AnalyticsTab />
    </Stack>
  );
}

export default Analytics;
