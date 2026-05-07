import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Future routes */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/room/:roomId" element={<RoomPage />} /> */}
    </>
  )
);

export default router;

