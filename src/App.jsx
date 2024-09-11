import React from 'react';
import './index.css';
import { Outlet, Routes, Route } from 'react-router-dom';
import MaterialTable from './components/materialTable';
import OrganizationUnitApp from './components/OrganizationUnit';
import MaterialAssignmentForm from './components/MaterialAssignement';


const App = () => {
  return (

    <div className="App">
      <Routes>
        <Route path="/materialList" element={<MaterialTable />}></Route>
        <Route path="/Organization" element={<OrganizationUnitApp />}></Route>
        <Route path="/Decharge" element={<MaterialAssignmentForm/>}></Route>
      </Routes>
    </div>

  );
};

export default App;