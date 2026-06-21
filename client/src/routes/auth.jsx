import React from 'react';
import { AuthLayout } from '../layouts/authLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

export const authRoutes = [
  {
    path: '/auth/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
];
