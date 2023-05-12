import React, { useContext } from "react";
import styles from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/context";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).required(),
  })
  .required();

function Admin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { admin, setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      progress: undefined,
    });
  }
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/admin/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("admin-token", result.token);
        setAdmin({
          admin: result.data,
          isAuthenticated: true,
          token: result.token,
        });
        notify("Logged in successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 3000);
      } else {
        notify(result.message);
      }
    } catch (error) {
      notify(error.message);
    }
  };
  if (localStorage.getItem("admin-token")) {
    navigate("/admin-dashboard");
  }
  return (
    <>
      <ToastContainer />
      <div className={styles.mainContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <h1>Login As Admin</h1>
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
          <button type='submit'>Login</button>
        </form>
      </div>
    </>
  );
}

export default Admin;
