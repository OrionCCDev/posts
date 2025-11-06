// src/pages/Users.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/services/userService';
import { User } from '../types/user.types';

// ============================================
// USERS PAGE COMPONENT
// ============================================
// Purpose: Display all users from Strapi
// Features: List users, view details, navigate back
const Users = () => {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Users array state
  // Stores all users fetched from Strapi
  const [users, setUsers] = useState<User[]>([]);
  
  // Loading state
  // Tracks if API call is in progress
  const [loading, setLoading] = useState(true);
  
  // Navigation hook
  const navigate = useNavigate();

  // ==========================================
  // LOAD USERS ON MOUNT
  // ==========================================
  // useEffect with empty dependency array
  // Runs once when component first renders
  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================
  // LOAD USERS FUNCTION
  // ==========================================
  // Purpose: Fetch all users from Strapi
  // Endpoint: GET /api/users
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      // userService.getAll() calls GET /api/users
      // Strapi returns array of users directly (not wrapped)
      const data = await userService.getAll();
      
      // Update state with users
      setUsers(data);
      
      console.log('✅ Loaded users from Strapi:', data.length);
      
    } catch (error) {
      console.error('❌ Failed to load users:', error);
      // Could add error state here
      
    } finally {
      // Always stop loading (success or error)
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="card text-center">
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p className="mt-2">Loading users from Strapi...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <div className="card">
        
        {/* ---------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------- */}
        <div className="flex justify-between items-center mb-4">
          <h1>All Users ({users.length})</h1>
          
          {/* Back button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* USERS LIST OR EMPTY STATE */}
        {/* ---------------------------------------- */}
        {users.length === 0 ? (
          // Empty state
          <div className="alert alert-info">
            <p>No users found.</p>
          </div>
        ) : (
          // Users grid
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              // USER CARD
              <div key={user.id} className="card">
                <div className="flex justify-between items-start">
                  
                  {/* User info */}
                  <div>
                    <h3 className="mb-1">{user.username}</h3>
                    <p className="text-secondary text-sm">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-secondary text-sm">
                      <strong>User ID:</strong> {user.id}
                    </p>
                    
                    {/* Account status badges */}
                    <div className="flex gap-1 mt-1">
                      {user.confirmed && (
                        <span className="text-sm" style={{ 
                          padding: '2px 8px', 
                          backgroundColor: 'var(--success-color)', 
                          color: 'white',
                          borderRadius: '4px'
                        }}>
                          ✓ Confirmed
                        </span>
                      )}
                      {user.blocked && (
                        <span className="text-sm" style={{ 
                          padding: '2px 8px', 
                          backgroundColor: 'var(--danger-color)', 
                          color: 'white',
                          borderRadius: '4px'
                        }}>
                          ⊘ Blocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;