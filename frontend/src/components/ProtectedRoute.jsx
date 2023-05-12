import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";

export default function ProtectedRoute({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const verifyUser = async () => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5000/users/auth/verify-user",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setUser({
          user: response.data.data,
          isAuthenticated: true,
          token: token,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    verifyUser();
  }, []);
  if (user.isAuthenticated === true) {
    return <>{children}</>;
  } else if (user.isAuthenticated === false) {
    navigate("/signin");
  }
}
