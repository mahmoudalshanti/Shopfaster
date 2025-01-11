import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

function RequireAdmin(): any {
  const { user } = useUser();
  console.log(user);
  return user?.role === "admin" ? <Outlet /> : Navigate({ to: "/login" });
}

export default RequireAdmin;
