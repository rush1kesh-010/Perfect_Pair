import { useForm } from "react-hook-form";
import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/context";
import * as yup from "yup";
import StepRedirect from "../../components/StepRedirect";
import { motion } from 'framer-motion';


const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).required(),
  })
  .required();

function SignIn() {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }
  const onSubmit = async (data, e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      notify(response.data.message);
      // console.log(response.data);
      // console.log(user);
      setUser({
        user: await response.data.user,
        isAuthenticated: true,
        token: await `Bearer ${response.data.token}`,
      });
      await window.localStorage.setItem(
        "token",
        `Bearer ${response.data.token}`
      );
      setTimeout(() => {
        setIsLoading(false);
        navigate("/email-verification");
      }, 3500);
    } catch (err) {
      notify(err.response.data.message);
    }
  };
  if (user.isAuthenticated) {
    return <StepRedirect />;
  }

  return (
    <>
      <ToastContainer />
      <motion.div className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      >
        <div className={styles.container}>
          <form className={styles.form}>
            <h1>Signin to your account</h1>
            <div className={styles.item}>
              <input
                type='text'
                placeholder='Email'
                {...register("email", { required: true })}
              />
              <p>{errors.email?.message}</p>
            </div>
            <div className={styles.item}>
              <input
                type='password'
                name='password'
                {...register("password", { required: true })}
                placeholder='Password'
              />
              <p>{errors.password?.message}</p>
            </div>

            {isLoading ? (
              <button>Loading...</button>
            ) : (
              <button type='submit'>Signin Now</button>
            )}

            <div className={styles.link}>
              <p>
                Don't Have an Account?
                <a>
                  <Link to='/signup'>Sign Up</Link>
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className={styles.image}></div>
      </motion.div>
    </>
  );
}
export default SignIn;
