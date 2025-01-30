import React, { useEffect, useState } from "react";
import style from "./Settings.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchUser();
  }, []);
  // fetching the user data from the dackend
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/getUser",
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      const userData = response.data.user;
      setFormData({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
      });
    } catch (error) {
      console.log("Failed to fetch user data", error);
    }
  };

  // submitting the setting form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updateUser = {};
    if (formData.name) updateUser.name = formData.name;
    if (formData.email) updateUser.email = formData.email;
    if (formData.mobile) updateUser.mobile = formData.mobile;

    try {
      const response = await axios.put(
        "http://localhost:8000/api/auth/updateUser",
        updateUser,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      toast.success("Profile updated successfully!", {
        position: "top-right",
      });

      // If email is updated, logout user
      if (updateUser.email) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // delete the user
  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/auth/deleteUser",
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      toast.success("user account deleted successfully");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.log("error in deleting user account", error);
      toast.error("error in deleting user account");
    }
  };

  const resetForm = () => {
    setShowDeleteModel(false);
  };

  return (
    <>
      <div className={style.settingContainer}>
        <form onSubmit={handleFormSubmit} className={style.settingForm}>
          <div className={style.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              // placeholder="kumar"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="name">Email Id</label>
            <input
              type="email"
              name="email"
              // placeholder="kumar@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="name">Mobile No.</label>
            <input
              type="number"
              name="mobile"
              // placeholder="1234567890"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className={style.settingBtns}>
            <div>
              <button className={style.SaveBtn} type="submit">
                Save Changes
              </button>
            </div>
            <div>
              <button
                type="button"
                className={style.deleteBtn}
                onClick={() => setShowDeleteModel(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </form>
        {/* <div
          onClick={() => setShowDeleteModel(true)}
          className={style.DelAccountBtn}
        >
          <button className={style.deleteBtn}>Delete Account</button>
        </div> */}

        {showDeleteModel && (
          <div className={style.overlay}>
            <div className={style.deleteModel}>
              <span onClick={resetForm}>x</span>
              <div className={style.deleteContent}>
                <p> Are you sure, you want to Delete Account ? </p>
                <div className={style.deleteModelBtns}>
                  <button className={style.noBtn} onClick={resetForm}>
                    NO
                  </button>
                  <button className={style.yesBtn} onClick={deleteUser}>
                    YES
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
