# Strapi Posts App - Learning Project

A simple, well-documented React + TypeScript application designed for learning web development. This project demonstrates how to build a full-stack application with user authentication, CRUD operations, and integration with a Strapi backend.

## 📚 Purpose

This application is designed as an **educational resource for trainees** learning modern web development. Every file contains extensive comments explaining:
- **What** the code does
- **Why** we need it
- **How** it works
- Best practices and common patterns

## ✨ Features

### User Management
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes (only accessible when logged in)
- ✅ View all users
- ✅ Delete users (cannot delete yourself)

### Profile Management
- ✅ View your profile information
- ✅ Edit username and email
- ✅ Change password securely
- ✅ Real-time updates

### Posts Management (Full CRUD)
- ✅ **Create** new posts
- ✅ **Read** all posts with author information
- ✅ **Update** your own posts
- ✅ **Delete** your own posts
- ✅ Permission control (can only edit/delete your own posts)

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Strapi v4** - Headless CMS and API backend
- Must be running separately on `http://localhost:1337`

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Check version: `node --version`

2. **npm** or **yarn** or **pnpm** (package manager)
   - Comes with Node.js
   - Check version: `npm --version`

3. **Strapi Backend** running on `http://localhost:1337`
   - You should already have a Strapi project set up
   - Strapi must have:
     - Users (default Strapi users)
     - Posts collection (with title, content fields and relation to author)

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install

# OR using pnpm
pnpm install
```

**What this does:**
- Downloads all required packages listed in `package.json`
- Creates `node_modules` folder with dependencies
- May take a few minutes depending on internet speed

### Step 2: Configure Environment Variables (Optional)

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` and configure:

```env
# Your Strapi backend URL
VITE_API_URL=http://localhost:1337

# Optional: Auto-login for development (NOT for production!)
# VITE_DEV_JWT=your_jwt_token_here
```

**Note:** If you don't create `.env.local`, the app will use default values.

### Step 3: Start Development Server

```bash
# Using npm
npm run dev

# OR using yarn
yarn dev

# OR using pnpm
pnpm dev
```

**What this does:**
- Starts Vite development server
- Opens at `http://localhost:5173` (or next available port)
- Watches files for changes and hot-reloads automatically

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the home page!

## 📖 How to Use the Application

### 1. Register a New Account
- Click **"Register"** in the navbar
- Fill in username, email, and password
- Click **"Register"** button
- You'll be automatically logged in and redirected to home

### 2. Login (if already have account)
- Click **"Login"** in the navbar
- Enter your username/email and password
- Click **"Login"** button
- You'll be redirected to home page

### 3. View Posts
- Click **"Posts"** in the navbar
- See all posts from all users
- Posts show author name and date

### 4. Create a Post
- On Posts page, click **"Create Post"** button
- Fill in title and content
- Click **"Create Post"**
- Your post appears in the list

### 5. Edit Your Post
- Find your post in the list
- Click **"Edit"** button (only on your own posts)
- Modify title or content
- Click **"Update Post"**

### 6. Delete Your Post
- Find your post in the list
- Click **"Delete"** button (only on your own posts)
- Confirm deletion
- Post is removed

### 7. View Users
- Click **"Users"** in the navbar
- See list of all registered users
- Delete users (except yourself)

### 8. Update Profile
- Click **"Profile"** in the navbar
- Edit your username or email
- Change your password
- Click respective submit button

### 9. Logout
- Click **"Logout"** button in navbar
- You'll be logged out and redirected to login page

## 📂 Project Structure

```
posts/
├── src/
│   ├── api/                      # API layer
│   │   ├── axios.ts             # Axios configuration with interceptors
│   │   └── services/            # API service functions
│   │       ├── authService.ts   # Authentication operations
│   │       ├── userService.ts   # User CRUD operations
│   │       └── postService.ts   # Post CRUD operations
│   │
│   ├── components/              # Reusable components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   │
│   ├── contexts/               # React Context
│   │   └── AuthContext.tsx    # Authentication context and hooks
│   │
│   ├── pages/                  # Page components
│   │   ├── Home.tsx           # Welcome/landing page
│   │   ├── Login.tsx          # Login page
│   │   ├── Register.tsx       # Registration page
│   │   ├── Posts.tsx          # Posts management (CRUD)
│   │   ├── Users.tsx          # Users management
│   │   └── Profile.tsx        # User profile page
│   │
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles (Tailwind)
│
├── public/                   # Static assets
├── index.html               # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── .env.example        # Environment variables template
```

## 🎓 Learning Resources

### Key Concepts Covered

1. **React Fundamentals**
   - Functional components
   - Hooks (useState, useEffect, useContext)
   - Props and state
   - Component lifecycle

2. **TypeScript**
   - Type annotations
   - Interfaces
   - Type safety
   - Generic types

3. **React Router**
   - Client-side routing
   - Protected routes
   - Navigation
   - URL parameters

4. **Authentication**
   - JWT tokens
   - localStorage
   - Protected resources
   - Login/logout flow

5. **API Integration**
   - HTTP requests (GET, POST, PUT, DELETE)
   - Axios interceptors
   - Error handling
   - Loading states

6. **State Management**
   - React Context API
   - Global state
   - Local component state

7. **Forms**
   - Controlled inputs
   - Form validation
   - Submit handling
   - Error messages

### Where to Learn More

Every file in this project contains detailed comments explaining:
- What each piece of code does
- Why it's needed
- How it works
- Best practices

**Start reading from:**
1. `src/main.tsx` - Entry point
2. `src/App.tsx` - Routing setup
3. `src/contexts/AuthContext.tsx` - Authentication
4. `src/pages/Login.tsx` - Simple form example
5. `src/pages/Posts.tsx` - Full CRUD operations

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### Cannot Connect to Strapi
- Make sure Strapi is running on `http://localhost:1337`
- Check your `.env.local` file has correct `VITE_API_URL`
- Test Strapi by visiting `http://localhost:1337/admin`

### Login Fails
- Verify username/email and password are correct
- Check Strapi backend is running
- Check browser console for error messages
- Ensure user exists in Strapi

### "User not authorized" errors
- Your JWT token may have expired
- Log out and log in again
- Check Strapi token expiration settings

### TypeScript Errors
- Make sure all dependencies are installed: `npm install`
- Restart your IDE/editor
- Check `tsconfig.json` is valid

## 🔐 Security Notes

### For Development
- The `.env.example` file shows how to set up auto-login for development
- **NEVER** commit your `.env.local` file
- **NEVER** commit JWT tokens

### For Production
- Always use HTTPS
- Set secure token expiration times
- Implement proper password policies
- Add rate limiting
- Enable CORS properly
- Use environment variables for all secrets

## 🎯 Next Steps for Learning

Once you understand this application, try:

1. **Add Features**
   - Comments on posts
   - Like/favorite posts
   - User avatars
   - Search functionality
   - Pagination

2. **Improve UI**
   - Better styling
   - Loading animations
   - Toast notifications
   - Modal dialogs

3. **Add Validation**
   - Form validation libraries (Formik, React Hook Form)
   - Zod for schema validation
   - Better error messages

4. **Testing**
   - Unit tests (Jest, Vitest)
   - Component tests (React Testing Library)
   - E2E tests (Playwright, Cypress)

5. **Deployment**
   - Deploy frontend (Vercel, Netlify)
   - Deploy backend (Heroku, Railway, Render)
   - Configure production environment

## 📝 License

This is a learning project. Feel free to use, modify, and distribute for educational purposes.

## 🤝 Contributing

This is a learning project for trainees. If you find issues or have suggestions for better explanations, feel free to improve it!

## 💡 Support

If you have questions while learning:
1. Read the comments in the code files
2. Check the browser console for errors
3. Read React and TypeScript documentation
4. Search for error messages online

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router Documentation](https://reactrouter.com/)
- [Strapi Documentation](https://docs.strapi.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy Learning! 🚀**

Remember: The best way to learn is by reading the code, experimenting, breaking things, and fixing them. Don't be afraid to make mistakes!
