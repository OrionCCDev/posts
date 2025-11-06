// src/types/post.types.ts

import { User } from './user.types';

// ============================================
// POST TYPE (Strapi Structure)
// ============================================
// Purpose: Define post as Strapi stores it
// Why: Match Strapi's data structure exactly
// This includes the nested author relation
export interface Post {
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  // Author relation (Strapi format)
  author?: {
    data: {
      id: number;
      attributes: User;
    };
  };
}

// ============================================
// FLAT POST TYPE (For UI Use)
// ============================================
// Purpose: Simplified post structure for React components
// Why: Easier to work with in UI (no nested data.attributes)
// We flatten Strapi's nested structure for convenience
export interface FlatPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author?: User;  // Direct user object (flattened)
}

// ============================================
// WHY TWO TYPES?
// ============================================
/*
Strapi returns:
{
  id: 1,
  attributes: {
    title: "Post",
    author: {
      data: {
        id: 1,
        attributes: {
          username: "john"
        }
      }
    }
  }
}

We convert to FlatPost:
{
  id: 1,
  title: "Post",
  author: {
    id: 1,
    username: "john"
  }
}

Benefits:
- Easier to use in components
- No deep nesting
- Cleaner code
*/