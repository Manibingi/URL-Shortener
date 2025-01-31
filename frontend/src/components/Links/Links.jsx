import React, { useCallback, useEffect, useState } from "react";
import styles from "./Links.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "../../components/AppContext";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const Links = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [links, setLinks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { showCreateForm, setShowCreateForm, searchTerm } = useAppContext();
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expiryDate, setexpiryDate] = useState(null);
  // const [expirationDate, setExpirationDate] = useState(null);

  const [createUrl, setCreateUrl] = useState({
    destinationUrl: "",
    remarks: "",
    expiryDate: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Status
  const isUrlExpired = useCallback((expiryDate) => {
    if (!expiryDate) return false;
    return new Date() > new Date(expiryDate);
  }, []);

  const getStatus = useCallback(
    (url) => {
      if (url.status === "Inactive") return "Inactive";
      if (isUrlExpired(url.expirationDate)) return "Inactive";
      return "Active";
    },
    [isUrlExpired]
  );

  // Handle toggle change
  const handleToggleChange = (e) => {
    const isChecked = e.target.checked;
    setExpirationEnabled(isChecked);
    if (!isChecked) {
      setexpiryDate(null);
      setCreateUrl((prev) => ({
        ...prev,
        expiryDate: null,
      }));
    } else {
      // Set default expiration to selected date when enabling
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 24); // Set default to 24 hours from now
      setexpiryDate(defaultDate);
      setSelectedDate(defaultDate);
      setCreateUrl((prev) => ({
        ...prev,
        expiryDate: defaultDate,
      }));
    }
  };

  // Modify your existing date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    if (expirationEnabled) {
      setexpiryDate(date);
      setCreateUrl((prev) => ({
        ...prev,
        expiryDate: date,
      }));
    }
  };

  const filteredRemarks = links.filter((item) =>
    item.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchLinks(currentPage);
    const interval = setInterval(fetchLinks, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [currentPage]);

  const fetchLinks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/links/links?page=${page}&limit=5`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const updatedLinks = response.data.links.map((link) => ({
        ...link,
        status: getStatus(link),
      }));

      setLinks(updatedLinks);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      // fetchLinks(currentPage);
      // console.log(response.data.links);
    } catch (error) {
      if (filteredRemarks.length > 0) {
        toast.error("Error fetching links");
      }
    }
    setLoading(false);
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
      const payload = {
        destinationUrl: createUrl.destinationUrl,
        remarks: createUrl.remarks,
        expiryDate: expirationEnabled ? selectedDate : null,
      };

      const response = await axios.post(`${apiUrl}/api/links/links`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data) {
        toast.success("URL created successfully");
        resetForm();
        fetchLinks();
      }
    } catch (error) {
      toast.error("Error creating URL");
    }
  };

  const handleUpdateCreateUrl = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/api/links/links/${currentId}`,
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
          expiryDate: expirationEnabled ? selectedDate : null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // console.log(response.data);
      if (response.data.data.status === "Active") {
        toast.success("URL updated and activated successfully");
      } else {
        toast.success("URL updated successfully");
      }

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
      expiryDate: item.expiryDate,
    });

    const hasExpiration = !!item.expiryDate;
    setExpirationEnabled(hasExpiration);

    if (hasExpiration) {
      const expDate = new Date(item.expiryDate);
      setSelectedDate(expDate);
      setexpiryDate(expDate);
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 24);
      setSelectedDate(defaultDate);
    }

    setShowCreateForm(true);
  };

  const deleteID = (item) => {
    setDeleteId(item._id);
    setShowDeleteModel(true);
  };

  const deleteUrl = async () => {
    try {
      await axios.delete(`${apiUrl}/api/links/links/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLinks((prev) => prev.filter((url) => url._id !== deleteId));
      setShowDeleteModel(false);
      toast.success("URL deleted successfully");
      // resetForm();
      fetchLinks();
    } catch (error) {
      toast.error("Error deleting URL");
    }
  };

  const resetForm = () => {
    setCreateUrl({ destinationUrl: "", remarks: "", expiryDate: null });
    setIsEditing(false);
    setShowCreateForm(false);
    setCurrentId(null);
    setShowDeleteModel(false);
    setDeleteId(null);
    setExpirationEnabled(false);
    setexpiryDate(null);
    setSelectedDate(new Date());
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
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
    <>
      {filteredRemarks.length > 0 ? (
        <div className={styles.container}>
          <h1>Links</h1>
          <div className={styles.linksContainer}>
            {loading ? (
              <p>Loading...</p>
            ) : (
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
                  {filteredRemarks.map((item) => (
                    <tr key={item._id} className={styles.tableRow}>
                      <td>{formatDate(new Date(item.createdAt))}</td>
                      <td>
                        <div className={styles.original}>
                          {item.destinationUrl}
                        </div>
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
                            item.status === "Active"
                              ? styles.active
                              : styles.inactive
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
                          onClick={() => deleteID(item)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showDeleteModel && (
            <div className={styles.overlay}>
              <div className={styles.deleteModel}>
                <span onClick={resetForm}>x</span>
                <div className={styles.deleteContent}>
                  <p> Are you sure, you want to Delete ? </p>
                  <div className={styles.deleteModelBtns}>
                    <button className={styles.noBtn} onClick={resetForm}>
                      NO
                    </button>
                    <button className={styles.yesBtn} onClick={deleteUrl}>
                      YES
                    </button>
                  </div>
                </div>
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
      ) : (
        <p>No results found.</p>
      )}

      {showCreateForm && (
        <div className={styles.createContainer}>
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
                // className={styles.createForm}
              >
                <div className={styles.input_style}>
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
                      <input
                        type="checkbox"
                        checked={expirationEnabled}
                        onChange={handleToggleChange}
                      />
                      <span
                        className={`${styles.slider} ${styles.round}`}
                      ></span>
                    </label>
                  </div>

                  {expirationEnabled ? (
                    <div className={styles.dateTimeContainer}>
                      <div className={styles.datePickerWrapper}>
                        <input
                          type="text"
                          value={expiryDate ? formatDate(expiryDate) : ""}
                          readOnly
                          className={styles.dateDisplay}
                          onClick={() => setShowDatePicker(true)}
                        />
                        <FiCalendar
                          className={styles.calendarIcon}
                          onClick={() => setShowDatePicker(true)}
                          // onClick={() => setShowDatePicker((prev) => !prev)}
                        />
                      </div>
                      {showDatePicker && (
                        <div className={styles.datePickerPopup}>
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            minDate={new Date()}
                            inline
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.emptyHeight}></div>
                  )}

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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Links;
