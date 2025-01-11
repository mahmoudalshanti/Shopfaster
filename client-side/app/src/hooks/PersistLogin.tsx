import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import Loading from "../components/Loading";
import { Outlet } from "react-router-dom";
import useCheckAuth from "./useCheckAuth";
import { Stack } from "@mui/system";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { checkAuth } = useCheckAuth();
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsLoading(true);
        await checkAuth();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !user.name ? verifyAuth() : setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <Stack direction={"row"} mt={12} justifyContent={"center"}>
          <Loading size="large" />
        </Stack>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default PersistLogin;
