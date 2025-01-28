import React, { useEffect, useState } from "react";
import style from "./Links.module.css";
import axios from "axios";
import { toast } from "react-toastify";
// import { useOutletContext } from 'react-router-dom';
import { useAppContext } from "../../components/AppContext";

import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const Links = () => {
  const [links, setLinks] = useState([]);

  // usestate for date and time handle
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { showCreateForm } = useAppContext();

  const [createUrl, setCreateUrl] = useState({
    destinationUrl: "",
    remarks: "",
  });

  const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl({ ...createUrl, [name]: value });
  };

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/links/links",
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Url created successfully");
      }
    } catch (error) {
      console.log("error in creating url:", error);
      toast.error("error in creating url");
    }
  };

  const updateId = (item) => {
    setIsUpdating(true);

    console.log(item.destinationUrl);
    setCreateUrl({
      destinationUrl: item.destinationUrl,
      remarks: item.remarks,
      id: item._id,
    });
  };

  const handleUpdateCreateUrl = async (id) => {
    // e.preventDefault();
    console.log(id);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/links/links/${id}`,
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Url updated successfully");
      }
      setIsUpdating(false);
    } catch (error) {
      console.log("error in updating the Url", error);
      toast.error("Error updating the Url");
    }
  };

  // Format the date and time
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
  // create new url end

  // console.log(linkId)
  useEffect(() => {
    LinkUrl();
  }, []);

  // fecthing the url from the backend
  const LinkUrl = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/links/links",
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data);
      setLinks(response.data.data);
      console.log(links);
    } catch (error) {
      console.log(error);
    }
  };

  // updating the url to the backend

  // deleting the url
  const deleteUrl = async (id) => {
    // setLinkId(id)
    console.log(id);
    try {
      await axios.delete(`http://localhost:8000/api/links/links/${id}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      // Remove deleted folder from the list
      const updatedDashboardLink = links.filter((url) => url._id !== id);
      setLinks(updatedDashboardLink); // Update the state
      //  setConfirmDeleteModel(false);
      toast.success("Url deleted successfully");
    } catch (error) {
      console.error("Error deleting Url:", error);
      toast.error("Error deleting Url");
    }
  };

  return (
    <>
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>Remarks</th>
              <th>Clicks</th>
              <th>status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {links.map((item, index) => (
              <tr key={index}>
                <td>
                  {new Date(item.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className={style.data}>{item.destinationUrl}</td>
                <td>{item.shortUrl}</td>
                <td>{item.remarks}</td>
                <td>{item.clickCount}</td>

                <td
                  className={
                    item.createdAt !== item.expiryDate
                      ? style.status
                      : style.inactive
                  }
                >
                  {item.status}
                </td>
                <td>
                  <button onClick={() => updateId(item)}>edit</button> ||{" "}
                  <button onClick={() => deleteUrl(item._id)}>del</button>
                </td>
              </tr>
            ))}
            ;
          </tbody>
        </table>
      </div>

      {/* create nre url model */}

      {isUpdating ? (
        <div className={style.Createlinks_container}>
          <form onSubmit={() => handleUpdateCreateUrl(createUrl.id)}>
            <div className={style.destination_input}>
              <label htmlFor="destinationurl">
                Destination Url <span>*</span>
              </label>{" "}
              <br />
              <input
                type="text"
                name="destinationUrl"
                value={createUrl.destinationUrl}
                onChange={handleCreateUrl}
                placeholder="https://web.whatsapp.com/"
              />
            </div>
            <div className={style.remarks_input}>
              <label htmlFor="remarks">
                Remarks <span>*</span>
              </label>{" "}
              <br />
              <textarea
                name="remarks"
                id="remarks"
                value={createUrl.remarks}
                onChange={handleCreateUrl}
              >
                Add remarks
              </textarea>
            </div>

            <div className={style.toggle}>
              <p>Link Expiration</p>
              <p>toggle</p>
            </div>
            {/* Date and Time Picker */}
            <div className="date_time_container">
              <div className="date_time_display">
                {/* Display formatted date */}
                <input
                  type="text"
                  value={formatDate(selectedDate)}
                  readOnly
                  className="date_display"
                />
                {/* Calendar icon to toggle DatePicker */}
                <FiCalendar
                  className="calendar_icon"
                  onClick={() => setShowDatePicker((prev) => !prev)}
                />
              </div>

              {showDatePicker && (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    // setShowDatePicker(false); // Close the calendar after selecting a date
                  }}
                  // showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  inline // Show inline calendar
                  className="datepicker"
                />
              )}
            </div>

            <div className={style.createUrl_Btns}>
              <button className={style.createBtn} type="submit">
                Save
              </button>
              <button className={style.clearBtn}>Clear</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {showCreateForm && (
            <div className={style.Createlinks_container}>
              <form onSubmit={handleCreateUrlSubmit}>
                <div className={style.destination_input}>
                  <label htmlFor="destinationurl">
                    Destination Url <span>*</span>
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    name="destinationUrl"
                    value={createUrl.destinationUrl}
                    onChange={handleCreateUrl}
                    placeholder="https://web.whatsapp.com/"
                  />
                </div>
                <div className={style.remarks_input}>
                  <label htmlFor="remarks">
                    Remarks <span>*</span>
                  </label>{" "}
                  <br />
                  <textarea
                    name="remarks"
                    id="remarks"
                    value={createUrl.remarks}
                    onChange={handleCreateUrl}
                  >
                    Add remarks
                  </textarea>
                </div>

                <div className={style.toggle}>
                  <p>Link Expiration</p>
                  <p>toggle</p>
                </div>
                {/* Date and Time Picker */}
                <div className="date_time_container">
                  <div className="date_time_display">
                    {/* Display formatted date */}
                    <input
                      type="text"
                      value={formatDate(selectedDate)}
                      readOnly
                      className="date_display"
                    />
                    {/* Calendar icon to toggle DatePicker */}
                    <FiCalendar
                      className="calendar_icon"
                      onClick={() => setShowDatePicker((prev) => !prev)}
                    />
                  </div>

                  {showDatePicker && (
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        // setShowDatePicker(false); // Close the calendar after selecting a date
                      }}
                      // showTimeSelect
                      dateFormat="Pp"
                      minDate={new Date()}
                      inline // Show inline calendar
                      className="datepicker"
                    />
                  )}
                </div>

                <div className={style.createUrl_Btns}>
                  <button className={style.createBtn} type="submit">
                    Create new
                  </button>
                  <button className={style.clearBtn}>Clear</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Links;
