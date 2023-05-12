import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import FileUpload from "../../components/FileUpload/FileUpload";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import { AuthContext } from "../../context/context";
import { ToastContainer, toast } from "react-toastify";
import StepRedirect from "../../components/StepRedirect";

function Documents() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, verificationStep } = useContext(AuthContext);
  const submithandler = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);
    formData.append("identity", identity);
    formData.append("degreeCertificate", degreeCertificate);
    try {
      const response = await fetch(
        "http://localhost:5000/users/verification/step/3",
        {
          method: "POST",
          headers: {
            Authorization: user.token,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (response.status == 200) notify(data.message);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/profile-under-review");
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
  if (verificationStep !== "2") {
    return <StepRedirect />;
  }
  return (
    <ProtectedRoute>
      <Layout>
        <ToastContainer />
        <p className={styles.header}>Upload Required Documents</p>
        <div className={styles.docs}>
          <div className={styles.doc_1}>
            <p className={styles.text}>1. Upload Your Profile Photo</p>
            <FileUpload file={profilePhoto} setFile={setProfilePhoto} />
          </div>
          <div className={styles.doc_1}>
            <p className={styles.text}>2. Confirm Your Identity </p>
            <FileUpload file={identity} setFile={setIdentity} />
          </div>
          <div className={styles.doc_1}>
            <p className={styles.text}>3. Upload Your Degree Certificate </p>
            <FileUpload
              file={degreeCertificate}
              setFile={setDegreeCertificate}
            />
          </div>
        </div>
        <div className={styles.btn}>
          {isLoading ? (
            <button>Loading...</button>
          ) : (
            <button type='submit' onClick={submithandler}>
              Submit
            </button>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export default Documents;
