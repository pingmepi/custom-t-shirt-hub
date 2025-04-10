
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

      const mockSession = {
        access_token: "mock-token",
        refresh_token: "mock-refresh",
        user: mockUser
      } as unknown as Session;

      setUser(mockUser);
      setSession(mockSession);
      setUserProfile(mockProfile);
      console.log("[AuthManager] Test user sign in complete");
      return;
    }

    try {
      // Sign in with Supabase
      const { user: authUser, session: authSession, error } = await authService.signInWithEmailAndPassword(email, password);
      
      if (error) {
        throw error;
      }

      if (authSession) {
        setSession(authSession);
        setUser(authUser);
        
        // Fetch user profile
        console.log("[AuthManager] Fetching user profile after successful login");
        const profile = await authService.fetchUserProfile(authUser!.id);
        setUserProfile(profile);
        
        // Handle remember me
        if (rememberMe) {
          console.log("[AuthManager] Remember me enabled, refreshing session for persistence");
          await authService.refreshSession(authSession.refresh_token);
        } else {
          console.log("[AuthManager] Remember me not enabled");
        }
      }
    } catch (error: any) {
      console.error("[AuthManager] Sign in process failed:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  }, [testUser]);

  /**
   * Sign up a new user
   */
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    console.log("[AuthManager] Attempting to sign up user:", email);
    try {
      const { user: authUser, session: authSession, error } = 
        await authService.signUpWithEmailAndPassword(email, password, fullName);
      
      if (error) {
        throw error;
      }

      if (authUser) {
        // Check if email confirmation is required
        if (authSession) {
          console.log("[AuthManager] Sign up successful with auto-login for:", authUser.email);
          setSession(authSession);
          setUser(authUser);
          
          // Fetch or create user profile after a brief delay to allow the trigger to create it
          console.log("[AuthManager] Waiting for database trigger to create profile");
          setTimeout(async () => {
            console.log("[AuthManager] Checking for newly created profile");
            const profile = await authService.fetchUserProfile(authUser.id);
            
            // If profile doesn't exist, create it manually
            if (!profile) {
              console.log("[AuthManager] Profile not found, creating it manually");
              const { profile: newProfile, error: profileError } = 
                await authService.createOrUpdateProfile(authUser.id, fullName);
                
              if (profileError) {
                console.error("[AuthManager] Error creating profile manually:", profileError);
              } else if (newProfile) {
                console.log("[AuthManager] Profile created manually:", newProfile);
                setUserProfile(newProfile);
              }
            } else {
              console.log("[AuthManager] Profile created by trigger successfully:", profile);
              setUserProfile(profile);
            }
          }, 500);
        } else {
          console.log("[AuthManager] Sign up successful, confirmation required for:", authUser.email);
          toast.info("Please check your email to confirm your account");
        }
      }
    } catch (error: any) {
      console.error("[AuthManager] Sign up process failed:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    console.log("[AuthManager] Attempting to sign out user");
    try {
      // For test user
      if (user?.email === "kmandalam@gmail.com" || user?.id === "0ad70049-b2a7-4248-a395-811665c971fe") {
        console.log("[AuthManager] Signing out test user");
        setUser(null);
        setSession(null);
        setUserProfile(null);
        testUser.clearTestUser();
        console.log("[AuthManager] Test user signed out, localStorage cleared");
        return;
      }

      const { error } = await authService.signOut();
      if (error) {
        throw error;
      }

      console.log("[AuthManager] User signed out successfully");
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error: any) {
      console.error("[AuthManager] Sign out process failed:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  }, [user, testUser]);

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
    signUp,
    signOut,
    isAuthenticated: !!user,
    fetchUserProfile: authService.fetchUserProfile,
    getCurrentSession: authService.getCurrentSession,
    loadTestUser: testUser.loadTestUser
  };
};
