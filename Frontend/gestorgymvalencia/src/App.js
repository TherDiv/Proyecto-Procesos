import React from 'react';
import Sidebar from './Components/Sidebar';
import UsersTable from './Components/UsersTable';
import Upperbar from './Components/Upperbar';
import './App.css'; 

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="content">
        <UsersTable />
      </div>
    </div>
  );
}

export default App;
