import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

const ProtectedRoute = () => {
  const { player } = useContext(PlayerContext);
  const location = useLocation();

  const isAuthenticated = !!player?.playerName;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // optional: allows redirect-back after login
      />
    );
  }

  // render nested routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
