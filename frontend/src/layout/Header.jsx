import React, { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../context/authContext';
import '../styles/header.css';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Watch for changes in auth and update the isAuthenticated state
  useEffect(() => {
    if(auth?.user_id) setIsAuthenticated(true);
    else setIsAuthenticated(false);
  }, [auth]);

  return (
    <nav className="navbar">
      <div className="logo">Habit Management System</div>
      <div className="menu">
        <a href="/dashboard">Home</a>
        {isAuthenticated && (
          <div className="dropdown">
            <FiUser className='user-icon' />
            <div className="dropdown-content">
              <a href="/user-details">User</a>
              <a href="/edit-user">Edit User</a>
              <a href="/" onClick={() => {
                localStorage.removeItem('auth')
                setAuth({
                  user_id: null,
                  pages: 0
                })
              }} >Sign Out</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
