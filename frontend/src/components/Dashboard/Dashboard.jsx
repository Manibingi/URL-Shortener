import React from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Dashboard = () => {
  return (
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
  );
};

export default Dashboard;
