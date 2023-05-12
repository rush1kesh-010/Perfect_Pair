import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import { ToastContainer, toast } from "react-toastify";
import profile_img from "../../assets/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPlaceOfWorship,
  faGraduationCap,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function ProfilesForAdmin() {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState(undefined);
  const { id } = useParams();
  const getUserInfo = async () => {
    const response = await axios.get(
      `http://localhost:5000/admin/user-profile/${id}`,
      {
        headers: {
          Authorization: localStorage.getItem("admin-token"),
        },
      }
    );

    setUserInfo(response.data.user);
    setRequestStatus(response.data.user.step);
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
  useEffect(() => {
    getUserInfo();
  }, []);

  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      progress: undefined,
    });
  }
  const approveHandler = async () => {
    const response = await axios.post(
      `http://localhost:5000/admin/approve-user/${id}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("admin-token"),
        },
      }
    );
    if (response.status === 200) {
      setRequestStatus("4");
    }
  };
  const rejectHandler = async () => {
    const response = await axios.post(
      `http://localhost:5000/admin/reject-request/${id}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("admin-token"),
        },
      }
    );
    if (response.status === 200) {
      notify("Request Rejected");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 3000);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.container_1}>
          <div className={styles.image}>
            <img src={(userInfo && userInfo.profile) || profile_img} alt='' />
          </div>
          <div className={styles.details}>
            <h2>{userInfo && userInfo.fullname}</h2>
            <p>
              <span>
                <FontAwesomeIcon icon={faUser} />
              </span>
              {userInfo && getage(userInfo.dob)}Yrs,{" "}
              {userInfo && userInfo.height} Cms
            </p>
            <p>
              <span>
                <FontAwesomeIcon icon={faPlaceOfWorship} />
              </span>
              {userInfo && userInfo.religion}
            </p>

            <p>
              <span>
                <FontAwesomeIcon icon={faGraduationCap} />
              </span>
              {userInfo && userInfo.degreeInfo}
            </p>
            {
              <div className={styles.btn}>
                <button
                  disabled={requestStatus == "4"}
                  className={`${styles.approve} ${
                    requestStatus == "4" ? styles.disabled : ""
                  }`}
                  onClick={approveHandler}
                >
                  <span>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  {requestStatus == "4" ? "Approved" : "Approve"}
                </button>
                {requestStatus != "4" && (
                  <button className={styles.reject} onClick={rejectHandler}>
                    <span>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                    Reject
                  </button>
                )}
              </div>
            }
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
                  {userInfo && userInfo.fathername}
                </p>
                <p>
                  <span>Mother's Name : </span>
                  {userInfo && userInfo.mothername}
                </p>
                <p>
                  <span>Weight : </span>
                  {userInfo && userInfo.weight}
                </p>
                <p>
                  <span>Body Type / Complextion : </span>
                  {userInfo && userInfo.complextion}
                </p>
                <p>
                  <span>Drinking / Smoking Habits : </span>
                  {userInfo && userInfo.habits}
                </p>
                <p>
                  <span>Number of siblings : </span>
                  {userInfo && userInfo.siblings}
                </p>
              </div>
              <div className={styles.content}>
                <h3>Contact Details</h3>
                <div>
                  <p>
                    <span>Contact Number : </span>
                    {userInfo && userInfo.phone}
                  </p>
                </div>
                <div>
                  <p>
                    <span>Parent's Contact : </span>
                    {userInfo && userInfo.parentsphone}
                  </p>
                </div>
                <div>
                  <p>
                    <span>Address: </span>
                    {userInfo && userInfo.address}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <h3>Education Details</h3>
              <div>
                <p>
                  <span>Name of University : </span>
                  {userInfo && userInfo.universityname}
                </p>
              </div>
              <div>
                <p>
                  <span>Passing Year : </span>
                  {userInfo && userInfo.passingyear}
                </p>
              </div>
            </div>
          </div>

          <h3>Uploaded Documents</h3>
          <div className={styles.documents}>
            <img src={userInfo?.identity || profile_img} />
            <img src={userInfo?.degree || profile_img} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilesForAdmin;
