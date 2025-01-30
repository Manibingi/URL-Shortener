import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClicks: 0,
    dateWiseClicks: [],
    deviceClicks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("all");

  useEffect(() => {
    fetchUrls();
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedUrl]);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/links/links",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setUrls(response.data.links);
    } catch (err) {
      console.error("Error fetching URLs:", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:8000/api/links/dashboard";
      if (selectedUrl !== "all") {
        url += `?urlId=${selectedUrl}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setStats({
        totalClicks: response.data.totalClicks,
        dateWiseClicks: response.data.dateWiseClicks,
        deviceClicks: response.data.deviceClicks,
      });
      console.log();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching statistics");
      setLoading(false);
    }
  };

  const renderBar = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className={styles.barContainer}>
        <div className={styles.bar} style={{ width: `${percentage}%` }} />
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading statistics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.filterSection}>
        <select
          className={styles.urlSelect}
          value={selectedUrl}
          onChange={(e) => setSelectedUrl(e.target.value)}
        >
          <option value="all">All URLs</option>
          {urls.map((url) => (
            <option key={url._id} value={url._id}>
              {url.shortUrl}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.totalClicksSection}>
        <span className={styles.totalClicksLabel}>Total Clicks</span>
        <span className={styles.totalClicksValue}>{stats.totalClicks}</span>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Date-wise Clicks</h2>
          <div className={styles.chartContent}>
            {stats.dateWiseClicks.map((item, index) => (
              <div key={index} className={styles.chartRow}>
                <div className={styles.label}>{item.date}</div>
                {renderBar(
                  item.clicks,
                  Math.max(...stats.dateWiseClicks.map((item) => item.clicks))
                )}
                <div className={styles.value}>{item.clicks}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Click Devices</h2>
          <div className={styles.chartContent}>
            {stats.deviceClicks.map((item, index) => (
              <div key={index} className={styles.chartRow}>
                <div className={styles.label}>{item.device}</div>
                {renderBar(
                  item.clicks,
                  Math.max(...stats.deviceClicks.map((item) => item.clicks))
                )}
                <div className={styles.value}>{item.clicks}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
