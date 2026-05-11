import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import GithubCallback from '../pages/auth/GithubCallback.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';

import Dashboard from '../pages/dashboard/Dashboard.jsx';
import RoomPage from '../pages/room/RoomPage.jsx';
import PolicyPage from '../pages/legal/PolicyPage.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Outlet />}>
        <Route path="privacy-policy" element={<PolicyPage />} />

        {/* Public Routes (Only accessible when logged out) */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/github/callback" element={<GithubCallback />} />
        </Route>

        {/* Protected Routes (Only accessible when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="room/:roomId" element={<RoomPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/privacy-policy" replace />} />
      </Route>
    </>
  )
);

export default router;

