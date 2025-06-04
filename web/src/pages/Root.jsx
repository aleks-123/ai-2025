import { Link, Outlet, useNavigate } from 'react-router-dom';

function Root() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        {isLoggedIn && (
          <Link to='/' style={{ marginRight: '1rem' }}>
            Почетна
          </Link>
        )}
        {!isLoggedIn && (
          <Link to='/login' style={{ marginRight: '1rem' }}>
            Најава
          </Link>
        )}

        {isLoggedIn && (
          <button style={{ marginRight: '1rem' }} onClick={handleLogout}>
            Одјава
          </button>
        )}
      </nav>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
