
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ResetPassword from './pages/ResetPassword';
import EmailVerified from './pages/EmailVerified';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-deep-space-black text-white selection:bg-electric-cyan selection:text-deep-space-black font-sans flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/email-verified" element={<EmailVerified />} />
            </Routes>
          </main>

          <Footer />
          <Chatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
