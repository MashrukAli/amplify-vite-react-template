import React from 'react';

interface NavbarProps {
  user: any;
  signOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, signOut }) => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-2xl font-bold">My Blog</a>
        <div>
          {user && (
            <button onClick={signOut} className="text-white">Sign out</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
