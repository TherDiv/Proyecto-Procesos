import React from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { useLocation } from "react-router-dom"; // Importa useLocation para obtener la ruta actual

function Sidebar() {
  const location = useLocation(); // Obtén la ruta actual
  
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        <div className="sidebar-header">
          Gestor Gim Valencia
        </div>
        {SidebarData.map((val, key) => {
          return (
            <li 
              key={key}
              className={`row ${location.pathname === val.link ? 'active' : ''}`}  // Añade la clase 'active' si coincide la ruta actual
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
