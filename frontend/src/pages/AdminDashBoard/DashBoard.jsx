import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProtectedRoute from "../../components/AdminProtectedRoute";
import FeedCard from "../../components/FeedCard/FeedCard";
import styles from "./styles.module.scss";

function DashBoard() {
  const [underReviewUsers, setUnderReviewUsers] = useState([]);
  const navigate = useNavigate();
  const getUnderReviewUsers = async () => {
    const token = await localStorage.getItem("admin-token");
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/non-verified-users",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setUnderReviewUsers(response.data.users);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUnderReviewUsers();
  }, []);

  return (
    <AdminProtectedRoute>
      <div className={styles.Container}>
        <div className={styles.Container_1}>
          <div className={styles.btn}>
            <button
              onClick={() => {
                localStorage.removeItem("admin-token");
                navigate("/admin");
              }}
            >
              Logout
            </button>
          </div>
          <div className={styles.intro}>
            <p>Hello, admin@gmail.com</p>
          </div>
          <h1>Recent Requests For Review</h1>
        </div>
        <div className={styles.Container_2}>
          <div className={styles.profiles}>
            {underReviewUsers.length == 0 ? (
              <p className={styles.norequests}>No Requests are Available.</p>
            ) : (
              underReviewUsers.map((user) => {
                return <FeedCard user={user} />;
              })
            )}
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

export default DashBoard;
