// src/hooks/useFetchBlogs.js
import { useState, useEffect } from 'react';
import axios from '../api/axios';

export function useFetchBlogs(filterByUser = null) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setBlogs([]); 
    setPage(1);
    setHasMore(true);
  }, [filterByUser]);

  useEffect(() => {
    if (!hasMore) return;

    setLoading(true);
    setError(null);

    let url = `/blogs?page=${page}`;
    if (filterByUser) {
      url += `&user=${filterByUser}`;
    }

    axios.get(url)
      .then(res => {
        if (page === 1) {
          setBlogs(res.data.data);
        } else {
          setBlogs(prev => [...prev, ...res.data.data]);
        }
        setHasMore(res.data.data.length > 0);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error fetching blogs');
        setLoading(false);
      });
  }, [page, filterByUser, hasMore]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { blogs, loading, error, loadMore, hasMore };
}
