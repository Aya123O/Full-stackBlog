import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.data.code === 'token_not_valid') {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editName, setEditName] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const isLoggedIn = !!token;

  const fetchBlogs = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/blogs/?format=json&page=${pageNumber}`);
      const newBlogs = res.data;
  
      if (newBlogs.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prevBlogs) => {
          const existingIds = new Set(prevBlogs.map(blog => blog.id));
          const filteredNewBlogs = newBlogs.filter(blog => !existingIds.has(blog.id));
          return [...prevBlogs, ...filteredNewBlogs];
        });
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Error fetching blogs. Please try again later.');
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleUnauthorizedAction = () => {
    alert('You must be logged in to perform this action. Please log in.');
    navigate('/login');
  };

  const startEditing = (blog) => {
    if (!isLoggedIn) {
      handleUnauthorizedAction();
      return;
    }
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditBody(blog.body);
    setEditImage(blog.image_url);
    setEditName(blog.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
    setEditImage('');
    setEditName('');
  };

  const saveEdit = async () => {
    if (!editTitle || !editBody) {
      alert('Title and body are required.');
      return;
    }
    setActionLoading(editingId);
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/blogs/${editingId}/`,
        { title: editTitle, body: editBody, image_url: editImage, name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === editingId ? response.data : blog))
      );
      cancelEdit();
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Error updating blog. Please try again.');
    }
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!isLoggedIn) {
      handleUnauthorizedAction();
      return;
    }
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setActionLoading(id);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Error deleting blog. Please try again later.');
    }
    setActionLoading(null);
  };

  return (
    <div className="container">
      <h2 className="my-4">All Blogs</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {blogs.map((blog) => {
        return (
          <div key={blog.id} className="card mb-3">
            <div className="card-body">
              {editingId === blog.id ? (
                <>
                  <h3 className="card-title text-black-50 text-center mb-2 text-xl-center">Edit Blog</h3>
                  <input
                    type='text'
                    className="form-control mb-2"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Username"
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="form-control mb-2"
                    rows="4"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="Image URL"
                  />
                  <button
                    onClick={saveEdit}
                    className="btn btn-success me-2"
                    disabled={actionLoading === blog.id}
                  >
                    {actionLoading === blog.id ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} className="btn btn-secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="card-title text-black-50 text-center mb-2 text-xl-center">{blog.title}</h3>
                  {blog.image_url && (
                    <img
                      src={blog.image_url}
                      alt="Blog"
                      className="card-img-bottom"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  )}
                  <p className="card-text mb-2 mt-3">Description: {blog.body}</p>
                  <p><strong>Written by:</strong> {blog.name}</p>
                  <p><strong>Email: {blog.author}</strong></p>
                  <p><strong>Created at:</strong> {new Date(blog.created_at).toLocaleString()}</p>
                  <p><strong>Updated at:</strong> {new Date(blog.updated_at).toLocaleString()}</p>
                
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={() => startEditing(blog)}
                      className="btn btn-primary me-3 mt-3 px-3"
                      disabled={!isLoggedIn || actionLoading === blog.id}
                      title={!isLoggedIn ? "Log in to edit blogs" : ""}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="btn btn-danger mt-3"
                      disabled={!isLoggedIn || actionLoading === blog.id}
                      title={!isLoggedIn ? "Log in to delete blogs" : ""}
                    >
                      {actionLoading === blog.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}

      {loading && <div className="text-center my-4">Loading more blogs...</div>}
      {!hasMore && <div className="text-center my-4">No more blogs to load.</div>}
    </div>
  );
};

export default BlogList;
