import React, { useState } from 'react';
import axios from '../api/axios';

export default function AddBlog() {
  const [form, setForm] = useState({ title: '', body: '', image_url: '', name: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('blogs/', form);
      alert('Blog added!');
      setForm({title: '', body: '', image_url: '', name: ''}); 
    } catch (error) {
      console.log(form)
      alert('Failed to add blog. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center " style={{ minHeight: '90vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%', borderRadius: '15px' }}>
        <h2 className="mb-4 text-center fw-bold text-primary">Add New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">Username</label>
            <input
              id="name"
              name="name"
              className="form-control form-control-lg"
              placeholder="Enter your username"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">Title</label>
            <input
              id="title"
              name="title"
              className="form-control form-control-lg"
              placeholder="Enter blog title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="body" className="form-label fw-semibold">Body</label>
            <textarea
              id="body"
              name="body"
              className="form-control form-control-lg"
              placeholder="Write your blog content here..."
              value={form.body}
              onChange={handleChange}
              rows="6"
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image_url" className="form-label fw-semibold">Image URL</label>
            <input
              id="image_url"
              name="image_url"
              className="form-control form-control-lg"
              placeholder="Enter image URL"
              value={form.image_url}
              onChange={handleChange}
            />
          </div>
        


          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg shadow-sm">
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
