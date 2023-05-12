import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.scss";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StepRedirect from "../../components/StepRedirect";
import { AuthContext } from "../../context/context";
import { motion } from 'framer-motion';

function SignUp() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      name: yup.string().required(),
      email: yup.string().email().required(),
      gender: yup.string().required(),
      password: yup
        .string()
        .required("Password is mandatory!")
        .min(8, "Password must be at least 8 characters"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      progress: undefined,
    });
  }
  const onSubmit = async (data, e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users/auth/signup",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      notify(response.data.message + " You can login now!");
      setTimeout(() => {
        setIsLoading(false);
        navigate("/signin");
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
      <StepRedirect>
        <ToastContainer />
        <motion.div className={styles.wrapper}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100, transtion: { duration: 0.2 } }}
        >
          <div className={styles.image}></div>
          <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <h1>Create an account</h1>
              <div className={styles.item}>
                <input
                  type='text'
                  placeholder='Name'
                  {...register("name", { required: true })}
                />
                <p>{errors.name?.message}</p>
              </div>
              <div className={styles.item}>
                <input
                  type='text'
                  placeholder='Email'
                  {...register("email", { required: true })}
                />
                <p>{errors.email?.message}</p>
              </div>
              <div className={styles.item}>
                <select {...register("gender", { required: true })}>
                  <option defaultValue='RNS'>Select Gender</option>
                  <option value='M'>Male</option>
                  <option value='F'>Female</option>
                  <option value='RNS'>Rather Not Specify</option>
                </select>
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
                <button type='submit'>Create Account</button>
              )}

              <div className={styles.link}>
                <p>
                  Already have an account?
                  <a>
                    <Link to='/signin'>Sign In</Link>
                  </a>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </StepRedirect>
    </>
  );
}

export default SignUp;
