import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import BlogCard from '../components/BlogCard';

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/blogs/?format=json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const myBlogs = response.data.filter(blog => blog.author === username);
        setBlogs(myBlogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
      setLoading(false);
    };

    if (username && token) {
      fetchBlogs();
    }
  }, [username, token]);

  return (
    <div className="container my-5" style={{ minHeight: '90vh' }}>
      <div
        className="card shadow-lg p-5 mx-auto"
        style={{ maxWidth: '900px', borderRadius: '15px', backgroundColor: '#f9faff' }}
      >
        <h2 className="mb-5 text-center fw-bold text-primary" style={{ fontSize: '2.8rem', letterSpacing: '1px' }}>
          MyProfile
        </h2>

        <div className="mb-4">
          <label htmlFor="username" className="form-label fw-semibold fs-5">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="form-control form-control-lg shadow-sm"
            value={username}
            readOnly
            style={{ backgroundColor: '#e9ecef', borderRadius: '10px' }}
          />
        </div>

        <h3 className="text-center text-secondary mb-4" style={{ fontWeight: '600', fontSize: '1.8rem' }}>
          My Blogs
        </h3>

        {loading ? (
          <p className="text-center fs-5 text-muted">Loading your blogs...</p>
        ) : blogs.length > 0 ? (
          <div className="">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-center fs-5 text-muted">No blogs found.</p>
        )}
      </div>
    </div>
  );
}
