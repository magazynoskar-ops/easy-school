import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { useAuth } from './context/useAuth.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserSets from './pages/UserSets.jsx';
import LearnMode from './pages/LearnMode.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminSets from './admin/AdminSets.jsx';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app-shell app-font with-brand-logo">
        <Navbar />
        <div className="app-routes">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
            <Route path="/" element={<UserSets />} />

            <Route path="/dashboard" element={<UserSets />} />

            <Route path="/learn/:setId/:mode" element={<LearnMode />} />

            <Route
              path="/admin"
              element={(
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin/sets"
              element={(
                <ProtectedRoute requiredRole="admin">
                  <AdminSets />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
