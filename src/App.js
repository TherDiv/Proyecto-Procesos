import React from 'react';
import Sidebar from './Components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Inicio from './Tabs/Inicio';
import Usuarios from './Tabs/Usuarios';
import Asistencias from './Tabs/Asistencias';
import Horarios from './Tabs/Horarios';
import Trabajadores from './Tabs/Trabajadores';
import Upperbar from './Components/Upperbar';

import './App.css';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/asistencias" element={<Asistencias />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/trabajadores" element={<Trabajadores />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
