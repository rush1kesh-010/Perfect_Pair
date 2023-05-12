import axios from "axios";
import React, { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [verificationStep, setVerificationStep] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  const verifyUser = async () => {
    const usertoken = await localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5000/users/auth/verify-user",
        {
          headers: {
            Authorization: usertoken,
          },
        }
      );
      if (response.status === 200) {
        setUser({
          user: await response.data.data,
          isAuthenticated: true,
          token: usertoken,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const verifyAdmin = async () => {
    const admintoken = await localStorage.getItem("admin-token");
    try {
      //  const response = await axios.get(
      //    "http://localhost:5000/users/auth/verify-user",
      //    {
      //      headers: {
      //        Authorization: admintoken,
      //      },
      //    }
      //  );
      if (admintoken) {
        setAdmin({
          isAuthenticated: true,
          token: admintoken,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    verifyUser();
    verifyAdmin();
  }, []);
  console.log(admin);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        verificationStep,
        setVerificationStep,
        admin,
        setAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
