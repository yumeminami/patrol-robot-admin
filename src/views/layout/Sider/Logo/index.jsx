import React from "react";
import logo from "@/assets/images/logo.svg";
import LOGO from "@/assets/images/LOGO_without_bg.png";

import "./index.less";
const Logo = () => {
  return (
    <div className="sidebar-logo-container">
      <img src={LOGO} className="sidebar-logo" alt="logo" />
      <h1 className="sidebar-title">中吉机器人后台系统</h1>
    </div>
  );
};

export default Logo;
