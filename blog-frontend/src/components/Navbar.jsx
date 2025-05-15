import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 w-100">
      <Link className="navbar-brand" to="/">
        My Blog
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <Link className="nav-link" to="/blogs">
              All Blogs
            </Link>
          </li>

          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/add">
                  Add Blog
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm mr-5" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>

  );
};


export default Navbar;
