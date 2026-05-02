import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'

// Exporting server URL as requested in your reference architecture
export const serverUrl = "https://ethara-task-backed.onrender.com"

const App = () => {
  // Since we use httpOnly cookies for the token, we only store user metadata in localStorage
  const userStr = localStorage.getItem("user");
  const userData = userStr ? JSON.parse(userStr) : null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={userData ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path='/dashboard' element={userData ? <Dashboard /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
