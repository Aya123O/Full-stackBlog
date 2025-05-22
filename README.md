# 📰 Full-Stack Blog Application

A modern, full-featured blog platform built with **Django REST Framework** (backend) and **React** (frontend). Users can register, log in using JWT authentication, manage their own blogs, and enjoy a smooth infinite scrolling experience.

---

## 🌟 Features

### 🔐 Authentication
- User registration and login with **JWT**
- Token stored securely in `localStorage`
- Protected routes for create/edit/delete operations

### ✍️ Blog Management
- Create, update, delete your own blogs
- View all blogs with **pagination + infinite scroll**
- View only your posts in **"My Blogs"**
- Blog Fields:
  - `Title`
  - `Body`
  - `Image URL`
  - `Author`

### 🔄 Infinite Scroll
- Built with `react-infinite-scroll-component`
- Blogs auto-load as you scroll
- Improves performance and user experience

---

## 🧰 Tech Stack

### 🖥 Frontend
- React  
- Axios  
- React Router  
- JWT Decode  
- React Infinite Scroll Component

### ⚙️ Backend
- Django  
- Django REST Framework  
- Simple JWT  
- CORS Headers

---

## 🚀 Getting Started

### 📦 Clone the Repository

```bash
git clone https://github.com/Aya123O/Full-stackBlog.git
cd Full-stackBlog
🛠 Backend Setup (Django)
▶️ Install Dependencies
pip install -r requirements.txt
# or individually:
pip install djangorestframework djangorestframework-simplejwt corsheaders
🧱 settings.py Configuration
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'your_blog_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
🔗 API Endpoints
| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | `/api/register/`  | Register a new user         |
| POST   | `/api/login/`     | Log in and get JWT token    |
| GET    | `/api/blogs/`     | Get all blogs (paginated)   |
| GET    | `/api/myblogs/`   | Get blogs by logged-in user |
| POST   | `/api/blogs/`     | Create a new blog           |
| PUT    | `/api/blogs/:id/` | Edit a blog                 |
| DELETE | `/api/blogs/:id/` | Delete a blog               |

💻 Frontend Setup (React)
▶️ Install Dependencies
cd frontend
npm install
🔑 Authentication Handling
// On login success:
localStorage.setItem('token', response.data.access);
🌐 Axios Instance Setup (api.js)
import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
📂 Project Structure
src/
├── pages/
│   ├── Login.js
│   ├── Register.js
│   ├── AddBlog.js
│   ├── BlogList.js
│   ├── MyBlogs.js
├── components/
│   └── BlogCard.js
├── api.js
├── App.js
🌀 Infinite Scroll
 Making Custom infinity scroll 
🔐 Authentication Flow
User registers via /api/register/

Logs in via /api/login/ → receives JWT token

JWT token stored in localStorage

All secure requests include:
Authorization: Bearer <token>



