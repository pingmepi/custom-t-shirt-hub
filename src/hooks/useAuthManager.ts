
import { useState, useCallback } from "react";
import { clearAuthData } from "@/utils/authUtils";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";
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

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string, rememberMe = false) => {
    console.log("[AuthManager] Attempting to sign in user:", email, "Remember me:", rememberMe);

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
  }, []);

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
      // Clear state first to ensure UI updates immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);

      // Then attempt to sign out from Supabase
      const { error } = await authService.signOut();
      if (error) {
        console.error("[AuthManager] Error during sign out API call:", error);
        // Even if the API call fails, we've already cleared the local state
        // so the user will appear signed out from the UI perspective
      }

      console.log("[AuthManager] User signed out successfully");

      // Force clear any lingering auth data from localStorage using the utility function
      try {
        clearAuthData();
        console.log("[AuthManager] Cleared auth data from localStorage");
      } catch (storageError) {
        console.error("[AuthManager] Error clearing localStorage:", storageError);
      }

    } catch (error: any) {
      console.error("[AuthManager] Sign out process failed:", error);
      toast.error(error.message || "Failed to sign out");

      // Even if there's an error, try to clear state as a fallback
      setUser(null);
      setSession(null);
      setUserProfile(null);

      throw error;
    }
  }, []);

  /**
   * Send a magic link for passwordless authentication
   */
  const sendMagicLink = useCallback(async (email: string) => {
    console.log("[AuthManager] Sending magic link to:", email);
    try {
      // Get the current origin for the redirect URL
      const origin = window.location.origin;

      // Create a secure redirect URL that doesn't expose tokens in the URL
      const redirectTo = `${origin}/auth/callback`;

      const { error } = await authService.sendMagicLink(email, redirectTo);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error("[AuthManager] Magic link process failed:", error);
      toast.error(error.message || "Failed to send magic link");
      throw error;
    }
  }, []);

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
    sendMagicLink,
    isAuthenticated: !!user,
    fetchUserProfile: authService.fetchUserProfile,
    getCurrentSession: authService.getCurrentSession
  };
};
