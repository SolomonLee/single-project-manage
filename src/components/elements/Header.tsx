import React from "react";
import { Link } from "react-router-dom";
import User from "../combo/user/User";

const Header = (): JSX.Element => (
    <div className="header">
        <div className="functions">
            <Link to="/">
                <i className="bi bi-house-fill"></i>
            </Link>
            <Link to="/Table">
                <i className="bi bi-list"></i>
            </Link>
        </div>
        <div className="title">
            <span className="logo">
                <img src="logo192.png" alt="" />
            </span>
            某某專案管理
        </div>
        <div className="functions">
            <User />
        </div>
    </div>
);
export default Header;
