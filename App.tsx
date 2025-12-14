import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Login from './pages/Login';
import BucketList from './pages/BucketList';
import ItineraryGenerator from './pages/ItineraryGenerator';
import Profile from './pages/Profile';
import { authService } from './services/authService';

// Layout wrapper for pages that need navbar
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Explore />} />
          <Route 
            path="bucketlist" 
            element={
              <ProtectedRoute>
                <BucketList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="generate" 
            element={
              <ProtectedRoute>
                <ItineraryGenerator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;