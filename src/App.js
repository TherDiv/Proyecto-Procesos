import React from 'react';
import Sidebar from './Components/Sidebar';

import { Routes, Route } from 'react-router-dom';
import Inicio  from './Tabs/Inicio';
import Usuarios from './Tabs/Usuarios';
import Asistencias from './Tabs/Asistencias';
import Financiero from './Tabs/Financiero';
import Horarios from './Tabs/Horarios';
import Trabajadores from './Tabs/Trabajadores';
import Mantenimiento from './Tabs/Mantenimiento';
import Upperbar from './Components/Upperbar';

import './App.css'; 



function App() {
  return (
    <div className="App">
      <Sidebar />
       {<div className="content">
        <Routes>
         <Route path= '/' element ={<Inicio/>}> </Route>
         <Route path= 'usuarios' element ={<Usuarios/>}> </Route>
         <Route path= 'asistencias' element ={<Asistencias/>}> </Route>
         <Route path= 'financiero' element ={<Financiero/>}> </Route>
         <Route path= 'horarios' element ={<Horarios/>}> </Route>
         <Route path= 'trabajadores' element ={<Trabajadores/>}> </Route>
         <Route path= 'mantenimiento' element ={<Mantenimiento/>}> </Route>  
       </Routes>
      </div>}
    </div>
  );
}

export default App;
