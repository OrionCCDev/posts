// src/api/config.ts
import axios from 'axios';

// ============================================
// WHY AXIOS?
// ============================================
/*
Purpose: HTTP client for making API requests
Why not fetch?
- Axios has better API
- Built-in interceptors
- Automatic JSON parsing
- Better error handling
- Request/response transformation
*/

// ============================================
// ENVIRONMENT VARIABLES
// ============================================
// Purpose: Load config from .env file
// Why: Different URLs for dev/staging/production
// Vite exposes env vars via import.meta.env
// Must start with VITE_ to be accessible
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

// ============================================
// CREATE AXIOS INSTANCE
// ============================================
// Purpose: Pre-configured HTTP client
// Why: Set defaults once, use everywhere
// axios.create() returns new instance with custom config
const api = axios.create({
  // Base URL prepended to all requests
  // Example: api.get('/posts') → http://localhost:1337/api/posts
  baseURL: API_BASE_URL,
  
  // Max time to wait for response (10 seconds)
  // Prevents hanging requests
  timeout: API_TIMEOUT,
  
  // Default headers sent with every request
  headers: {
    'Content-Type': 'application/json',  // We send JSON
    'Accept': 'application/json',        // We expect JSON
  },
});

// ============================================
// EXPORT
// ============================================
// Purpose: Make instance available to other files
// Usage: import api from './config'
export default api;

// ============================================
// BENEFITS OF THIS APPROACH
// ============================================
/*
1. Centralized Configuration:
   - Change base URL in one place
   - All requests updated automatically

2. Type Safety:
   - TypeScript knows api structure
   - Auto-completion in IDE

3. Reusability:
   - Import once
   - Use in all services

4. Consistency:
   - Same config everywhere
   - No duplicate code

5. Environment Flexibility:
   - Dev: localhost:1337
   - Staging: staging-api.com
   - Prod: api.com
   - Just change .env
*/