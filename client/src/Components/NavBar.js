import React from "react"
import { Menu } from "antd"
import { RxAvatar } from "react-icons/rx";
import "../index.css"
import "./NavBar.css"

const NavBar = () => {

    const menuStyle = {
        backgroundColor: "rgb(12,10,22)",
        color: "white",
        fontSize: "1.08rem",
        fontWeight: "500",
        height: "70px",
        lineHeight: "70px",
        position: "fixed",
        width: "100vw",
        zIndex: "9999"
    }

    const items = [
        {
            label: "Logo",
            key: "Logo",
            id: "Logo",
            path: "/"
        },
        {
            label: "Home",
            key: "Home",
            className: "navMenuText",
            id: "override-antd",
            path: "/home",
        },
        {
            label: "Help",
            key: "Help",
            className: "navMenuText",
            id: "override-antd",
            path: "/help"
        },
        {
            label: "About",
            key: "About",
            className: "navMenuText",
            id: "override-antd",
            path: "/about"
        },
        {
            icon: <RxAvatar size={28} style={{transform: "translateY(6px)"}} alt="avatar"></RxAvatar>,
            key: "submenu",
            id: "profile-btn",
            children: [
                {
                    label: "logout",
                    key: "logout"
                }
            ],
          },
    ];

    return (
        <Menu mode="horizontal" items={items} style={menuStyle} theme="dark" selectable={false}
        onClick = {(e) => {
            if(e.key === "logout"){
                console.log("logout")
            }
            else{
                const reroute = items.find((el) => el.key === e.key)
                if(reroute !== undefined){
                    window.location.href = reroute.path
                }
            }

        }}>
        </Menu>
    )
}

export default NavBar
