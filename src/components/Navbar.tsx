import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: any;
  signOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, signOut }) => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Blog</Link>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link to="/admin" className="text-white hover:text-blue-200">
                Admin Dashboard
              </Link>
              <button onClick={signOut} className="text-white hover:text-blue-200">
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;