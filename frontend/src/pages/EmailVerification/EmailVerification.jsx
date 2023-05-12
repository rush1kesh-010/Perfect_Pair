import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import icon_image from "../../assets/Verification.png";
import ProtectedRoute from "../../components/ProtectedRoute";
import StepRedirect from "../../components/StepRedirect";
import { AuthContext } from "../../context/context";
import Layout from "../../components/Layout/Layout";
import { ToastContainer, toast } from "react-toastify";
import AuthCode from "react-auth-code-input";
import { useNavigate } from "react-router-dom";

function EmailVerification() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState("");
  const { verificationStep, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleOTPChange = (otp) => {
    setCode(otp);
  };

  const emailSendhandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/users/verification/step/send-verification-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        }
      );
      const data = await response.json();
      if (response.status == 200) notify(data.message);
      setEmailSent(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      notify(error.message);
    }
  };
  const emailVerifyHandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/users/verification/step/1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({ code }),
        }
      );
      const data = await response.json();
      if (response.status == 200) notify(data.message);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/personal-info");
      }, 3000);
    } catch (error) {
      console.log(error);
      notify(error.message);
    }
  };
  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }

  if (verificationStep !== "0") {
    return (
      <ProtectedRoute>
        <StepRedirect />
      </ProtectedRoute>
    );
  }
  return (
    <ProtectedRoute>
      <ToastContainer />
      <Layout>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src={icon_image} alt='Error' />
          </div>
          <div className={styles.container_1}>
            <span>Verify Your Email Address</span>
            <p>
              {user.user.name}, to start using Perfect Pair, we need to verify
              your email ID {user.user.email}.
            </p>
            <p>We have sent you a verification email.</p>
          </div>

          {emailSent ? (
            <div className={styles.authCodeContainer}>
              <h1>Enter Your OTP here</h1>
              <AuthCode
                inputClassName={styles.authCodeInput}
                allowedCharacters='numeric'
                onChange={handleOTPChange}
              />
              {isLoading ? (
                <button> Loading...</button>
              ) : (
                <button onClick={emailVerifyHandler}>ClICK TO VERIFY</button>
              )}

            </div>
          ) : (
            !isLoading ? <button onClick={emailSendhandler}>ClICK TO VERIFY</button> : <button>Loading...</button>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export default EmailVerification;
