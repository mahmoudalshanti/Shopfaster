import { SvgIconComponent } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box, Stack, useTheme } from "@mui/system";
import { tokens } from "../theme";
import { motion } from "framer-motion";
import { toTitleCase } from "../functions/Capitalize";

interface AnalyticsCardProps {
  title: string;
  total: string;
  icon: SvgIconComponent;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  total,
  icon: Icon,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mode = theme.palette.mode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <Box
        bgcolor={mode === "dark" ? "#004d4c" : "#348c73"}
        p={2}
        borderRadius={"5px"}
        display={"flex"}
        justifyContent={"space-between"}
        sx={{ position: "relative" }}
        overflow={"hidden"}
      >
        <Stack>
          <Typography
            fontSize={"1rem"}
            color={mode === "dark" ? "#4ec9a8" : "#a5ffe9"}
            fontWeight={"bold"}
          >
            {toTitleCase(title)}
          </Typography>
          <Typography fontSize={"1.3rem"} color="#fff">
            {total.toLocaleString()}
          </Typography>
        </Stack>
        <Icon
          sx={{
            position: "absolute",
            right: "-10px",
            fontSize: "5rem",
            transform: "translateY(-50%)",
            top: "50%",
            color: mode === "dark" ? colors.green[500] : "#21b78f",
          }}
        />
      </Box>
    </motion.div>
  );
};

export default AnalyticsCard;
