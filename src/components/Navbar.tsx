import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg- text-green-800 shadow-md py-2' : 'bg-transparent text-white py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold">心綺園</Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-500 transition-colors duration-200">Home</Link>
          <Link to="/collection" className="hover:text-green-500 transition-colors duration-200">Collection</Link>
          <Link to="/lease" className="hover:text-green-500 transition-colors duration-200">Lease</Link>
          <Link to="/company" className="hover:text-green-500 transition-colors duration-200">Company</Link>
          <a 
            href="https://jwpqgsxvee.ap-northeast-1.awsapprunner.com/admin"   
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-green-500 transition-colors duration-200"
          >
            Admin
          </a>
          <a 
            href="#contact" 
            className={`px-4 py-2 rounded-full border ${
              isScrolled 
                ? 'border-green-800 hover:bg-green-800 hover:text-white' 
                : 'border-white hover:bg-white hover:text-green-800'
            } transition-colors duration-200`}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
