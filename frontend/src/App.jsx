import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageTools from './pages/ManageTools';
import AddEditTool from './pages/AddEditTool';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/manage-tools" element={
              <ProtectedRoute requiredRole="admin">
                <ManageTools />
              </ProtectedRoute>
            } />
            <Route path="/manage-tools/add" element={
              <ProtectedRoute requiredRole="admin">
                <AddEditTool />
              </ProtectedRoute>
            } />
            <Route path="/manage-tools/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <AddEditTool />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
