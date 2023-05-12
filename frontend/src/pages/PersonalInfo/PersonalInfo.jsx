import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../../components/Layout/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { AuthContext } from "../../context/context";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import StepRedirect from "../../components/StepRedirect";

const schema = yup
  .object({
    fullname: yup.string().required(),
    dob: yup.date().required(),
    complextion: yup.string().required(),
    weight: yup.number().required(),
    religion: yup.string().required(),
    fathername: yup.string().required(),
    mothername: yup.string().required(),
    habits: yup.string().required(),
    siblings: yup.number().required(),
    height: yup.number().required(),
    universityname: yup.string().required(),
    degree: yup.string().required(),
    passingyear: yup.number().required().min(1999).max(2050),
    phone: yup.number().required(),
    parentsphone: yup.number().required(),
    address: yup.string().required(),
  })
  .required();

function PersonalInfo() {
  const { user, verificationStep } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/users/verification/step/2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({
            ...data,
            dob: data.dob.toISOString().split("T")[0],
          }),
        }
      );
      const data1 = await response.json();
      if (response.status == 200) {
        notify(data1.message);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/document-verification");
        }, 3000);
      }
    } catch (error) {
      notify(error.message);
    }
  };
  function notify(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }
  if (verificationStep !== "1") {
    return <StepRedirect />;
  }
  return (
    <>
      <ProtectedRoute>
        <Layout>
          <ToastContainer />

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1>Fill the required details</h1>
            <div className={styles.maincontainer}>
              <h2>Personal Information</h2>
              <div className={styles.personalinfo}>
                <div className={styles.container_1}>
                  <div className={styles.item}>
                    <label>Fullname</label>
                    <input
                      type='text'
                      placeholder='Full name'
                      {...register("fullname", { required: true })}
                    />
                    <p>{errors.fullname?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Date of Birth</label>
                    <input
                      type='date'
                      {...register("dob", { required: true })}
                    />
                    <p>{errors.dob?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Body Type/Complexion</label>
                    <input
                      type='text'
                      placeholder='Complexion'
                      {...register("complextion", { required: true })}
                    />
                    <p>{errors.complextion?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Weight</label>
                    <input
                      type='number'
                      placeholder='in kgs'
                      {...register("weight", { required: true })}
                    />
                    <p>{errors.weight?.message}</p>
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
                </div>
                <div className={styles.container_1}>
                  <div className={styles.item}>
                    <label>Father's Name</label>
                    <input
                      type='text'
                      placeholder="Father's name"
                      {...register("fathername", { required: true })}
                    />
                    <p>{errors.fathername?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Mother's Name</label>
                    <input
                      type='text'
                      placeholder="Mother's name"
                      {...register("mothername", { required: true })}
                    />
                    <p>{errors.mothername?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Smoking/Drinking Habits</label>
                    <input
                      type='text'
                      placeholder='Habits'
                      {...register("habits", { required: true })}
                    />
                    <p>{errors.habits?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Number of Siblings</label>
                    <input
                      type='number'
                      placeholder='Number of siblings'
                      {...register("siblings", { required: true })}
                    />
                    <p>{errors.siblings?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Height</label>
                    <input
                      type='number'
                      placeholder='in cms'
                      {...register("height", { required: true })}
                    />
                    <p>{errors.height?.message}</p>
                  </div>
                </div>
              </div>
              <h2>Education</h2>
              <div className={styles.education}>
                <div className={styles.container_2}>
                  <div className={styles.item}>
                    <label>Name of University</label>
                    <input
                      type='text'
                      placeholder='Name of University'
                      {...register("universityname", { required: true })}
                    />
                    <p>{errors.universityname?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Degree</label>
                    <input
                      type='text'
                      placeholder='Degree'
                      {...register("degree", { required: true })}
                    />
                    <p>{errors.degree?.message}</p>
                  </div>
                </div>
                <div className={styles.container_2}>
                  <div className={styles.item}>
                    <label>Passing Year</label>
                    <input
                      type='number'
                      placeholder='YYYY'
                      {...register("passingyear", { required: true })}
                    />
                    <p>{errors.passingyear?.message}</p>
                  </div>
                </div>
              </div>
              <h2>Contact Details</h2>
              <div className={styles.contactdetails}>
                <div className={styles.container_3}>
                  <div className={styles.item}>
                    <label>Phone Number</label>
                    <input
                      type='tel'
                      placeholder='+91'
                      {...register("phone", { required: true })}
                    />
                    <p>{errors.phone?.message}</p>
                  </div>
                  <div className={styles.item}>
                    <label>Parent's Contact</label>
                    <input
                      type='tel'
                      placeholder='+91'
                      {...register("parentsphone", { required: true })}
                    />
                    <p>{errors.parentscontact?.message}</p>
                  </div>
                </div>
                <div className={styles.container_3}>
                  <div className={styles.item}>
                    <label>Address(City, State)</label>
                    <input
                      type='text'
                      placeholder='Address'
                      {...register("address", { required: true })}
                    />
                    <p>{errors.address?.message}</p>
                  </div>
                </div>
              </div>
              <div className={styles.btn}>
                {isLoading ? (
                  <button>Loading...</button>
                ) : (
                  <button type='submit'>Click Next</button>
                )}
              </div>
            </div>
          </form>
        </Layout>
      </ProtectedRoute>
    </>
  );
}

export default PersonalInfo;
