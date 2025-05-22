import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

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

  const startEditing = (blog) => {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditBody(blog.body);
    setEditImage(blog.image_url || '');
    setEditName(blog.name || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
    setEditImage('');
    setEditName('');
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editBody.trim() || !editName.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    setActionLoading(editingId);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/blogs/${editingId}/`,
        {
          title: editTitle,
          body: editBody,
          image_url: editImage,
          name: editName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === editingId
            ? { ...blog, title: editTitle, body: editBody, image_url: editImage, name: editName }
            : blog
        )
      );
      cancelEdit();
    } catch (error) {
      alert('Failed to update blog. Please try again.');
    }
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setActionLoading(id);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.id !== id));
    } catch (error) {
      alert('Failed to delete blog.');
    }
    setActionLoading(null);
  };

  if (error) return <p className="text-center text-danger mt-3">{error}</p>;

  return (
    <div className="container mt-5">
  

      {blogs.length === 0 && !loading && <p className="text-center">No blogs available.</p>}

      {blogs.map(blog => (
        <BlogCard
          key={blog.id}
          blog={blog}
          editingId={editingId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editBody={editBody}
          setEditBody={setEditBody}
          editImage={editImage}
          setEditImage={setEditImage}
          editName={editName}
          setEditName={setEditName}
          actionLoading={actionLoading}
          startEditing={startEditing}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          handleDelete={handleDelete}
        />
      ))}

      {loading && (
        <div className="text-center my-4">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </div>
      )}

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 100,
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            cursor: 'pointer',
          }}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default BlogList;
