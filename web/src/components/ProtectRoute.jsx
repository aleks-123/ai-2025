import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');

function ProtectRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to='/login' replace />;
}

export default ProtectRoute;
