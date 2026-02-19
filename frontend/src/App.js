import "./css/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRole="user">
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/ngo-dashboard"
  element={
    <ProtectedRoute allowedRole="ngo">
      <NgoDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;