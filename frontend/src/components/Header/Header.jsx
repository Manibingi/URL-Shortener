import React, { useEffect, useState } from "react";
import style from "./Header.module.css";
import axios from "axios";
import logo from "../../assets/cuvette.svg";
import { useAppContext } from "../../components/AppContext";

function Header() {
  const { toggleCreateLink } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);
  // const [page, setPage] = useState(1);
  // const [search, setSearch] = useState("");

  // const fetchData = async () => {
  //   const response = await axios.get(
  //     `http://localhost:8000/api/links/links?page=${page}&search=${search}`
  //   );
  //   const data = await response.json();
  //   // Handle the data (e.g., set state to display the URLs)
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [page, search]);

  return (
    <>
      <div className={style.navbar}>
        <div className={style.logo}>
          <img src={logo} alt="Logo.png" />
        </div>
        <div className={style.rightNavbar}>
          <div className={style.profileName}>
            <span>Good morning, Kumar</span>
            <p>Tue, jan 25</p>
          </div>
          <div className={style.navActon}>
            <button className={style.createButton} onClick={toggleCreateLink}>
              + Create new
            </button>
            <div className={style.search}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by remarks"
                className={style.navSearch}
              />
            </div>
            {showLogout && (
              <div>
                <button className={style.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
            <div className={style.profileCircle}>ku</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
