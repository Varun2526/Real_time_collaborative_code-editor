import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1c26]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a5cfa]"></div>
      </div>
    );
  }

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
