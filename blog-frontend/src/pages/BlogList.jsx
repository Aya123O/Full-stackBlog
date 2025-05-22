import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios interceptor
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
  const [showTopBtn, setShowTopBtn] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowTopBtn(window.scrollY > 300);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Fetch blogs
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
    <div className="container py-5" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontSize: '18px', color: '#333' }}>
      <h2 className="text-center text-dark mb-5 fw-bold" style={{ fontSize: '2.8rem' }}>
        <i className="fas fa-blog me-2 text-primary"></i>All Blogs
      </h2>

      {error && (
        <div className="alert alert-danger text-center mb-3" style={{ fontSize: '1.3rem' }}>{error}</div>
      )}

      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="card border-0 shadow-lg rounded-4 mb-5 position-relative overflow-hidden"
          style={{
            maxWidth: '700px',
            margin: '0 auto 40px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            fontSize: '1.2rem',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            backgroundColor: '#fff',
            cursor: 'default',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
        >
          {editingId === blog.id ? (
            <>
              <div style={{ maxHeight: '300px', overflow: 'hidden' }}>
                <img
                  src={editImage}
                  alt="Blog"
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '1rem 1rem 0 0',
                    boxShadow: 'inset 0 -20px 30px -10px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
              <div className="card-body p-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-control mb-3"
                  placeholder="Title"
                  style={{ fontSize: '1.5rem', fontWeight: '700', borderRadius: '12px', padding: '12px' }}
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="form-control mb-3"
                  rows={5}
                  placeholder="Body"
                  style={{ fontSize: '1.2rem', borderRadius: '12px', padding: '10px' }}
                />
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="form-control mb-3"
                  placeholder="Image URL"
                  style={{ fontSize: '1.1rem', borderRadius: '12px', padding: '10px' }}
                />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-control mb-3"
                  placeholder="Author Name"
                  style={{ fontSize: '1.1rem', borderRadius: '12px', padding: '10px' }}
                />
                <div className="d-flex justify-content-center gap-3">
                  <button
                    onClick={saveEdit}
                    className="btn btn-success px-4 rounded-pill"
                    disabled={actionLoading === editingId}
                    style={{ fontSize: '1.2rem', padding: '10px 30px' }}
                  >
                    {actionLoading === editingId ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="btn btn-secondary px-4 rounded-pill"
                    disabled={actionLoading === editingId}
                    style={{ fontSize: '1.2rem', padding: '10px 30px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-12">
                <span className="user-badge">
                  <span className="user-icon">
                    <i className="fas fa-user"></i>
                  </span>
                  {blog.name}
                </span>
              </div>
              {blog.image_url && (
                <div className="blog-image-wrapper">
                  <img
                    src={blog.image_url}
                    alt="Blog"
                    className="card-img-top"
                  />
                  <span className="created-badge">
                    <i className="fas fa-calendar-plus me-2 text-success"></i>
                    Created: {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="card-body p-4">
                <h3 className="card-title text-primary mb-3 fw-bold text-center" style={{ fontSize: '2rem' }}>
                  <i className="fas fa-heading me-2 text-info"></i>
                  {blog.title}
                </h3>
                <p className="card-text text-muted fs-6" style={{ fontSize: '1.3rem', lineHeight: '1.6' }}>{blog.body}</p>

                <div className="row mt-4 gy-2" style={{ fontSize: '1.1rem' }}>
                 
                 
                 
                <div className="col-md-12 d-flex justify-content-around gap-2 icon-actions mb-2">
                <button className="icon-button like" title="Like">
    <i className="fas fa-heart"></i>
  </button>
  <button className="icon-button comment" title="Comment">
    <i className="fas fa-comment"></i>
  </button>
  <button
    onClick={() => startEditing(blog)}
    className="icon-button edit"
    disabled={actionLoading === blog.id}
    title="Edit"
  >
    <i className="fas fa-edit"></i>
  </button>

  <button
    onClick={() => handleDelete(blog.id)}
    className="icon-button delete"
    disabled={actionLoading === blog.id}
    title="Delete"
  >
    <i className="fas fa-trash-alt"></i>
  </button>




</div>

                  <div className="col-md-12 d-flex justify-content-end">
                    <span className="badge bg-light text-dark p-2 fs-6" style={{ borderRadius: '12px', fontWeight: '600' }}>
                      <i className="fas fa-calendar-check me-2 text-info"></i>
                      Updated: {new Date(blog.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {loading && (
        <div className="text-center my-5" style={{ fontSize: '1.6rem', color: '#555' }}>
          Loading more blogs...
        </div>
      )}

      {!hasMore && (
        <div className="text-center my-4" style={{ fontSize: '1.4rem', color: '#777' }}>
          No more blogs to display.
        </div>
      )}
      {showTopBtn && (
  <button onClick={scrollToTop} className="back-to-top">
    ⬆
  </button>
)}

    </div>
  );
};

export default BlogList;
