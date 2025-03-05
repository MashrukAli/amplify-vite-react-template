import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated }) => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Bonsai Shop</Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link to="/admin" className="text-white hover:text-blue-200">
              Admin Dashboard
            </Link>
          ) : (
            <Link to="/admin" className="text-white hover:text-blue-200">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
