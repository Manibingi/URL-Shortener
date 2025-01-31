import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import style from "./Sidebar.module.css";
// import logo from "../../assets/cuvette.svg";
// import icon1 from "../../assets/Icons.png";
// import icon2 from "../../assets/Icons2.svg";
// import icon3 from "../../assets/Icons3.svg";
// import icon4 from "../../assets/Icons4.svg";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className={style.left}>
      <Header />

      <div className={style.sidebarParent}>
        {/* Sidebar */}
        <div className={style.sideBar}>
          <div className={style.dashboard}>
            <i class="fa-solid fa-house"></i>
            <p onClick={() => navigate("dashboard")}>Dashboard</p>
          </div>
          <div className={style.link}>
            <i className="fa-solid fa-link"></i>
            <p onClick={() => navigate("links")}>Links</p>
          </div>
          <div className={style.analytics}>
            <i className="fa-solid fa-arrow-trend-up"></i>
            <p onClick={() => navigate("analytics")}>Analytics</p>
          </div>

          <div className={style.setting}>
            <i className="fa-solid fa-gear"></i>
            <p onClick={() => navigate("settings")}>Settings</p>
          </div>
        </div>

        {/* Main Content */}
        <div className={style.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
