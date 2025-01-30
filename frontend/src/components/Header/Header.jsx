import React, { useEffect, useState } from "react";
import style from "./Header.module.css";
import axios from "axios";
import logo from "../../assets/cuvette.svg";
import { toast } from "react-toastify";
import { useAppContext } from "../../components/AppContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { toggleCreateLink } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");

  const { searchTerm, setSearchTerm } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [greeting]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/getUser",
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      const userData = response.data.user;
      setName({
        name: userData.name,
      });
    } catch (error) {
      console.log("Failed to fetch user data", error);
    }

    if (d.getHours() >= 0 && d.getHours() < 12) {
      setGreeting("morning");
    }
    if (d.getHours() >= 12 && d.getHours() < 16) {
      setGreeting("afternoon");
    } else {
      setGreeting("evening");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("user Logged out successfully");
    navigate("/login");
    setShowLogout(false);
  };

  const d = new Date();
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const year = d.getFullYear().toString().slice(-2);

  const formattedDate = `${day}, ${month} ${year}`;

  return (
    <>
      <div className={style.navbar}>
        <div className={style.logo}>
          <img src={logo} alt="Logo.png" />
        </div>
        <div className={style.rightNavbar}>
          <div className={style.profileName}>
            <span>☀️</span>
            <div>
              <span>
                Good {greeting}, {name.name}
              </span>
              <p>{formattedDate}</p>
            </div>
          </div>
          <div className={style.navActon}>
            <button className={style.createButton} onClick={toggleCreateLink}>
              + Create new
            </button>
            <div className={style.search}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search by remarks"
                className={style.navSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {showLogout && (
              <div className={style.logout}>
                <button className={style.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
            <div
              className={style.profileCircle}
              onClick={() => setShowLogout(!showLogout)}
            >
              {name?.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
