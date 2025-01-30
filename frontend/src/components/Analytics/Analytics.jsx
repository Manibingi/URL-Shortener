import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Analytics.module.css";
// import { toast } from "react-toastify";

const Analytics = () => {
  const [analyticData, setAnalyticData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AnalyticUrl(currentPage);
  }, [currentPage]);

  const AnalyticUrl = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/links/analytics?page=${page}&limit=5`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      setAnalyticData(response.data.clicks);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      // AnalyticUrl(currentPage);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className={style.container}>
        <h1>Analytics</h1>
        <div className={style.linksContainer}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className={style.tableContainer}>
              <thead className={style.tableHeader}>
                <tr>
                  <th>Timestamp</th>
                  <th className={style.originalLink}>Original Link</th>
                  <th className={style.shortLink}>Short Link</th>
                  <th>IP Address</th>
                  <th>User Device</th>
                </tr>
              </thead>

              <tbody>
                {analyticData.length > 0 ? (
                  analyticData.map((click, index) => (
                    <tr key={`${index}`} className={style.tableRow}>
                      <td>
                        {new Date(click.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td>
                        <div className={style.original}>
                          {click.destinationUrl}
                        </div>
                      </td>
                      <td>
                        <div className={style.short}>{click.shortUrl}</div>
                      </td>
                      <td className={style.remarks}>
                        {click.ipAddress || "N/A"}
                      </td>
                      <td className={style.remarks}>
                        {click.deviceType || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className={style.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Analytics;
