import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

function RequireAuth(): any {
  const { user } = useUser();
  return user?.name ? <Outlet /> : Navigate({ to: "/signup" });
}

export default RequireAuth;
