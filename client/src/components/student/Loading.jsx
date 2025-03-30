import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Loading = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("trxref") || params.has("reference")) {
      // Remove query parameters after page loads
      navigate("/loading/my-enrollments", { replace: true });
    }
  }, [location, navigate]);
  return (
    <div className="min-h-screen flex item-center justify-center">
      <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
