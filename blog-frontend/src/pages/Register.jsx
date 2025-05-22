import React, { useState } from 'react';
import axios from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('register/', form);
      alert('Registered! Now login.');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center bg-body-secondary" style={{ height: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '800px', width: '100%' }}>
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              name="username"
              className="form-control"
              placeholder="Enter username"
              onChange={handleChange}
              value={form.username}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              value={form.password}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
