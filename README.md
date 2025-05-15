📰 Full-Stack Blog Application
A modern, full-featured blog application built with Django REST Framework (backend) and React (frontend). Users can register, log in using JWT authentication, create and manage blogs, and experience infinite scroll for a seamless reading experience.

🌟 Features
🔐 Authentication
User registration and login using JWT

Token stored securely in localStorage

Protected routes for creating/editing/deleting blogs

✍️ Blog Management
Create, update, and delete your own blog posts

View all blogs in a paginated and infinite scrolling layout

View only your blogs in "My Blogs" section

Each blog includes:

Title

Body

Image URL

Author name

🔄 Infinite Scroll
Implemented using react-infinite-scroll-component

Fetches more blogs as user scrolls down

Great for performance and user experience

🧰 Tech Stack
🖥 Frontend
React

Axios

React Router

JWT Decode

React Infinite Scroll Component

⚙️ Backend
Django

Django REST Framework

Simple JWT

CORS Headers

🚀 Getting Started
📦 Clone the Repository

git clone https://github.com/Aya123O/Full-stackBlog.git
cd Full-stackBlog
🛠 Backend Setup (Django)
▶️ Install Dependencies

pip install -r requirements.txt
# or individually
pip install djangorestframework djangorestframework-simplejwt corsheaders
🧱 Configure settings.py
python
Copy
Edit
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
Method	Endpoint	Description
POST	/api/register/	Register a new user
POST	/api/login/	Login and get JWT token
GET	/api/blogs/	Get all blogs (paginated)
GET	/api/myblogs/	Get blogs by logged-in user
POST	/api/blogs/	Create a new blog
PUT	/api/blogs/:id/	Edit a blog
DELETE	/api/blogs/:id/	Delete a blog

💻 Frontend Setup (React)
▶️ Install Dependencies

cd frontend
npm install
🔑 Token Handling

// Save token on login
localStorage.setItem('token', response.data.access);
🌐 Axios Setup (api.js)

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
📦 Install

npm install react-infinite-scroll-component
🧠 Usage Example

<InfiniteScroll
  dataLength={blogs.length}
  next={fetchMoreData}
  hasMore={hasMore}
  loader={<h4>Loading...</h4>}
>
  {blogs.map(blog => (
    <BlogCard blog={blog} />
  ))}
</InfiniteScroll>
🔐 Authentication Flow
User registers via /api/register/

Logs in via /api/login/ and receives JWT

JWT stored in localStorage

Authenticated requests include Authorization: Bearer <token>

📸 Screenshots
Add some screenshots here if you like — of the blog list, add form, login page, etc.

🧪 Future Improvements
Like & comment system

Rich-text editor

Image upload (not just URL)

Profile management

Admin dashboard

👤 Author
Aya123O
GitHub: Aya123O

📜 License
This project is licensed under the MIT License.
