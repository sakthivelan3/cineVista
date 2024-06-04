import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";

const PrivateRoute = () => {
  const user = auth.currentUser;

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
