import React from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";

function Sidebar() {
    return (
        <div className="Sidebar">
            {/* Texto añadido arriba del sidebar */}   
            <ul className="SidebarList">
            <div className="sidebar-header">
                Gestor Gim Valencia
            </div>
                {SidebarData.map((val, key) => {
                    return (
                        <li 
                            key={key}
                            className="row"
                            id={window.location.pathname == val.link ? "active" : ""}
                            onClick={() => {
                                window.location.pathname = val.link;
                            }}
                        >
                            <div id="icon">{val.icon}</div>
                            <div id="title">{val.title}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Sidebar;
