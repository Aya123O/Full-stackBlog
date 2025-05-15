import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBlog from './pages/AddBlog';
import BlogList from './pages/BlogList';
import Navbar from './components/Navbar';
export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add" element={<AddBlog />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
      <footer className="text-center mt-4">
        <p>&copy; 2023 My Blog. All rights reserved.</p>
      </footer>

    </BrowserRouter>
  );
}
