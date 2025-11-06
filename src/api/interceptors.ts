// src/api/interceptors.ts
import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import api from './config';

// ============================================
// WHAT ARE INTERCEPTORS?
// ============================================
/*
Purpose: Middleware that runs before/after every request
Think of it like airport security:
- Request Interceptor = Security before boarding (add ID)
- Response Interceptor = Customs after landing (check passport)

Benefits:
- Add auth token automatically
- Log all requests
- Handle errors globally
- Transform data
- Retry failed requests
*/

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Purpose: Modify request before it's sent
// Runs BEFORE every API call
api.interceptors.request.use(
  // Success function - modify config
  (config: InternalAxiosRequestConfig) => {
    
    // ----------------------------------------
    // ADD PERFORMANCE TRACKING
    // ----------------------------------------
    // Purpose: Measure how long each request takes
    // Why: Identify slow endpoints
    // Date.now() returns current timestamp in milliseconds
    config.metadata = { startTime: Date.now() };

    // ----------------------------------------
    // ADD JWT TOKEN TO HEADERS
    // ----------------------------------------
    // Purpose: Send authentication token with request
    // Why: Strapi needs token to identify user
    // Flow: Login → Get JWT → Save to localStorage → Send with requests
    
    // Get token from localStorage
    // localStorage.getItem() returns string or null
    const token = localStorage.getItem('accessToken');
    
    // If token exists AND headers exist (TypeScript safety check)
    if (token && config.headers) {
      // Add Bearer token to Authorization header
      // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      // "Bearer" is the authentication scheme
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ----------------------------------------
    // LOG REQUEST (Development Only)
    // ----------------------------------------
    // Purpose: See what requests are being made
    // Why: Debugging, understanding API calls
    // import.meta.env.DEV = true in development mode
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }

    // MUST return config
    // If not returned, request won't be sent
    return config;
  },
  
  // Error function - handle request setup errors
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    // Reject promise so calling code knows it failed
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Purpose: Process response after receiving from server
// Runs AFTER every API response
api.interceptors.response.use(
  // Success function - response received successfully
  (response: AxiosResponse) => {
    
    // ----------------------------------------
    // CALCULATE REQUEST DURATION
    // ----------------------------------------
    // Purpose: See how long request took
    // Current time - start time = duration
    const duration = Date.now() - (response.config.metadata?.startTime || 0);

    // ----------------------------------------
    // LOG RESPONSE (Development Only)
    // ----------------------------------------
    if (import.meta.env.DEV) {
      console.log(
        `📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
      );
    }

    // ----------------------------------------
    // WARN ABOUT SLOW REQUESTS
    // ----------------------------------------
    // Purpose: Identify performance issues
    // 3000ms = 3 seconds threshold
    if (duration > 3000) {
      console.warn(`⚠️ Slow request: ${response.config.url} (${duration}ms)`);
    }

    // Return response to calling code
    return response;
  },
  
  // Error function - handle error responses
  (error: AxiosError) => {
    
    // ----------------------------------------
    // CHECK IF SERVER RESPONDED
    // ----------------------------------------
    // error.response exists if server sent back response (even if error)
    if (error.response) {
      const status = error.response.status;

      // ----------------------------------------
      // HANDLE DIFFERENT HTTP STATUS CODES
      // ----------------------------------------
      switch (status) {
        case 400:
          // Bad Request - Invalid data sent to server
          console.error('❌ Bad Request:', error.response.data);
          break;
          
        case 401:
          // Unauthorized - Invalid or expired token
          // Action: Clear auth and redirect to login
          console.error('🔒 Unauthorized - Invalid or expired token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - Valid token but insufficient permissions
          console.error('⛔ Forbidden - Insufficient permissions');
          break;
          
        case 404:
          // Not Found - Resource doesn't exist
          console.error('🔍 Not Found');
          break;
          
        case 500:
          // Internal Server Error - Something broke on server
          console.error('💥 Server Error');
          break;
          
        default:
          console.error(`❌ Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // ----------------------------------------
      // NO RESPONSE FROM SERVER
      // ----------------------------------------
      // Request was sent but no response received
      // Possible reasons:
      // - No internet
      // - Server is down
      // - Firewall blocking
      // - Timeout
      console.error('📡 No response from server - Check if Strapi is running');
    } else {
      // ----------------------------------------
      // REQUEST SETUP ERROR
      // ----------------------------------------
      // Something wrong before request was sent
      console.error('❌ Error:', error.message);
    }

    // Reject promise so calling code can handle error
    return Promise.reject(error);
  }
);

// ============================================
// TYPESCRIPT MODULE AUGMENTATION
// ============================================
// Purpose: Add custom properties to Axios types
// Why: TypeScript doesn't know about our metadata property
// This tells TypeScript: "config can have metadata"
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// ============================================
// EXPORT
// ============================================
// Export configured api instance with interceptors
export default api;

// ============================================
// HOW IT ALL WORKS TOGETHER
// ============================================
/*
Example: User clicks "Login" button

1. Component calls: authService.login({email, password})

2. authService calls: api.post('/auth/local', data)

3. REQUEST INTERCEPTOR runs:
   - Adds metadata: { startTime: 1234567890 }
   - Checks localStorage for token (none yet, first login)
   - Logs: "📤 POST /auth/local"
   - Returns modified config

4. Axios sends request:
   POST http://localhost:1337/api/auth/local
   Body: { identifier: "john@example.com", password: "..." }

5. Strapi processes:
   - Checks credentials
   - Returns { jwt: "...", user: {...} }

6. RESPONSE INTERCEPTOR runs:
   - Calculates duration: 234ms
   - Logs: "📥 POST /auth/local - 234ms"
   - Returns response

7. authService receives response:
   - Saves jwt to localStorage
   - Returns user data to component

8. Component redirects to dashboard

9. Dashboard loads user posts:
   - Calls: postService.getAll()
   - Request interceptor NOW adds token (from localStorage)
   - Strapi authenticates request
   - Returns posts

10. Everything works seamlessly!

KEY POINTS:
- Interceptors are global (affect ALL requests)
- Run automatically (no manual calls)
- Token added automatically after login
- Errors handled consistently
- Performance tracked automatically
*/