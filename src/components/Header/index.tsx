import React from "react";
import "./index.css";

const Header: React.FC = () => {
  const goSubApp = (to: string) => {
    window.history.pushState(null, to, to);
  };
  return (
    <div className="linkList">
      <div className="name">qiankun-react-main</div>
      <span
        className={
          window.location.pathname.includes("/dnhyxc/react")
            ? "active-link"
            : "subLink"
        }
        onClick={() => goSubApp("/dnhyxc/react")}
      >
        React
      </span>
      <span
        className={
          window.location.pathname.includes("/dnhyxc/vue")
            ? "active-link"
            : "subLink"
        }
        onClick={() => goSubApp("/dnhyxc/vue")}
      >
        Vue
      </span>
    </div>
  );
};

export default Header;
