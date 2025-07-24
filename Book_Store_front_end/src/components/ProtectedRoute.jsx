import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
