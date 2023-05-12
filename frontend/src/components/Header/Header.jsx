import React, { useEffect, useState } from "react";
import profile_img from "../../assets/profile.png";
import logo_img from "../../assets/Logo.png";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/context";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const { user, setUser, setVerificationStep } = useContext(AuthContext);
  const [profile, setProfile] = useState(profile_img);

  const navigate = useNavigate();
  const getProfilePhoto = async () => {
    const res = await fetch(
      `http://localhost:5000/users/${user.user.id}/documents`,
      {
        method: "GET",
        headers: {
          Authorization: user.token,
        },
      }
    );
    const data = await res.json();
    if (data.result.profile) {
      setProfile(data.result.profile);
    }
  };
  useEffect(() => {
    getProfilePhoto();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to='/'>
          <img src={logo_img} alt='Perfect Pair' />
        </Link>
      </div>
      <div className={styles.items}>
        <a>Home</a>
        <a>About Us</a>
        <a
          onClick={() => {
            localStorage.removeItem("token");

            window.location.reload();
          }}
        >
          Logout
        </a>
        {user.isAuthenticated ? (
          <img
            src={profile}
            onClick={() => {
              // window.localStorage.clear();
              // setUser({
              //   isAuthenticated: false,
              //   token: null,
              //   user: null,
              // });
              // setVerificationStep(-1);
              // navigate("/signin");
              navigate("/profile/" + user.user.id);
            }}
          />
        ) : (
          <button>Get Started</button>
        )}
      </div>
    </div>
  );
}

export default Header;
