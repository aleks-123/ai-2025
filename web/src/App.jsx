import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root';
import Homepage from './pages/Homepage';
import ProtectRoute from './components/ProtectRoute';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },

      {
        element: <ProtectRoute />,
        children: [{ index: true, element: <Homepage /> }],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
