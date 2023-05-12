import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const verifyAdmin = async () => {
    const token = await localStorage.getItem("admin-token");
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/verify-admin",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setAdmin(response.data.success);
      }
    } catch (err) {
      setAdmin(false);
    }
  };
  useEffect(() => {
    verifyAdmin();
  }, []);
  if (admin === true) {
    return <>{children}</>;
  } else if (admin === false) {
    navigate("/admin");
  }
}
