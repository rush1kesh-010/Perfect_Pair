import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import profile_img from "../../assets/profile.png";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPlaceOfWorship,
  faGraduationCap,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "../../context/context";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";

function UserProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const getUserInfo = async () => {
    const info = {
      basicInfo: {},
      education: {},
      documents: {},
      contact: {},
    };
    const personalinfo = await axios.get(
      `http://localhost:5000/users/${id}/personal-info`,
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    info.basicInfo = personalinfo.data.result;

    const education = await axios.get(
      `http://localhost:5000/users/${id}/education-info`,
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    info.education = education.data.result;

    const documents = await axios.get(
      `http://localhost:5000/users/${id}/documents`,
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    // setUserInfo({ ...userInfo, documents: documents.data.result });
    info.documents = documents.data.result;

    const contact = await axios.get(
      `http://localhost:5000/users/${id}/contact-info`,
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    info.contact = contact.data.result;

    setUserInfo(info);
  };
  const getage = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  console.log(userInfo);
  useEffect(() => {
    user.token && getUserInfo();
    user.token && getInterests();
  }, [user]);

  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      progress: undefined,
    });
  }

  const interestHandler = async () => {
    setIsLoading(true);
    const response = await axios.post(
      `http://localhost:5000/users/show-interest/${id}`,
      {},
      {
        headers: {
          Authorization: user.token && user.token,
        },
      }
    );
    if (response.status === 200) {
      notify("Interest shown successfully");
      setIsLoading(false);
      setIsInterested(true);
    }
  };

  const getInterests = async () => {
    const response = await axios.get(
      `http://localhost:5000/users/get-interests/${id}`,
      {
        headers: {
          Authorization: user.token && user.token,
        },
      }
    );
    if (response.status === 200) {
      if (response.data.result.length > 0) {
        setIsInterested(true);
      }
    }
  };

  return (
    <>
      <ProtectedRoute>
        <ToastContainer />
        <Layout>
          <div className={styles.container}>
            <div className={styles.container_1}>
              <div className={styles.image}>
                <img src={userInfo.documents?.profile || profile_img} alt='' />
              </div>
              <div className={styles.details}>
                <h2>{userInfo.basicInfo && userInfo.basicInfo.fullname}</h2>
                <p>
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  {userInfo.basicInfo && getage(userInfo.basicInfo.dob)}Yrs,{" "}
                  {userInfo.basicInfo && userInfo.basicInfo.height} Cms
                </p>
                <p>
                  <span>
                    <FontAwesomeIcon icon={faPlaceOfWorship} />
                  </span>
                  {userInfo.basicInfo && userInfo.basicInfo.religion}
                </p>

                <p>
                  <span>
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </span>
                  {userInfo.education && userInfo.education.degree}
                </p>

                <div className={styles.btn}>
                  {isLoading ? (
                    <button className={styles.interest}>Loading...</button>
                  ) : (
                    <button
                      disabled={isInterested}
                      className={`${styles.interest} ${
                        isInterested ? styles.disabled : ""
                      }`}
                      onClick={interestHandler}
                    >
                      <span style={{ color: isInterested ? "black" : "white" }}>
                        <FontAwesomeIcon icon={faHeart} />
                      </span>
                      {isInterested ? "Interest Shown" : "Show Interest"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.container_2}>
              <h2>Personal Information</h2>
              <div className={styles.data}>
                <div className={styles.details}>
                  <div className={styles.content}>
                    <h3>Basic Details</h3>
                    <p>
                      <span>Father's Name : </span>
                      {userInfo.basicInfo && userInfo.basicInfo.fathername}
                    </p>
                    <p>
                      <span>Mother's Name : </span>
                      {userInfo.basicInfo && userInfo.basicInfo.mothername}
                    </p>
                    <p>
                      <span>Weight : </span>
                      {userInfo.basicInfo && userInfo.basicInfo.weight}
                    </p>
                    <p>
                      <span>Body Type / Complexion : </span>
                      {userInfo.basicInfo && userInfo.basicInfo.complextion}
                    </p>
                    <p>
                      <span>Drinking / Smoking Habits : </span>
                      {userInfo.basicInfo && userInfo.basicInfo.habits}
                    </p>
                    <p>
                      <span>Number of siblings : </span>
                      {userInfo.basicInfo && userInfo.basicInfo.siblings}
                    </p>
                  </div>
                  <div className={styles.content}>
                    <h3>Contact Details</h3>
                    <div>
                      <p>
                        <span>Contact Number : </span>
                        {userInfo.contact && userInfo.contact.phone}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span>Parent's Contact : </span>
                        {userInfo.contact && userInfo.contact.parentsphone}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span>Address: </span>
                        {userInfo.contact && userInfo.contact.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.details}>
                  <h3>Education Details</h3>
                  <div>
                    <p>
                      <span>Name of University : </span>
                      {userInfo.education && userInfo.education.universityname}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Passing Year : </span>
                      {userInfo.education && userInfo.education.passingyear}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    </>
  );
}

export default UserProfile;
