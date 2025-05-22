import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Function to set active class
  const activeClassName = ({ isActive }) =>
    isActive ? "nav-link text-primary fw-bold" : "nav-link text-dark fw-semibold";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold text-dark fs-4" to="/">
          My<span className="text-primary">Blog</span>
        </NavLink>

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
              <NavLink to="/blogs" className={activeClassName}>
                All Blogs
              </NavLink>
            </li>

            {!token ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={activeClassName}>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className={activeClassName}>
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/add" className={activeClassName}>
                    Add Blog
                  </NavLink>
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

                    <NavLink
                      to="/profile"
                      className={activeClassName}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      Profile
                    </NavLink>

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
