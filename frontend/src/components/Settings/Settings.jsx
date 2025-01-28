import React, { useState } from "react";
import styles from "./Settings.module.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "Rahul Singh",
    email: "rahulsingh@gmail.com",
    mobile: "1234567890",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Changes saved successfully!");
  };

  const handleDelete = () => {
    alert("Account deleted!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Email id</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Mobile no.</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
      </div>
      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Delete Account
      </button>
    </div>
  );
};

export default Settings;
