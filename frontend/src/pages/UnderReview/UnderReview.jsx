import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import StepRedirect from "../../components/StepRedirect";
import styles from "./styles.module.scss";

export default function UnderReview() {
  return (
    <ProtectedRoute>
      <StepRedirect>
        <div className={styles.header}>
          <div>
            <p className={styles.message}>Your Profile is under review,</p>
          </div>
          <div>
            <p className={styles.message}>
              Hold on while our admins review it!
            </p>
          </div>
        </div>
      </StepRedirect>
    </ProtectedRoute>
  );
}
