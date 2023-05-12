import React, { useContext } from "react";
import styles from "./styles.module.scss";
import logo_img from "../../assets/Home-Logo.svg";
import profile_img from "../../assets/profile.png";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/context";
import { motion } from 'framer-motion';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <motion.div className={styles.container}
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      exit={{ x: window.innerWidth, transition: { duration: 0.25 } }}
    >
      <div className={styles.container_1}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={logo_img} alt='Perfect Pair' />
          </div>
          {user.isAuthenticated ? (
            <div className={styles.items}>
              <a>Home</a>
              <a>About Us</a>
              {user.isAuthenticated ? (
                <img src={profile_img} />
              ) : (
                <button>Get Started</button>
              )}
            </div>
          ) : (
            <div className={styles.items}>
              <a>
                <Link to='/signin'>Sign In</Link>
              </a>
              <a>
                <Link to='/signup'>Sign Up</Link>
              </a>
              <a>
                <Link to='/admin'>Admin</Link>
              </a>
            </div>
          )}
        </div>
        <div>
          <div className={styles.content}>
            <h1>Live your life happily</h1>
            <div className={styles.details}>
              <p>The World's No.1 Matrimonial Service</p>
              <p>Search by Age, Profession & Community.</p>
            </div>
            <div className={styles.btn}>
              <NavLink to='signin'>
                <button>Get Started</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
