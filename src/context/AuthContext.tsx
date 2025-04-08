
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
    getCurrentSession
  } = auth;

  // This effect will only run once on component mount
  useEffect(() => {
    if (isInitialized) return;

    console.log("[Auth] Setting up auth state listener");

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("[Auth] Auth state changed:", event, newSession?.user?.email);

        // Handle different auth events
        switch (event) {
          case 'INITIAL_SESSION':
            console.log("[Auth] Initial session established");
            break;
          case 'SIGNED_IN':
            console.log("[Auth] User signed in");
            break;
          case 'SIGNED_OUT':
            console.log("[Auth] User signed out");
            setUserProfile(null);
            break;
          case 'TOKEN_REFRESHED':
            console.log("[Auth] Token refreshed");
            break;
          case 'USER_UPDATED':
            console.log("[Auth] User updated");
            break;
          case 'PASSWORD_RECOVERY':
            console.log("[Auth] Password recovery");
            break;
        }

        // Update session and user state
        setSession(newSession);
        setUser(newSession?.user || null);

        // Fetch profile data separately to avoid blocking the auth state change
        if (newSession?.user) {
          console.log("[Auth] New session detected, fetching user profile");
          // Wait a moment to ensure auth is fully initialized
          try {
            // First ensure the session is valid
            await new Promise(resolve => setTimeout(resolve, 800));

            const profile = await fetchUserProfile(newSession.user.id);
            if (profile) {
              setUserProfile(profile);
              console.log("[Auth] User profile updated after auth state change:", profile);
            } else {
              console.warn("[Auth] No profile found after auth state change");
            }
          } catch (profileError) {
            console.error("[Auth] Error fetching profile after auth state change:", profileError);
          }
        } else {
          console.log("[Auth] No session detected, clearing user profile");
          setUserProfile(null);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    const checkUser = async () => {
      try {
        // First, clear any stale data
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          console.log("[Auth] No existing session found during initialization");
          setLoading(false);
          setIsInitialized(true);
          return;
        }

        // Get the session through our service to ensure proper handling
        const { session: existingSession, error } = await getCurrentSession();

        if (error) {
          console.error("[Auth] Error getting session:", error);
          setLoading(false);
          setIsInitialized(true);
          return;
        }

        if (existingSession) {
          console.log("[Auth] Found existing session for user:", existingSession.user?.email);

          setSession(existingSession);
          setUser(existingSession.user);

          // Fetch user profile
          console.log("[Auth] Fetching profile for existing session user");
          try {
            // Wait a moment to ensure auth is fully initialized
            await new Promise(resolve => setTimeout(resolve, 800));

            const profile = await fetchUserProfile(existingSession.user.id);
            if (profile) {
              setUserProfile(profile);
              console.log("[Auth] Existing user profile set:", profile);
            } else {
              console.warn("[Auth] No profile found for user, may need to create one");
              // Clear user profile to avoid stale data
              setUserProfile(null);
            }
          } catch (profileError) {
            console.error("[Auth] Error fetching existing user profile:", profileError);
            // Clear user profile on error to avoid stale data
            setUserProfile(null);
          }
        } else {
          // No session found, clear all auth state
          console.log("[Auth] No valid session found, clearing auth state");
          setUser(null);
          setSession(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("[Auth] Error during session initialization:", error);
        // Clear all auth state on error
        setUser(null);
        setSession(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkUser();

    return () => {
      console.log("[Auth] Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [
    isInitialized,
    setUser,
    setSession,
    setUserProfile,
    setLoading,
    fetchUserProfile,
    getCurrentSession
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
