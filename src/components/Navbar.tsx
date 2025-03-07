import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Bonsai Rental</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-green-200">Browse</Link>
          <a href="https://jwpqgsxvee.ap-northeast-1.awsapprunner.com/admin" target="_blank" rel="noopener noreferrer" className="hover:text-green-200">
            Strapi Admin
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
