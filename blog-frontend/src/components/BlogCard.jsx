import React from 'react';

export default function BlogCard({ blog }) {
  const currentUser = JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || 'e30='))?.username;

  return (
    <div>
      <h2>{blog.title}</h2>
      <img src={blog.image_url} alt="blog" width="300" />
      <p>{blog.body}</p>
      <p><strong>Written by:</strong> {blog.author}</p>
      {blog.author === currentUser && (
        <>
          <button>Edit</button>
          <button>Delete</button>
        </>
      )}
    </div>
  );
}
