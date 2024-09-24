import React from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
  const sections = [
    'Vista General', 'Asistencias', 'Usuarios', 'Financiero',
    'Horarios', 'Trabajadores', 'Mantenimiento'
  ];

  return (
    <div className="sidebar">
      <h2>GESTOR GYM VALENCIA</h2>
      <List>
        {sections.map((section, index) => (
          <ListItem button key={index}>
            <ListItemText primary={section} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
