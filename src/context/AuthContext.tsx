
import { createContext, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthManager } from "@/hooks/useAuthManager";

// Create the auth context with the types from useAuthManager
const AuthContext = createContext<ReturnType<typeof useAuthManager> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthManager();
  const { 
    setUser, 
    setSession, 
    setUserProfile, 
    setLoading, 
    fetchUserProfile,
    getCurrentSession,
    loadTestUser
  } = auth;

  useEffect(() => {
    console.log("[Auth] Setting up auth state listener");

    // Check for remembered test user first
    const { user: testUser, profile: testProfile } = loadTestUser();
    if (testUser) {
      console.log("[Auth] Restored test user session from localStorage");
      setUser(testUser);
      setUserProfile(testProfile);
      setSession({ user: testUser } as any); // Mock session
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("[Auth] Auth state changed:", event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Fetch profile data separately to avoid blocking the auth state change
        if (newSession?.user) {
          console.log("[Auth] New session detected, fetching user profile");
          setTimeout(async () => {
            const profile = await fetchUserProfile(newSession.user.id);
            setUserProfile(profile);
            console.log("[Auth] User profile updated after auth state change:", profile);
          }, 0);
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
        const { session: existingSession, error } = await getCurrentSession();

        if (error) {
          console.error("[Auth] Error getting session:", error);
          return;
        }

        if (existingSession) {
          console.log("[Auth] Found existing session for user:", existingSession.user?.email);
          
          setSession(existingSession);
          setUser(existingSession.user);
          
          // Fetch user profile
          console.log("[Auth] Fetching profile for existing session user");
          const profile = await fetchUserProfile(existingSession.user.id);
          setUserProfile(profile);
          console.log("[Auth] Existing user profile set:", profile);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log("[Auth] Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [
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
