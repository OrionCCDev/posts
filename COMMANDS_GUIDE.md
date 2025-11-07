# Application Setup & Run Commands Guide
## Complete Command Reference in Sequence

This guide shows **ALL commands** needed to set up and run the application from scratch to deployment.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Initial Setup](#2-initial-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Install Dependencies](#4-install-dependencies)
5. [Run Development Server](#5-run-development-server)
6. [Common Development Commands](#6-common-development-commands)
7. [Build for Production](#7-build-for-production)
8. [Deployment](#8-deployment)
9. [Git Commands](#9-git-commands)
10. [Troubleshooting Commands](#10-troubleshooting-commands)

---

## 1. Prerequisites

### Check if Node.js is Installed

```bash
# Check Node.js version (should be 18+ or 20+)
node --version

# Check npm version
npm --version
```

**Expected output:**
```
node --version
v20.10.0

npm --version
10.2.3
```

### Install Node.js (if not installed)

**Windows:**
- Download from: https://nodejs.org/
- Install LTS version
- Restart terminal

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

---

## 2. Initial Setup

### Step 1: Navigate to Project Directory

```bash
# Windows (Git Bash or PowerShell)
cd /d/senior/Learning/"New folder"/todo-main/posts

# Or if you're in a different location
cd path/to/your/posts/folder
```

### Step 2: Verify You're in the Right Folder

```bash
# Check if package.json exists
ls package.json

# Or on Windows CMD
dir package.json
```

**Expected output:**
```
package.json
```

---

## 3. Environment Configuration

### Step 1: Create .env File

```bash
# Create .env file (if it doesn't exist)
touch .env

# Windows (if touch doesn't work)
echo. > .env
```

### Step 2: Add Environment Variables

**Open .env file and add:**
```env
VITE_API_URL=http://localhost:1337
```

**Or create it with command:**
```bash
# Linux/Mac
echo "VITE_API_URL=http://localhost:1337" > .env

# Windows (PowerShell)
"VITE_API_URL=http://localhost:1337" | Out-File -FilePath .env -Encoding utf8
```

### Step 3: Verify .env File

```bash
# View .env contents
cat .env

# Windows
type .env
```

**Expected output:**
```
VITE_API_URL=http://localhost:1337
```

---

## 4. Install Dependencies

### Step 1: Clean Install (Recommended for First Time)

```bash
# Remove existing node_modules and lock files (if any)
rm -rf node_modules package-lock.json

# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, package-lock.json

# Install all dependencies
npm install
```

**Expected output:**
```
added 234 packages in 15s

23 packages are looking for funding
  run `npm fund` for details
```

### Step 2: Verify Installation

```bash
# Check if node_modules folder exists
ls node_modules

# Check installed packages
npm list --depth=0
```

**Expected output:**
```
posts@0.0.0
├── @vitejs/plugin-react@4.2.1
├── axios@1.6.2
├── react@18.2.0
├── react-dom@18.2.0
├── react-router-dom@6.20.0
├── tailwindcss@3.3.6
├── typescript@5.2.2
└── vite@5.0.8
```

---

## 5. Run Development Server

### Step 1: Start Development Server

```bash
# Start the dev server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 423 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 2: Open in Browser

```bash
# Automatically open browser (if configured)
# Or manually open: http://localhost:5173/
```

### Step 3: Verify Application is Running

Open browser and navigate to:
```
http://localhost:5173/
```

You should see the **Login page** ✅

### Step 4: Stop Development Server

```bash
# Press Ctrl + C in the terminal
# Confirm with 'Y' if asked
```

---

## 6. Common Development Commands

### Run Development Server (Different Options)

```bash
# Standard dev server
npm run dev

# Dev server with host exposed (accessible from other devices on network)
npm run dev -- --host

# Dev server on specific port
npm run dev -- --port 3000

# Dev server with HTTPS
npm run dev -- --https
```

### Check for Errors

```bash
# Run TypeScript type checking
npx tsc --noEmit

# Check for TypeScript errors without building
npm run type-check
```

### Format Code (if Prettier is configured)

```bash
# Format all files
npx prettier --write .

# Check formatting without changing files
npx prettier --check .
```

### Lint Code (if ESLint is configured)

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## 7. Build for Production

### Step 1: Build the Application

```bash
# Create production build
npm run build
```

**Expected output:**
```
vite v5.0.8 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-BfC8q2Fz.css   8.23 kB │ gzip:  2.41 kB
dist/assets/index-D7G5mI8c.js  143.42 kB │ gzip: 46.34 kB
✓ built in 3.45s
```

### Step 2: Verify Build Output

```bash
# Check if dist folder was created
ls dist/

# See build files
ls dist/assets/
```

**Expected structure:**
```
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### Step 3: Preview Production Build (Local Testing)

```bash
# Preview the production build locally
npm run preview
```

**Expected output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open browser to: `http://localhost:4173/`

---

## 8. Deployment

### Option 1: Deploy to Vercel

```bash
# Install Vercel CLI globally (first time only)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Follow prompts:**
1. Set up and deploy? → Yes
2. Which scope? → Select your account
3. Link to existing project? → No
4. Project name? → posts (or your preferred name)
5. Directory? → ./ (current directory)
6. Override settings? → No

### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI globally (first time only)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy

# Deploy to production
netlify deploy --prod --dir=dist
```

### Option 3: Manual Deployment (Traditional Hosting)

```bash
# 1. Build the application
npm run build

# 2. Upload contents of 'dist' folder to your web server
# Use FTP, SCP, or hosting control panel to upload files

# 3. Configure server to serve index.html for all routes
# (Required for React Router to work)
```

**Server Configuration Examples:**

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 9. Git Commands

### Initialize Git (if not already initialized)

```bash
# Check if git is initialized
git status

# Initialize git (if needed)
git init
```

### Daily Git Workflow

```bash
# 1. Check current status
git status

# 2. Add all changes
git add .

# 3. Commit changes
git commit -m "Description of changes"

# 4. Push to remote
git push origin branch-name
```

### Pull Latest Changes

```bash
# Pull latest from main branch
git pull origin main

# Or if on feature branch
git pull origin claude/review-and-modify-app-011CUrJDA3fYTRP1CdnKUdSu
```

### Merge with Main Branch

```bash
# Fetch latest from main
git fetch origin main

# Merge main into current branch
git merge origin/main

# Push merged changes
git push origin your-branch-name
```

### Common Git Operations

```bash
# View commit history
git log --oneline

# View current branch
git branch

# Create new branch
git checkout -b new-branch-name

# Switch branches
git checkout branch-name

# Discard local changes
git checkout -- .

# View changes
git diff
```

---

## 10. Troubleshooting Commands

### Fix Common Issues

#### Problem: Port Already in Use

```bash
# Find process using port 5173
# Linux/Mac
lsof -i :5173

# Windows (PowerShell)
netstat -ano | findstr :5173

# Kill the process
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

#### Problem: Module Not Found

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Windows
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

#### Problem: Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Windows
Remove-Item -Recurse -Force node_modules/.vite

# Rebuild
npm run build
```

#### Problem: TypeScript Errors

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check specific file
npx tsc --noEmit path/to/file.tsx
```

#### Problem: Environment Variables Not Loading

```bash
# Restart dev server (Ctrl + C, then npm run dev)

# Check .env file exists
cat .env

# Verify variable name starts with VITE_
# Must be: VITE_API_URL (not API_URL)
```

---

## 📚 Complete Command Sequence Summary

### First Time Setup (Run Once)

```bash
# 1. Navigate to project
cd /d/senior/Learning/"New folder"/todo-main/posts

# 2. Create .env file
echo "VITE_API_URL=http://localhost:1337" > .env

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

### Daily Development Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start dev server
npm run dev

# 3. Make changes to code
# ... (edit files in VS Code)

# 4. Test in browser
# Open http://localhost:5173/

# 5. Commit changes
git add .
git commit -m "Your message"
git push origin your-branch

# 6. Stop dev server when done
# Ctrl + C
```

### Before Deployment

```bash
# 1. Test build locally
npm run build
npm run preview

# 2. Check for errors
npx tsc --noEmit

# 3. Deploy
vercel --prod
# or
netlify deploy --prod --dir=dist
```

---

## 🚀 Quick Command Reference

### Development
```bash
npm install           # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Git
```bash
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to remote
git pull origin main # Pull from remote
```

### Troubleshooting
```bash
rm -rf node_modules  # Delete node_modules
npm install          # Reinstall dependencies
npm cache clean --force  # Clear npm cache
```

### Checking
```bash
node --version       # Check Node.js version
npm --version        # Check npm version
git --version        # Check Git version
npm list --depth=0   # List installed packages
```

---

## 📝 Command Checklist

Copy this checklist for your first setup:

```
☐ 1. Check Node.js installed (node --version)
☐ 2. Navigate to project folder (cd posts)
☐ 3. Create .env file
☐ 4. Add VITE_API_URL to .env
☐ 5. Run npm install
☐ 6. Run npm run dev
☐ 7. Open http://localhost:5173/
☐ 8. Verify login page loads
☐ 9. Make sure Strapi backend is running
☐ 10. Test login functionality
```

---

## ⚠️ Important Notes

### Backend Requirement
```bash
# Make sure Strapi backend is running!
# The frontend needs the backend at http://localhost:1337

# Check if backend is running:
# Open http://localhost:1337/admin in browser
```

### Environment Variables
```bash
# All Vite env variables MUST start with VITE_
# Example:
VITE_API_URL=http://localhost:1337  ✅ Correct
API_URL=http://localhost:1337        ❌ Won't work!
```

### Port Numbers
```
Frontend (Vite):     http://localhost:5173
Backend (Strapi):    http://localhost:1337
Preview:             http://localhost:4173
```

---

## 🎯 Success Indicators

You'll know everything is working when:

✅ `npm install` completes without errors
✅ `npm run dev` starts server successfully
✅ Browser opens to `http://localhost:5173/`
✅ Login page loads with styling
✅ No console errors in browser DevTools (F12)
✅ Can make API calls to backend
✅ Authentication works (login/register)

---

## 🆘 Need Help?

If you encounter issues:

1. **Check error messages** - Read the terminal output carefully
2. **Verify Node.js version** - Should be 18+ or 20+
3. **Check .env file** - Ensure VITE_API_URL is correct
4. **Backend running?** - Strapi must be running on port 1337
5. **Clear cache** - `npm cache clean --force`
6. **Reinstall** - Delete node_modules and run `npm install`
7. **Check ports** - Ensure 5173 is not already in use

---

**END OF COMMANDS GUIDE**

You now have every command needed to run this application! 🚀
