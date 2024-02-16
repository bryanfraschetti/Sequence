import React from "react";
import { Menu } from "antd";
import { RxAvatar } from "react-icons/rx";
import "../index.css";
import "./NavBar.css";
import sequenceLogo from "../Assets/sequence.png";

const NavBar = () => {
  function Unauthorize() {
    const entry_point = "/";
    Object.keys(localStorage).forEach((el) => {
      localStorage.removeItem(el);
    });

    fetch("/Unauthorize", {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Response not OK");
        }
      })
      .then((data) => {
        if (!data.destroyed) {
          throw new Error("Failed to unauthorize");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    window.location.href = entry_point;
  }

  const menuStyle = {
    backgroundColor: "rgb(12,10,22)",
    color: "white",
    fontSize: "1.08rem",
    fontWeight: "500",
    height: "70px",
    lineHeight: "70px",
    position: "fixed",
    width: "100vw",
    zIndex: "9999",
  };

  const items = [
    {
      icon: (
        <img
          src={sequenceLogo}
          alt="Sequence Logo"
          id="Logo-img"
          style={{ height: "40px", width: "40px" }}
        ></img>
      ),
      key: "Logo",
      id: "Logo",
      path: "/",
    },
    {
      label: "Sequencer",
      key: "Sequencer",
      className: "navMenuText",
      id: "override-antd",
      path: "/sequencer",
    },
    {
      label: "Help",
      key: "Help",
      className: "navMenuText",
      id: "override-antd",
      path: "/help",
    },
    // {
    //   label: "About",
    //   key: "About",
    //   className: "navMenuText",
    //   id: "override-antd",
    //   path: "/about",
    // },
    {
      icon: <RxAvatar size={32} alt="avatar"></RxAvatar>,
      key: "submenu",
      id: "profile-btn",
      children: [
        {
          label: "Log out",
          key: "logout",
        },
      ],
    },
  ];

  return (
    <Menu
      mode="horizontal"
      items={items}
      style={menuStyle}
      theme="dark"
      selectable={false}
      onClick={(e) => {
        if (e.key === "logout") {
          Unauthorize();
          console.log("logout");
        } else {
          const reroute = items.find((el) => el.key === e.key);
          if (reroute !== undefined) {
            window.location.href = reroute.path;
          }
        }
      }}
    ></Menu>
  );
};

export default NavBar;
