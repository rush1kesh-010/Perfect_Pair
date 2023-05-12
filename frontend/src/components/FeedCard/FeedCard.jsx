import React, { useContext } from "react";
import styles from "./styles.module.scss";
import profile_img from "../../assets/demo_profile.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/context";

function FeedCard({ user }) {
  const { admin } = useContext(AuthContext);
  const age = new Date().getFullYear() - new Date(user.dob).getFullYear() - 1;
  let gender;
  if (user.gender == "M") {
    gender = "Male";
  } else if (user.gender == "F") {
    gender = "Female";
  } else {
    gender = "Rather Not Specify";
  }
  return (
    <div className={styles.container}>
      <img src={user.profile ? user.profile : profile_img} alt='feed' />
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.name}>
            <p>{user.name}</p>
          </div>
          <p>{age} Yrs</p>
          <p>{gender}</p>
          <p>{user.religion}</p>
          <p>{user.address}</p>
        </div>
        <div className={styles.btn}>
          <Link to={admin ? `/admin/profile/${user.id}` : `/profile/${user.id}`}>
            <button>
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span className={styles.text}>View Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
