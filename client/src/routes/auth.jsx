import React from 'react';
import { AuthLayout } from '../layouts/authLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

export const authRoutes = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
];
