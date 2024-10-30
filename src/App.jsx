import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import MaterialTable from './components/Admin Dashboard/materialTable';
import OrganizationUnit from './components/Admin Dashboard/OrganizationUnit';
import MaterialAssignmentForm from './components/Employee Dashboard/MaterialAssignement';
import AdminDashboardLayout from './components/Admin Dashboard/AdminDashboardLayout';
import EmployeeLayout from './components/Employee Dashboard/EmployeeLayout';
import SignIn from './components/Authentification/SignIn';
import ProtectedRoute from './components/Authentification/ProtectedRoute';
import UserManagement from './components/Admin Dashboard/UserManagement';
import ResetPassword from './components/Authentification/ResetPassword';
import ContactAdmin from './components/Employee Dashboard/ContactAdmin';
import UserProfile from './components/Employee Dashboard/UserProfile';
import History from './components/Admin Dashboard/History';
import PendingDischarges from './components/Admin Dashboard/PendingDischarges';
import EmployeeDischarges from './components/Employee Dashboard/EmployeeDischarges';

const App = () => {
  return (
    <div className="App">
      
        <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<SignIn />} />

            <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}> <AdminDashboardLayout /></ProtectedRoute>}>
              <Route path="materialList" element={<MaterialTable />} />
              <Route path="organization" element={<OrganizationUnit />} />
              <Route path="History" element={<History />} />
              <Route path="pendingDischarges" element={<PendingDischarges />} />
              <Route path="profile" element={<UserProfile/>} />
              <Route path="user" element={<UserManagement />} />
            </Route>

            <Route path="/employee/*" element={<ProtectedRoute allowedRoles={['ROLE_EMPLOYEE']}> <EmployeeLayout /></ProtectedRoute>}>
              <Route path="assignment" element={<MaterialAssignmentForm />} />
              <Route path="profile" element={<UserProfile/>} />
              <Route path="notification" element={<ContactAdmin/>} />
              <Route path="discharge" element={<EmployeeDischarges/>} />
            </Route>

            <Route path="/technician/*" element={<ProtectedRoute allowedRoles={['ROLE_TECHNICIEN']}> <AdminDashboardLayout /></ProtectedRoute>}>
              <Route path="materialList" element={<MaterialTable />} />
            </Route>
        </Routes>
      
    </div>
  );
};

export default App;
