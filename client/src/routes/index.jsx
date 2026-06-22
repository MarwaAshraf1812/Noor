import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing';
import { authRoutes } from './auth';
import { appRoutes } from './appRoutes';
import useAuthStore from '../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRouter = () => {
  console.log("AppRouter component executing");
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
      element: <PublicOnlyRoute><LandingPage /></PublicOnlyRoute>,
    },
    ...authRoutes.map((route) => ({
      ...route,
      element: <PublicOnlyRoute>{route.element}</PublicOnlyRoute>,
    })),
    ...protectedAppRoutes,
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return element;
};