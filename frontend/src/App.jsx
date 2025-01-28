import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar/Sidebar";
import Analytics from "./components/Analytics/Analytics";
import Links from "./components/Links/Links";
import Settings from "./components/Settings/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Sidebar />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="links" element={<Links />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
