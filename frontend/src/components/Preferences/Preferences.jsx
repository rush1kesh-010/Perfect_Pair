import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Backdrop(props) {
  return <div className={styles.backdrop} onClick={props.onClose}></div>;
}

function ModalOverlay(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const filterHandler = async (data) => {
    const response = await axios.get(
      `http://localhost:5000/users/filter?age=${data.age}&religion=${data.religion}&gender=${data.gender}`
    );
    props.setFilteredData(await response.data.result);
    if (response.data.result.length === 0) {
      function notify(message) {
        toast(message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          progress: undefined,
        });
      }
      notify("No results found");
    }
    props.onClose();
  };

  const onSubmit = (data) => filterHandler(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1>Choose Your Preferences</h1>
      <div className={styles.Container}>
        <div className={styles.item}>
          <label>Gender</label>
          <select {...register("gender", { required: true })}>
            <option defaultValue='RNS'>Select Gender</option>
            <option value='M'>Male</option>
            <option value='F'>Female</option>
            <option value='RNS'>Reither Not Specify</option>
          </select>
        </div>
        <div className={styles.item}>
          <label>Religion</label>
          <select {...register("religion", { required: true })}>
            <option defaultValue='atheist'>Select Religion</option>
            <option value='hindu'>Hindu</option>
            <option value='muslim'>Muslim</option>
            <option value='christian'>Christian</option>
            <option value='jain'>Jain</option>
            <option value='buddhist'>Buddhist</option>
            <option value='atheist'>Atheist</option>
          </select>
        </div>
        <div className={styles.item}>
          <label>Age Range</label>
          <select {...register("age", { required: true })}>
            <option defaultValue='18-25'>Select Age Range</option>
            <option value='18-25'>18-25</option>
            <option value='25-35'>25-35</option>
            <option value='35-45'>35-45</option>
            <option value='45-55'>45-55</option>
            <option value='55-65'>55-65</option>
          </select>
        </div>
      </div>
      <div className={styles.btn}>
        <button>Search</button>
      </div>
    </form>
  );
}

function Preferences(props) {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onClose={props.onClose}
          setFilteredData={props.setFilteredData}
        />,
        document.getElementById("overlay-root")
      )}
    </>
  );
}

export default Preferences;
