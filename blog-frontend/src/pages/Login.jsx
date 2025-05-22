import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/blogs');
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert('Please fill out both fields.');
      return;
    }

    try {
      const res = await axios.post('login/', form);
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('username', form.username);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/blogs');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
      <div className="card shadow-lg p-5" style={{ maxWidth: '500px', width: '100%', borderRadius: '20px' }}>
        <h3 className="text-center mb-4 fw-bold text-primary">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">Username</label>
            <input
              id="username"
              name="username"
              className="form-control form-control-lg"
              onChange={handleChange}
              value={form.username}
              placeholder="Enter username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control form-control-lg"
              onChange={handleChange}
              value={form.password}
              placeholder="Enter password"
            />
          </div>

          <div className="d-grid mb-4">
            <button type="submit" className="btn btn-primary btn-lg shadow-sm">Login</button>
          </div>

          <div className="text-center small text-muted">
            <p className="mb-2">
              Don’t have an account?{" "}
              <a href="/register" className="text-decoration-none fw-semibold">Register here</a>
            </p>

            <p className="mb-2">
              By logging in, you agree to our{" "}
              <a href="/terms" className="text-decoration-none">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-decoration-none">Privacy Policy</a>.
            </p>

            <p className="mb-2">
              Need help?{" "}
              <a href="/help" className="text-decoration-none">Contact support</a>
            </p>

            <p className="mb-0">
              Already logged in?{" "}
              <a href="/logout" className="text-danger text-decoration-none fw-semibold">Logout</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
