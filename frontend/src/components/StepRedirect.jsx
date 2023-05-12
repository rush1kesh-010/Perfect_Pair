import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/context";
function StepRedirect({ children }) {
  const { user, setVerificationStep, verificationStep } =
    useContext(AuthContext);
  const getCurrentStep = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/users/verification/step/current-step",
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      if (response.status === 200) {
        setVerificationStep(response.data.data.step);
        console.log(response.data.data.step, "step");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCurrentStep();
  }, [user.isAuthenticated]);
  if (verificationStep == "0") {
    return <Navigate to='/email-verification' replace />;
  } else if (verificationStep == "1") {
    return <Navigate to='/personal-info' replace />;
  } else if (verificationStep == "2") {
    return <Navigate to='/document-verification' replace />;
  } else if (verificationStep == "3") {
    return <Navigate to='/profile-under-review' replace />;
  } else if (verificationStep == "4") {
    return <Navigate to='/feed' replace />;
  }
  return <>{children}</>;
}

export default StepRedirect;
