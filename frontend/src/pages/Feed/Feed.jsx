import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import Preferences from "../../components/Preferences/Preferences";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import FeedCard from "../../components/FeedCard/FeedCard";
import { AuthContext } from "../../context/context";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";

function Feed() {
  const [view, setview] = useState(false);
  const [feed, setFeed] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [mapper, setMapper] = useState([]);
  const { user } = useContext(AuthContext);
  const viewHandler = () => {
    setview(true);
  };

  const closeHandler = () => {
    setview(false);
  };

  const getFeed = async () => {
    const response = await axios.get("http://localhost:5000/users", {
      headers: {
        Authorization: user.token,
      },
    });
    setFeed(response.data.result);
  };
  useEffect(() => {
    user.token && getFeed();
  }, [user.token]);
  useEffect(() => {
    if (filteredData.length === 0) {
      setMapper(feed);
    } else {
      setMapper(filteredData);
    }
  }, [feed, filteredData]);
  return (
    <ProtectedRoute>
      <ToastContainer />
      <Layout>
        {view ? (
          <Preferences
            onClose={closeHandler}
            setFilteredData={setFilteredData}
          />
        ) : null}
        <div className={styles.container}>
          <div className={styles.container_1}>
            <p>Browse Profiles</p>
            <div className={styles.btn}>
              <button onClick={viewHandler}>
                <span className={styles.filter}>
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <span className={styles.text}>Filter by Preferences</span>
              </button>
            </div>
          </div>
          <div className={styles.profiles}>
            {mapper.map((item) => {
              if (item.id !== user.user.id) {
                return <FeedCard key={item.id} user={item} />;
              }
            })}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export default Feed;
