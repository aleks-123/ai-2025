import { Navigate, Outlet } from 'react-router-dom';
import { isExpired } from 'react-jwt';

const isAuthenticated = () => {
  // !!localStorage.getItem('token');
  const token = localStorage.getItem('token');
  if (!token) return false;
  if (isExpired(token)) {
    localStorage.removeItem('token');
    return false;
  }
  return true;
};

function ProtectRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to='/login' replace />;
}

export default ProtectRoute;
