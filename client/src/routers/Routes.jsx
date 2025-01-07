// src/routers/Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import HomeAdmin from '../pages/Home/AdminHome';
import Sidebar from '../components/Sidebar';
import Consulta from '../pages/Card/Consulta';
import QRcode from '../pages/Card/QRGenerator';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user.role !== 'guest' ? (
    <div className="flex-container">
      <Navbar userImage={user.photo || user.avatar} isExpanded={true} />
      <Sidebar role={user.role} userImage={user.photo || user.avatar}>
        {children}
      </Sidebar>
    </div>
  ) : (
    <Navigate to="/auth/login" />
  );
};

export function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home/home-admin" element={<PrivateRoute><HomeAdmin /></PrivateRoute>} />
        <Route path="/card/consulta" element={<PrivateRoute><Consulta /></PrivateRoute>} />
        <Route path="/card/qr-generator" element={<PrivateRoute><QRcode /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default MyRoutes;