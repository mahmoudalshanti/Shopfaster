import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";

function Error404() {
  const nav = useNavigate();
  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      height={"80vh"}
    >
      <Typography fontSize={"3rem"}>404</Typography>
      <Typography fontSize={"1.2rem"} display={"flex"} alignItems={"center"}>
        No page found{" "}
        <Typography
          ml={"0.2rem"}
          color="secondary"
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => {
            nav("/");
          }}
        >
          back to home
        </Typography>
      </Typography>
    </Stack>
  );
}

export default Error404;
