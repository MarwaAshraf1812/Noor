import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing';
import { authRoutes } from './auth';
import { appRoutes } from './appRoutes';
import { useUserStore } from '../store/userStore';

// Protected Route Guard
export const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const token = localStorage.getItem('token'); // Fallback token check

  if (!user && !token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export const AppRouter = () => {
  console.log("AppRouter component executing");
  // Wrap dashboard routes with the ProtectedRoute guard
  const protectedAppRoutes = appRoutes.map((route) => {
    if (route.path === '/dashboard') {
      return {
        ...route,
        element: <ProtectedRoute>{route.element}</ProtectedRoute>,
      };
    }
    return route;
  });

  const element = useRoutes([
    {
      path: '/',
      element: <LandingPage />,
    },
    ...authRoutes,
    ...protectedAppRoutes,
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return element;
};