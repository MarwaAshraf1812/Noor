import React from 'react';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = ({ children }) => {
  return (
    <div>
      {children || <Outlet />}
    </div>
  );
};
