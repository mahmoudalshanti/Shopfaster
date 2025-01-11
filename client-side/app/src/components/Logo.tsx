import { Typography, useTheme } from "@mui/material";

function Logo() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Typography
      sx={{
        cursor: "pointer",
        color: mode === "dark" ? "#ddd" : "#777",
      }}
      display={"flex"}
      fontSize={"1.3rem"}
      alignItems={"center"}
    >
      <Typography
        fontSize={"2.2rem"}
        fontStyle={"italic"}
        fontWeight={"bold"}
        mr={0.4}
        sx={{
          color: mode === "dark" ? "#ddd" : "#777",
        }}
      >
        S
      </Typography>
      hopfaster
    </Typography>
  );
}

export default Logo;
