import { Outlet } from 'react-router-dom';

export const AuthLayout = ({ children }) => {
  return (
    <div>
      {children || <Outlet />}
    </div>
  );
};
