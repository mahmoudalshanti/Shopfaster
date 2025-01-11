import { CircularProgress } from "@mui/material";

type chooseStyleVar = {
  size: "large" | "medium" | "small";
};

const Loading = ({ size }: chooseStyleVar) => {
  if (size === "large") {
    return <CircularProgress size={"5rem"} color="secondary" />;
  } else if (size === "medium") {
    return <CircularProgress size={"3rem"} color="secondary" />;
  } else {
    return <CircularProgress size={"1.5rem"} color="secondary" />;
  }
};

export default Loading;
