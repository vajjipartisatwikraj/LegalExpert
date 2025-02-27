import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme, CssBaseline, Box } from '@mui/material';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MainLayout from './layouts/MainLayout';
import ChatList from './components/chat/ChatList';
import ChatWindow from './components/chat/ChatWindow';
import DocumentList from './components/documents/DocumentList';
import ProBonoList from './components/probono/ProBonoList';
import CaseAnalysis from './components/analysis/CaseAnalysis';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import LandingPage from './components/landing/LandingPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E1E1E',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Nekst-Regular, Arial, sans-serif',
  }
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <Home />
              </MainLayout>
            ) : (
              <LandingPage />
            )
          } />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/*" element={
            isAuthenticated ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="analysis" element={<CaseAnalysis />} />
                  <Route path="chats" element={<ChatList />} />
                  <Route path="chats/:chatId" element={<ChatWindow />} />
                  <Route path="documents" element={<DocumentList />} />
                  <Route path="probono" element={<ProBonoList />} />
                  <Route path="profile" element={<Profile />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/" />
            )
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
