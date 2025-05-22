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
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4">
    <div className="container-fluid">
      <Link className="navbar-brand fw-bold text-dark fs-4" to="/">
        My<span className="text-primary">Blog</span>
      </Link>
  
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
  
      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav ms-auto align-items-center gap-3">
  
          <li className="nav-item">
            <Link className="nav-link text-dark fw-semibold" to="/blogs">
              All Blogs
            </Link>
          </li>
  
          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-semibold" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-semibold" to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-semibold" to="/add">
                  Add Blog
                </Link>
              </li>
  
             
  
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-outline-primary px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
              <li className="nav-item d-flex align-items-center gap-2">
                <div className="profile-area d-flex align-items-center">
                  <i className="fas fa-user-circle fs-4 text-primary"></i>
                  
                <Link className='nav-link ' to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                 profile
                </Link>
              
                  </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  </nav>
  

  );
};


export default Navbar;
