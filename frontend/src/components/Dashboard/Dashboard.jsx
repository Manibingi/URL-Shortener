import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import axios from "axios";
// import { toast } from "react-toastify";

const Dashboard = () => {
  // const [links, setLinks] = useState([]);
  const [clickData, setClickData] = useState({
    totalClicks: 0,
    dailyClicks: [],
  });

  const fetchClickStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/links/links",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setClickData(response.data);
      console.log(clickData);
    } catch (err) {
      console.error("Error fetching click stats:", err);
    }
  };

  useEffect(() => {
    fetchClickStats();
  }, []);

  return (
    <>
      <div className={styles.container}>
        {/* Main Content */}
        <main className={styles.main}>
          {/* Stats Section */}
          <section className={styles.statsSection}>
            <h2 className={styles.totalClicks}>Total Clicks: 1234</h2>

            <div className={styles.statsGrid}>
              {/* Date-wise Clicks */}
              <div className={styles.statsCard}>
                <h3>Date-wise Clicks</h3>
                <ul className={styles.clicksList}>
                  <li>
                    <span>21-01-25</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "80%" }}
                    ></div>
                    <span>1234</span>
                  </li>
                  <li>
                    <span>20-01-25</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "70%" }}
                    ></div>
                    <span>1140</span>
                  </li>
                  <li>
                    <span>19-01-25</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "20%" }}
                    ></div>
                    <span>134</span>
                  </li>
                  <li>
                    <span>18-01-25</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "5%" }}
                    ></div>
                    <span>34</span>
                  </li>
                </ul>
              </div>

              {/* Click Devices */}
              <div className={styles.statsCard}>
                <h3>Click Devices</h3>
                <ul className={styles.clicksList}>
                  <li>
                    <span>Mobile</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "50%" }}
                    ></div>
                    <span>134</span>
                  </li>
                  <li>
                    <span>Desktop</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "20%" }}
                    ></div>
                    <span>40</span>
                  </li>
                  <li>
                    <span>Tablet</span>
                    <div
                      className={styles.progressBar}
                      style={{ width: "5%" }}
                    ></div>
                    <span>3</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ul>
        {clickData.dailyClicks.map((entry, index) => (
          <li key={index}>
            {entry.date}: {entry.count} clicks
          </li>
        ))}
      </ul>
    </>
  );
};

export default Dashboard;
