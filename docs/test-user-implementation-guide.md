# Test User Implementation Guide

This document provides a comprehensive guide for implementing test user functionality in a React application without relying on external authentication services like Supabase. This is useful for development, testing, and demonstration purposes.

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Code Snippets](#code-snippets)
   - [useTestUser Hook](#usetestuser-hook)
   - [Authentication Manager Integration](#authentication-manager-integration)
   - [Auth Context Integration](#auth-context-integration)
   - [Auth Service Integration](#auth-service-integration)
   - [API Service Integration](#api-service-integration)
4. [Testing and Verification](#testing-and-verification)
5. [Security Considerations](#security-considerations)
6. [Best Practices](#best-practices)

## Overview

The test user functionality allows developers to bypass the actual authentication system during development and testing. It creates a mock user session that mimics a real authenticated user, enabling testing of protected routes and features without needing to authenticate with a real backend service.

Key features of this implementation:
- Mock user credentials and session data
- LocalStorage persistence for session continuity
- Seamless integration with existing authentication flows
- Support for test user profile data
- Handling of test user data in API calls

## Implementation Steps

1. Create a `useTestUser` hook to manage test user functionality
2. Integrate the hook with your authentication manager
3. Update the authentication context to handle test users
4. Modify API services to handle test user data
5. Add test user handling to components that need special behavior

## Code Snippets

### useTestUser Hook

Create a new file `src/hooks/useTestUser.ts`:

```typescript
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";

/**
 * Hook for managing test user functionality
 */
export const useTestUser = () => {
  const TEST_USER_EMAIL = "test@example.com";
  const TEST_USER_PASSWORD = "testpassword";
  const TEST_USER_STORAGE_KEY = "testUserRemembered";

  /**
   * Checks if credentials match the test user
   */
  const isTestUser = (email: string, password: string): boolean => {
    return email === TEST_USER_EMAIL && password === TEST_USER_PASSWORD;
  };

  /**
   * Creates mock data for the test user
   */
  const createTestUserData = () => {
    console.log("[TestUser] Creating mock test user data");

    const mockUser = {
      id: "test-user-id-12345", // Use a consistent ID for the test user
      email: TEST_USER_EMAIL,
      user_metadata: {
        name: "Test User",
        full_name: "Test User"
      },
      app_metadata: {
        provider: "email",
        providers: ["email"]
      },
      aud: "authenticated",
      role: "authenticated"
    } as unknown as User;

    const mockProfile = {
      id: mockUser.id,
      full_name: "Test User",
      role: "user" as const,
      created_at: new Date().toISOString()
    };

    return { mockUser, mockProfile };
  };

  /**
   * Saves test user data to localStorage if remember me is enabled
   */
  const saveTestUser = (rememberMe: boolean) => {
    const { mockUser, mockProfile } = createTestUserData();

    if (rememberMe) {
      try {
        localStorage.setItem(TEST_USER_STORAGE_KEY, JSON.stringify({
          user: mockUser,
          profile: mockProfile,
          timestamp: new Date().toISOString()
        }));
        console.log("[TestUser] Test user saved to localStorage with remember me");
      } catch (e) {
        console.error("[TestUser] Failed to save test user to localStorage:", e);
      }
    }

    return { mockUser, mockProfile };
  };

  /**
   * Loads test user data from localStorage if it exists
   */
  const loadTestUser = () => {
    try {
      const storedData = localStorage.getItem(TEST_USER_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        console.log("[TestUser] Found saved test user in localStorage");
        return {
          user: parsed.user as User,
          profile: parsed.profile as UserProfile
        };
      }
    } catch (e) {
      console.error("[TestUser] Failed to load test user from localStorage:", e);
    }

    return { user: null, profile: null };
  };

  /**
   * Clears test user data from localStorage
   */
  const clearTestUser = () => {
    try {
      localStorage.removeItem(TEST_USER_STORAGE_KEY);
      console.log("[TestUser] Test user cleared from localStorage");
    } catch (e) {
      console.error("[TestUser] Failed to clear test user from localStorage:", e);
    }
  };

  return {
    isTestUser,
    createTestUserData,
    saveTestUser,
    loadTestUser,
    clearTestUser
  };
};
```

### Authentication Manager Integration

Update your authentication manager hook (`src/hooks/useAuthManager.ts`):

```typescript
import { useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";
import { useTestUser } from "./useTestUser";
import * as authService from "@/services/authService";
import { toast } from "sonner";

/**
 * Hook for managing authentication state and operations
 */
export const useAuthManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const testUser = useTestUser();

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string, rememberMe = false) => {
    console.log("[AuthManager] Attempting to sign in user:", email, "Remember me:", rememberMe);

    // Handle test user
    if (testUser.isTestUser(email, password)) {
      console.log("[AuthManager] Using test credentials");
      const { mockUser, mockProfile } = testUser.saveTestUser(rememberMe);

      // Create a more complete mock session
      const mockSession = {
        access_token: "mock-token-" + Date.now(),
        refresh_token: "mock-refresh-" + Date.now(),
        user: mockUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        expires_in: 3600,
        token_type: "bearer",
        provider_token: null,
        provider_refresh_token: null
      } as unknown as Session;

      // Set the session in localStorage to help with persistence
      try {
        localStorage.setItem('auth-session', JSON.stringify({
          access_token: mockSession.access_token,
          refresh_token: mockSession.refresh_token,
          expires_at: mockSession.expires_at,
          expires_in: mockSession.expires_in,
          token_type: "bearer",
          user: mockUser
        }));
        console.log("[AuthManager] Set auth session in localStorage for test user");
      } catch (e) {
        console.error("[AuthManager] Failed to set auth session in localStorage:", e);
      }

      setUser(mockUser);
      setSession(mockSession);
      setUserProfile(mockProfile);
      console.log("[AuthManager] Test user sign in complete");
      return;
    }

    try {
      // Regular sign in logic for non-test users
      const { user: authUser, session: authSession, error } = await authService.signInWithEmailAndPassword(email, password);

      if (error) throw error;

      // Rest of your sign in logic...
    } catch (error: any) {
      console.error("[AuthManager] Sign in process failed:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  }, [testUser]);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    console.log("[AuthManager] Attempting to sign out user");
    try {
      // For test user
      if (user?.email === "test@example.com" || user?.id === "test-user-id-12345") {
        console.log("[AuthManager] Signing out test user");
        setUser(null);
        setSession(null);
        setUserProfile(null);
        testUser.clearTestUser();
        console.log("[AuthManager] Test user signed out, localStorage cleared");
        return;
      }

      // Regular sign out logic for non-test users
      const { error } = await authService.signOut();
      if (error) {
        throw error;
      }

      // Rest of your sign out logic...
    } catch (error: any) {
      console.error("[AuthManager] Sign out process failed:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  }, [user, testUser]);

  /**
   * Load test user from localStorage if it exists
   */
  const loadTestUser = useCallback(() => {
    return testUser.loadTestUser();
  }, [testUser]);

  // Rest of your authentication manager code...

  return {
    user,
    userProfile,
    session,
    loading,
    setLoading,
    setUser,
    setSession,
    setUserProfile,
    signIn,
    signOut,
    // Other methods...
    isAuthenticated: !!user,
    fetchUserProfile: authService.fetchUserProfile,
    getCurrentSession: authService.getCurrentSession,
    loadTestUser
  };
};
```

### Auth Context Integration

Update your authentication context (`src/context/AuthContext.tsx`):

```typescript
import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthManager } from "@/hooks/useAuthManager";

// Create the auth context with the types from useAuthManager
const AuthContext = createContext<ReturnType<typeof useAuthManager> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthManager();
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    setUser,
    setSession,
    setUserProfile,
    setLoading,
    fetchUserProfile,
    getCurrentSession,
    loadTestUser
  } = auth;

  // This effect will only run once on component mount
  useEffect(() => {
    if (isInitialized) return;

    console.log("[Auth] Setting up auth state listener");

    // Check for remembered test user first
    const { user: testUser, profile: testProfile } = loadTestUser();
    if (testUser) {
      console.log("[Auth] Restored test user session from localStorage");
      setUser(testUser);
      setUserProfile(testProfile);

      // Create a more complete mock session
      const mockSession = {
        access_token: "mock-token-" + Date.now(),
        refresh_token: "mock-refresh-" + Date.now(),
        user: testUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        expires_in: 3600,
        token_type: "bearer",
        provider_token: null,
        provider_refresh_token: null
      } as Session;

      setSession(mockSession);

      // Store the mock session in localStorage to help with persistence
      try {
        localStorage.setItem('auth-session', JSON.stringify({
          access_token: mockSession.access_token,
          refresh_token: mockSession.refresh_token,
          expires_at: mockSession.expires_at,
          expires_in: mockSession.expires_in,
          token_type: "bearer",
          user: testUser
        }));
        console.log("[Auth] Set auth session in localStorage for test user");
      } catch (e) {
        console.error("[Auth] Failed to set auth session in localStorage:", e);
      }

      setLoading(false);
      setIsInitialized(true);
      return;
    }

    // Regular authentication logic for non-test users
    // ...

    return () => {
      // Cleanup logic
    };
  }, [
    isInitialized,
    setUser,
    setSession,
    setUserProfile,
    setLoading,
    fetchUserProfile,
    getCurrentSession,
    loadTestUser
  ]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Auth Service Integration

Update your authentication service (`src/services/authService.ts`):

```typescript
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/types";

// Other authentication service functions...

/**
 * Fetches a user profile by ID
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log("[AuthService] Fetching profile for user:", userId);

    // Check if we have a session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log("[AuthService] No active session");
      return null;
    }

    console.log("[AuthService] Using session for user:", sessionData.session.user.id);

    // Check if we're trying to fetch the profile for the current authenticated user
    if (sessionData.session.user.id !== userId) {
      console.warn("[AuthService] Attempting to fetch profile for a different user than the authenticated one");
      // For security, we'll only allow fetching the current user's profile
      // unless we implement admin functionality later
    }

    // Handle test user specially
    if (userId === "test-user-id-12345") {
      console.log("[AuthService] Detected test user ID, using mock profile");
      return {
        id: userId,
        full_name: "Test User",
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;
    }

    // Regular profile fetching logic for non-test users
    // ...
  } catch (error) {
    console.error("[AuthService] Error fetching user profile:", error);
    return null;
  }
}

/**
 * Creates a basic user profile if one doesn't exist
 */
async function createUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log("[AuthService] Creating new profile for user:", userId);

    // Handle test user specially
    if (userId === "test-user-id-12345") {
      console.log("[AuthService] Creating mock profile for test user");
      const testProfile = {
        id: userId,
        full_name: "Test User",
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;

      return testProfile;
    }

    // Regular profile creation logic for non-test users
    // ...
  } catch (error) {
    console.error("[AuthService] Error creating user profile:", error);
    return null;
  }
}

// Other authentication service functions...
```

### API Service Integration

Update your API services to handle test user data. Here's an example for a design API service:

```typescript
import { supabase } from "@/integrations/supabase/client";
import { DesignData, QuestionResponse, UserStylePreference } from "@/lib/types";
import { toast } from "sonner";

interface SaveDesignParams {
  userId: string | undefined;
  questionResponses: Record<string, QuestionResponse | string>;
  designData: DesignData;
  previewUrl?: string;
  designId?: string; // Optional designId for updating existing designs
}

interface SaveDesignResult {
  success: boolean;
  designId?: string;
  error?: string;
}

export const useDesignAPI = () => {
  const saveDesign = async ({
    userId,
    questionResponses,
    designData,
    previewUrl = "/design-flow.png",
    designId
  }: SaveDesignParams): Promise<SaveDesignResult> => {
    if (!userId) {
      console.error("Cannot save design: No user ID provided");
      return { success: false, error: "No user ID provided" };
    }

    try {
      console.log("Saving design for user:", userId);

      // For test user, completely bypass database operations
      if (userId === "test-user-id-12345") {
        console.log("Using test user - bypassing database operations completely");

        // Generate a mock design ID or use existing one
        const mockDesignId = designId || "test-design-" + Date.now();

        // Store design data in localStorage for test user
        try {
          if (designId) {
            // Update existing design
            console.log(`Updating existing test user design with ID: ${designId}`);
            const testUserDesigns = JSON.parse(localStorage.getItem('testUserDesigns') || '[]');
            const updatedDesigns = testUserDesigns.map((design: any) => {
              if (design.id === designId) {
                return {
                  ...design,
                  question_responses: questionResponses,
                  design_data: designData,
                  preview_url: previewUrl,
                  updated_at: new Date().toISOString()
                };
              }
              return design;
            });
            localStorage.setItem('testUserDesigns', JSON.stringify(updatedDesigns));
            console.log("Updated test user design in localStorage");
          } else {
            // Create new design
            const testUserDesigns = JSON.parse(localStorage.getItem('testUserDesigns') || '[]');
            testUserDesigns.push({
              id: mockDesignId,
              user_id: userId,
              question_responses: questionResponses,
              design_data: designData,
              preview_url: previewUrl,
              name: "My Test Design",
              created_at: new Date().toISOString()
            });
            localStorage.setItem('testUserDesigns', JSON.stringify(testUserDesigns));
            console.log("Saved new test user design to localStorage");
          }
        } catch (e) {
          console.error("Failed to save test user design to localStorage:", e);
        }

        // Simulate a delay to make it feel like a real save
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("Mock design saved with ID:", mockDesignId);
        toast.success("Design saved successfully!");
        return {
          success: true,
          designId: mockDesignId
        };
      }

      // Regular database operations for non-test users
      // ...
    } catch (error) {
      console.error("Error saving design:", error);
      toast.error("Failed to save design");
      return {
        success: false,
        error: "Failed to save design"
      };
    }
  };

  const fetchDesigns = async (userId: string) => {
    try {
      console.log("Fetching designs for user:", userId);

      // For test user, use localStorage
      if (userId === "test-user-id-12345") {
        console.log("Fetching designs for test user from localStorage");
        try {
          const testUserDesigns = JSON.parse(localStorage.getItem('testUserDesigns') || '[]');
          return testUserDesigns;
        } catch (err) {
          console.error("Error loading test user designs:", err);
          return [];
        }
      }

      // Regular database operations for non-test users
      // ...
    } catch (error) {
      console.error("Error fetching designs:", error);
      return [];
    }
  };

  // Other API methods...

  return {
    saveDesign,
    fetchDesigns,
    // Other methods...
  };
};
```

## Testing and Verification

To verify that your test user implementation is working correctly:

1. **Login Test**:
   - Try logging in with the test user credentials (`test@example.com` / `testpassword`)
   - Verify that you're redirected to the authenticated area without any API calls to your auth provider

2. **Session Persistence Test**:
   - Log in with the test user and check "Remember me"
   - Close the browser and reopen it
   - Verify that you're still logged in as the test user

3. **API Operations Test**:
   - Create, read, update, and delete operations should work with the test user
   - Verify that data is stored in localStorage instead of making API calls

4. **Logout Test**:
   - Log out as the test user
   - Verify that the session is cleared and you're redirected to the login page

## Security Considerations

1. **Development Only**: Test user functionality should be disabled in production builds
   ```typescript
   const isTestUser = (email: string, password: string): boolean => {
     if (process.env.NODE_ENV === 'production') return false;
     return email === TEST_USER_EMAIL && password === TEST_USER_PASSWORD;
   };
   ```

2. **Secure Test Credentials**: Even though this is for testing, avoid using obvious credentials

3. **Clear Data**: Provide a way to clear test user data from localStorage

4. **Limit Capabilities**: Consider limiting what the test user can do compared to real users

## Best Practices

1. **Clear Logging**: Use descriptive log messages to indicate when test user functionality is being used

2. **Consistent User ID**: Use a consistent ID for the test user to make it easy to identify in code

3. **Minimal Code Changes**: Design your implementation to require minimal changes to your main application code

4. **Feature Flags**: Consider using feature flags to enable/disable test user functionality

5. **Documentation**: Keep this document updated with any changes to the test user implementation

6. **Code Comments**: Add clear comments in your code to indicate test user specific logic

7. **Separate Test Data**: Keep test user data separate from real user data to avoid confusion

By following this guide, you can implement a robust test user system that allows for development and testing without relying on external authentication services.
