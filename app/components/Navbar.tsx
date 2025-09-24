import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';

const Navbar = () => {
  const { auth, isLoading } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();

  const next = encodeURIComponent(location.pathname + location.search);

  const handleLogout = () => {
    navigate('/auth?manage=1');
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>

      <div className="flex items-center gap-3">
        {/* If not authenticated, route to /auth?next=/upload */}
        {auth.isAuthenticated ? (
          <Link to="/upload" className="primary-button w-fit">
            Upload Resume
          </Link>
        ) : (
          <Link to="/auth?next=/upload" className="primary-button w-fit">
            Upload Resume
          </Link>
        )}

        {auth.isAuthenticated ? (
          <button
            type="button"
            className="secondary-button w-fit"
            onClick={handleLogout}
            disabled={isLoading}
            aria-label="Log out"
          >
            {isLoading ? 'Logging out…' : 'Log out'}
          </button>
        ) : (
          <Link
            to={`/auth?next=${next}`}
            className="secondary-button w-fit"
            aria-label="Log in"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
