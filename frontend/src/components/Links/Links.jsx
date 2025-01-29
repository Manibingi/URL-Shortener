import React, { useEffect, useState } from "react";
import styles from "./Links.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "../../components/AppContext";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const { showCreateForm, setShowCreateForm } = useAppContext();
  const [createUrl, setCreateUrl] = useState({
    destinationUrl: "",
    remarks: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLinks(currentPage);
  }, [currentPage]);

  const fetchLinks = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/links/links?page=${page}&limit=5`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLinks(response.data.links);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      // fetchLinks(currentPage);
      console.log(response.data.links);
    } catch (error) {
      toast.error("Error fetching links");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/links/links",
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("URL created successfully");
      resetForm();
      fetchLinks();
    } catch (error) {
      toast.error("Error creating URL");
    }
  };

  const handleUpdateCreateUrl = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/links/links/${currentId}`,
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("URL updated successfully");
      resetForm();
      fetchLinks();
    } catch (error) {
      toast.error("Error updating URL");
    }
  };

  const updateId = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setCreateUrl({
      destinationUrl: item.destinationUrl,
      remarks: item.remarks,
    });
    setShowCreateForm(true);
  };

  const deleteUrl = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/links/links/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLinks((prev) => prev.filter((url) => url._id !== id));
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error("Error deleting URL");
    }
  };

  const resetForm = () => {
    setCreateUrl({ destinationUrl: "", remarks: "" });
    setIsEditing(false);
    setShowCreateForm(false);
    setCurrentId(null);
  };

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied successfully!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Links</h1>
      <div className={styles.linksContainer}>
        <table className={styles.tableContainer}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Date</th>
              <th className={styles.originalLink}>Original Link</th>
              <th className={styles.shortLink}>Short Link</th>
              <th>Remarks</th>
              <th>Clicks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {links.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td>{formatDate(new Date(item.createdAt))}</td>
                <td>
                  <div className={styles.original}>{item.destinationUrl}</div>
                </td>
                <td className={styles.shortEdit}>
                  <div className={styles.short}>{item.shortUrl}</div>
                  <span
                    className={styles.copyIcon}
                    onClick={() => handleCopy(item.shortUrl)}
                  >
                    📋
                  </span>
                </td>
                <td className={styles.remarks}>{item.remarks}</td>
                <td className={styles.clicks}>{item.clickCount}</td>
                <td className={styles.status}>
                  <span
                    className={
                      item.status === "Active" ? styles.active : styles.inactive
                    }
                  >
                    {item.status}
                  </span>
                </td>
                <td className={styles.btns}>
                  <button
                    className={styles.editButton}
                    onClick={() => updateId(item)}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteUrl(item._id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateForm && (
        <div className={styles.createLinkModel}>
          <div className={styles.CreatelinksContainer}>
            <div className={styles.createLinkhead}>
              <span className={styles.newSpan}>
                {isEditing ? "Edit Link" : "New Link"}
              </span>
              <span className={styles.crossSpan} onClick={resetForm}>
                X
              </span>
            </div>
            <form
              onSubmit={
                isEditing ? handleUpdateCreateUrl : handleCreateUrlSubmit
              }
              className={styles.createForm}
            >
              <div className={styles.Urlinput}>
                <label htmlFor="originalUrl">
                  Destination URL <span>*</span>
                </label>
                <input
                  type="text"
                  name="destinationUrl"
                  value={createUrl.destinationUrl}
                  onChange={handleCreateUrl}
                  placeholder="https://web.whatsapp.com/"
                  required
                />
              </div>
              <div className={styles.Urlinput}>
                <label htmlFor="remarks">
                  Remarks <span>*</span>
                </label>
                <textarea
                  name="remarks"
                  value={createUrl.remarks}
                  onChange={handleCreateUrl}
                  placeholder="Add remarks"
                  required
                />
              </div>

              <div className={styles.toggle}>
                <p>Link Expiration</p>
                <label className={styles.switch}>
                  <input type="checkbox" />
                  <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
              </div>

              <div className={styles.dateTimeContainer}>
                <input
                  type="text"
                  value={formatDate(selectedDate)}
                  readOnly
                  className="dateDisplay"
                />
                <FiCalendar
                  className={styles.calendar_icon}
                  onClick={() => setShowDatePicker((prev) => !prev)}
                />
                {showDatePicker && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    dateFormat="Pp"
                    minDate={new Date()}
                    inline
                  />
                )}
              </div>

              <div className={styles.createUrlBtns}>
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={resetForm}
                >
                  Clear
                </button>
                <button type="submit" className={styles.createBtn}>
                  {isEditing ? "Save" : "Create new"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className={styles.pagination}>
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
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Links;
