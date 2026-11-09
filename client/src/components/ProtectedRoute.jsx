import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getMe } from "../api";

// only shows the page if the server says the cookie is valid
function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    getMe()
      .then(() => setStatus("allowed"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <p className="text-blue-200 font-medium">Unlocking your vault...</p>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;