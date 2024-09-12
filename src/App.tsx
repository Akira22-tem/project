import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RolesTable } from './components/Roles';
import "primereact/resources/themes/lara-light-purple/theme.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";



function App() {
  return (
    <div className="App">
      
      <h1>Listado de Roles</h1>
      <RolesTable></RolesTable>
    </div>
      
  );

}

export default App;
